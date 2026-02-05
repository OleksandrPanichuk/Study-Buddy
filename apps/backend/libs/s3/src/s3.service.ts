import path from "node:path";
import {IFileValidationOptions, IUploadOptions} from "@app/s3/s3.interfaces";
import {HeadBucketCommand, S3Client} from "@aws-sdk/client-s3";
import {BadRequestException, Injectable, Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {v4 as uuid} from "uuid"
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
			credentials: {
				accessKeyId: this.config.get("AWS_S3_ACCESS_KEY_ID"),
				secretAccessKey: this.config.get("AWS_S3_SECRET_ACCESS_KEY")
			},
			forcePathStyle: this.config.get<boolean>("AWS_S3_FORCE_PATH_STYLE"),
			maxAttempts: this.maxRetries
		});
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
		// biome-ignore lint/suspicious/noExplicitAny: allow any for error handling
		let lastError: any;

		for (let attempt = 0; attempt < retries; attempt++) {
			try {
				return await operation();
			} catch (error) {
				// biome-ignore lint/suspicious/noExplicitAny: allow any for error handling
				lastError = error as any;

				if (lastError?.$metadata?.httpStatusCode >= 400 && lastError.$metadata?.httpStatusCode < 500) {
					throw error;
				}

				if (attempt < retries - 1) {
					const delay = Math.pow(2, attempt) * 1000;
					this.logger.warn(`Operation failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`);
					await this.sleep(delay);
				}
			}
		}
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
		return `${endpoint}/${this.bucket}/${key}`;
	}

	public async healthCheck() {
		try {
			const command = new HeadBucketCommand({ Bucket: this.bucket });
			await this.client.send(command);
			return "OK" as const;
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown S3 error";
			const stack = error instanceof Error ? error.stack : undefined;

			this.logger.error(`S3 health check failed: ${message}`, stack);
			throw error;
		}
	}
}
