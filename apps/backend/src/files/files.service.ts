import {FileStatus} from "@app/prisma";
import {S3Service} from "@app/s3";
import {InjectQueue} from "@nestjs/bullmq";
import {Injectable, NotFoundException} from "@nestjs/common";
import {MAX_FILE_SIZE} from "@repo/constants";
import {Queue} from "bullmq";
import {FilesRepository} from "@/files/files.repository";
import {TutorChatsRepository} from "@/tutor-chats/tutor-chats.repository";
import {UploadFilesResponse} from "./files.dto";
import {IFileProcessingJobData} from "./files.interfaces";

@Injectable()
export class FilesService {
	constructor(
		@InjectQueue("file-processing") private readonly fileProcessingQueue: Queue,
		private readonly filesRepository: FilesRepository,
		private readonly tutorChatsRepository: TutorChatsRepository,
		private readonly s3Service: S3Service
	) {}

	public async uploadTutorChat(files: Express.Multer.File[], tutorChatId: string, userId: string) {
		const tutorChat = await this.tutorChatsRepository.findById(tutorChatId);

		if (!tutorChat) {
			throw new NotFoundException(`Tutor chat with ID ${tutorChatId} not found`);
		}

		return await this.upload(files, `tutor-chats/${tutorChatId}`, userId);
	}

	public async delete(fileAssetId: string, userId: string) {
		const fileAsset = await this.filesRepository.findFileAssetByIdAndUserId(fileAssetId, userId);

		if (!fileAsset) {
			throw new NotFoundException("File asset not found");
		}

		if (fileAsset.storageKey) {
			await this.s3Service.deleteFile(fileAsset.storageKey);
		}

		await this.filesRepository.deleteFileAsset(fileAssetId);
	}

	private async upload(files: Express.Multer.File[], folder: string, userId: string): Promise<UploadFilesResponse> {
		const uploadedFiles = await this.s3Service.uploadFiles(files, {
			maxSize: MAX_FILE_SIZE,
			folder: folder
		});
		const fileAssets = await this.filesRepository.createFileAssets(
			uploadedFiles.map((file) => ({
				name: file.name,
				mimeType: file.mimeType,
				sizeBytes: file.size,
				status: FileStatus.PROCESSING,
				url: file.url,
				storageKey: file.key,
				userId
			}))
		);

		return await Promise.all(
			fileAssets.map(async (fileAsset) => {
				const job = await this.fileProcessingQueue.add(
					"process-file",
					{
						fileAssetId: fileAsset.id,
						storageKey: fileAsset.storageKey
					} satisfies IFileProcessingJobData,
					{
						attempts: 3,
						backoff: {
							type: "exponential",
							delay: 2000
						},
						removeOnComplete: true,
						removeOnFail: false
					}
				);

				return {
					id: fileAsset.id,
					jobId: job.id,
					url: fileAsset.url,
					key: fileAsset.storageKey
				};
			})
		);
	}
}
