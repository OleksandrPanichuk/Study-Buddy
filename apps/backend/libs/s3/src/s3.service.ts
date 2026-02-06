import path from "node:path";
import type {Readable} from "node:stream";
import type {
	IDeleteResult,
	IFileValidationOptions,
	IPresignedUploadUrlResult,
	IUploadOptions,
	IUploadResult,
} from "@app/s3/s3.interfaces";
import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadBucketCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
	type S3ServiceException,
} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {
	BadRequestException,
	HttpException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {v4 as uuid} from "uuid";
import type {Env} from "@/shared/config";

@Injectable()
export class S3Service {
	private readonly client: S3Client;
	private readonly logger: Logger = new Logger(S3Service.name);
	private readonly bucket: string;
	private readonly region: string;
	private readonly maxRetries: number = 3;
	private readonly defaultMaxFileSize: number = 10 * 1024 * 1024; // 10 MB

	constructor(private readonly config: ConfigService<Env>) {
		this.bucket = config.get("AWS_S3_BUCKET_NAME");
		this.region = config.get("AWS_S3_REGION");

		this.client = new S3Client({
			region: this.region,
			endpoint: this.config.get("AWS_S3_ENDPOINT"),
			credentials: {
				accessKeyId: this.config.get("AWS_S3_ACCESS_KEY_ID"),
				secretAccessKey: this.config.get("AWS_S3_SECRET_ACCESS_KEY")
			},
			forcePathStyle: this.config.get("AWS_S3_FORCE_PATH_STYLE") === "true",
			maxAttempts: 1
		});
	}

	public getClient(): S3Client {
		return this.client;
	}

	public async uploadFile(file: Express.Multer.File, options: IUploadOptions = {}): Promise<IUploadResult> {
		try {
			this.validateFile(file, {
				maxSize: options.maxSize,
				allowedMimeTypes: options.allowedMimeTypes
			});

			const key = this.generateKey(file.originalname, options);
			const contentType = options.contentType || file.mimetype;

			const command = new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: file.buffer,
				ContentType: contentType,
				ACL: options.acl || "private",
				Metadata: options.metadata,
				CacheControl: options.cacheControl
			});

			const result = await this.executeWithRetry(() => this.client.send(command));

			const url = this.getPublicUrl(key);

			this.logger.log(`File uploaded successfully: ${key}`);

			return {
				url,
				key,
				bucket: this.bucket,
				size: file.size,
				mimetype: contentType,
				etag: result.ETag
			};
		} catch (error) {
			if (error instanceof HttpException) {
				this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
				throw error;
			}

			this.logger.error(`Unexpected error occurred while uploading file: ${error}`);
			throw new InternalServerErrorException("An unexpected error occurred while uploading file.");
		}
	}

	public async uploadFiles(files: Express.Multer.File[], options: IUploadOptions = {}): Promise<IUploadResult[]> {
		return Promise.all(files.map((file) => this.uploadFile(file, options)));
	}

	public async deleteFile(key: string): Promise<void> {
		try {
			const command = new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: key
			});

			await this.executeWithRetry(() => this.client.send(command));
		} catch (error) {
			this.logger.error(`Failed to delete file with key ${key}: ${error}`);
			throw new InternalServerErrorException("Failed to delete file from S3");
		}
	}

	public async deleteFiles(keys: string[]): Promise<IDeleteResult[]> {
		return Promise.all(
			keys.map(async (key) => {
				try {
					await this.deleteFile(key);
					return {
						key,
						success: true
					};
				} catch (error) {
					return {
						key,
						success: false,
						error: error instanceof Error ? error.message : String(error)
					};
				}
			})
		);
	}

	public async createPresignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
		try {
			const command = new GetObjectCommand({
				Bucket: this.bucket,
				Key: key
			});

			const url = await getSignedUrl(this.client, command, { expiresIn });

			this.logger.log(`Presigned download URL created successfully for key: ${key}`);

			return url;
		} catch (error) {
			this.logger.error(`Failed to create presigned download URL for key ${key}: ${error}`);
			throw new InternalServerErrorException("Failed to create presigned download URL");
		}
	}

	public async createPresignedUploadUrl(
		fileName: string,
		options: IUploadOptions = {},
		expiresIn = 3600
	): Promise<IPresignedUploadUrlResult> {
		try {
			const key = this.generateKey(fileName, options);
			const contentType = options.contentType || this.getMimeTypeFromExtension(fileName);

			const command = new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				ContentType: contentType,
				ACL: options.acl || "private",
				Metadata: options.metadata,
				CacheControl: options.cacheControl
			});

			const uploadUrl = await getSignedUrl(this.client, command, { expiresIn });
			const publicUrl = this.getPublicUrl(key);

			this.logger.log(`Presigned upload URL created successfully for key: ${key}`);

			return {
				uploadUrl,
				key,
				publicUrl,
				bucket: this.bucket,
				expiresIn
			};
		} catch (error) {
			this.logger.error(`Failed to create presigned upload URL for file ${fileName}: ${error}`);
			throw new InternalServerErrorException("Failed to create presigned upload URL");
		}
	}

	public async downloadFile(key: string): Promise<Buffer> {
		try {
			const command = new GetObjectCommand({
				Bucket: this.bucket,
				Key: key
			});

			const response = await this.executeWithRetry(() => this.client.send(command));

			if (!response.Body) {
				throw new NotFoundException(`File with key ${key} has no content`);
			}

			const chunks: Uint8Array[] = [];
			const body = response.Body as Readable;
			for await (const chunk of body) {
				chunks.push(chunk as Uint8Array);
			}

			this.logger.log(`File downloaded successfully: ${key}`);

			return Buffer.concat(chunks);
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
      }
      if (this.isS3Exception(error) && error.$metadata?.httpStatusCode === 404) {
				throw new NotFoundException(`File with key ${key} not found`);
			}
			this.logger.error(`Failed to download file with key ${key}: ${error}`);
			throw new InternalServerErrorException("Failed to download file from S3");
		}
	}

	public async fileExists(key: string): Promise<boolean> {
		try {
			const command = new HeadObjectCommand({
				Bucket: this.bucket,
				Key: key
			});

			await this.executeWithRetry(() => this.client.send(command));
			return true;
		} catch (error) {
			if (this.isS3Exception(error) && error.$metadata?.httpStatusCode === 404) {
				return false;
			}
			this.logger.error(`Failed to check if file exists with key ${key}: ${error}`);
			throw new InternalServerErrorException("Failed to check file existence");
		}
	}

	public async getFileMetadata(key: string): Promise<{
		contentType?: string;
		contentLength?: number;
		lastModified?: Date;
		metadata?: Record<string, string>;
	}> {
		try {
			const command = new HeadObjectCommand({
				Bucket: this.bucket,
				Key: key
			});

			const response = await this.executeWithRetry(() => this.client.send(command));

			return {
				contentType: response.ContentType,
				contentLength: response.ContentLength,
				lastModified: response.LastModified,
				metadata: response.Metadata
			};
		} catch (error) {
			if (this.isS3Exception(error) && error.$metadata?.httpStatusCode === 404) {
				throw new NotFoundException(`File with key ${key} not found`);
			}
			this.logger.error(`Failed to get file metadata for key ${key}: ${error}`);
			throw new InternalServerErrorException("Failed to get file metadata");
		}
	}

	private validateFile(file: Express.Multer.File, options: IFileValidationOptions): void {
		const maxSize = options.maxSize || this.defaultMaxFileSize;

		if (file.size > maxSize) {
			throw new BadRequestException(`File size ${file.size} exceeds maximum allowed size of ${maxSize} bytes.`);
		}

		if (options.allowedMimeTypes?.length > 0 && !options.allowedMimeTypes.includes(file.mimetype)) {
			throw new BadRequestException(
				`File type ${file.mimetype} is not allowed. Allowed types: ${options.allowedMimeTypes.join(",")}`
			);
		}

		if (options.allowedExtensions?.length > 0) {
			const extension = path.extname(file.originalname).toLowerCase();

			if (!options.allowedExtensions.includes(extension)) {
				throw new BadRequestException(
					`File extension ${extension} is not allowed. Allowed extensions: ${options.allowedExtensions.join(",")}`
				);
			}
		}
	}

	private async executeWithRetry<T>(operation: () => Promise<T>, retries: number = this.maxRetries): Promise<T> {
		let lastError: Error | S3ServiceException | unknown;

		for (let attempt = 0; attempt < retries; attempt++) {
			try {
				return await operation();
			} catch (error) {
				lastError = error;

				if (
					this.isS3Exception(error) &&
					error.$metadata?.httpStatusCode >= 400 &&
					error.$metadata?.httpStatusCode < 500
				) {
					throw error;
				}

				if (attempt < retries - 1) {
					const delay = 2 ** attempt * 1000;
					this.logger.warn(`Operation failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`);
					await this.sleep(delay);
				}
			}
		}

		throw lastError;
	}

	private isS3Exception(error: unknown): error is S3ServiceException {
		return (
			typeof error === "object" &&
			error !== null &&
			"$metadata" in error &&
			typeof (error as Record<string, unknown>).$metadata === "object"
		);
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private generateKey(originalName: string, options: IUploadOptions): string {
		const extension = path.extname(originalName).toLowerCase();
		const filename = options.filename || `${uuid()}${extension}`;
		const folder = options.folder ? `${options.folder}/` : "";
		return `${folder}${filename}`;
	}

	private getPublicUrl(key: string): string {
		const endpoint = this.config.get("AWS_S3_ENDPOINT");
		const forcePathStyle = this.config.get("AWS_S3_FORCE_PATH_STYLE") === "true";
		if (forcePathStyle) {
			return `${endpoint}/${this.bucket}/${key}`;
		}

		return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
	}

	private getMimeTypeFromExtension(filename: string): string {
		const ext = path.extname(filename).toLowerCase();
		const mimeTypes: Record<string, string> = {
			".pdf": "application/pdf",
			".doc": "application/msword",
			".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			".txt": "text/plain",
			".md": "text/markdown",
			".jpg": "image/jpeg",
			".jpeg": "image/jpeg",
			".png": "image/png",
			".gif": "image/gif",
			".svg": "image/svg+xml",
			".webp": "image/webp",
			".mp4": "video/mp4",
			".mp3": "audio/mpeg",
			".wav": "audio/wav",
			".zip": "application/zip",
			".json": "application/json",
			".xml": "application/xml",
			".csv": "text/csv",
			".ppt": "application/vnd.ms-powerpoint",
			".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
			".xls": "application/vnd.ms-excel",
			".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		};
		return mimeTypes[ext] || "application/octet-stream";
	}

	public async healthCheck() {
		try {
			const command = new HeadBucketCommand({ Bucket: this.bucket });
			await this.executeWithRetry(() => this.client.send(command));
			return "OK" as const;
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown S3 error";
			const stack = error instanceof Error ? error.stack : undefined;

			this.logger.error(`S3 health check failed: ${message}`, stack);
			throw error;
		}
	}
}
