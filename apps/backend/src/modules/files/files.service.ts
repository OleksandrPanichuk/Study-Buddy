import {FileStatus} from "@app/prisma";
import {S3Service} from "@app/s3";
import {Injectable, NotFoundException} from "@nestjs/common";
import {MAX_FILE_SIZE} from "@repo/constants";
import type {IFileProcessingJobData} from "@/modules/file-processing/file-processing.interfaces";
import {FileProcessingQueueService} from "@/modules/file-processing/file-processing-queue.service";
import {FilesRepository} from "@/modules/files/files.repository";
import {TutorChatsRepository} from "@/modules/tutor-chats/tutor-chats.repository";
import {UploadFilesResponse} from "./files.dto";

@Injectable()
export class FilesService {
	constructor(
		private readonly fileProcessingQueueService: FileProcessingQueueService,
		private readonly filesRepository: FilesRepository,
		private readonly tutorChatsRepository: TutorChatsRepository,
		private readonly s3Service: S3Service
	) {}

	public async uploadTutorChat(files: Express.Multer.File[], tutorChatId: string, userId: string) {
		const tutorChat = await this.tutorChatsRepository.findByIdAndUserId(tutorChatId, userId);

		if (!tutorChat) {
			throw new NotFoundException(`Tutor chat with ID ${tutorChatId} not found`);
		}

		return await this.upload(files, `tutor-chats/messages/${tutorChatId}`, userId);
	}

	public async delete(fileAssetId: string, userId: string) {
		const fileAsset = await this.filesRepository.findFileAssetByIdAndUserId(fileAssetId, userId);

		if (!fileAsset) {
			throw new NotFoundException("File asset not found");
		}

		if (fileAsset.jobId) {
			await this.fileProcessingQueueService.cancel(fileAsset.jobId);
		}

		if (fileAsset.storageKey) {
			await this.s3Service.deleteFile(fileAsset.storageKey);
		}

		await this.filesRepository.deleteFileAsset(fileAssetId);
	}

	public async upload(files: Express.Multer.File[], folder: string, userId: string): Promise<UploadFilesResponse> {
		const uploadedFiles = await this.s3Service.uploadFiles(files, {
			maxSize: MAX_FILE_SIZE,
			folder
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
				const job = await this.fileProcessingQueueService.enqueue({
					fileAssetId: fileAsset.id,
					storageKey: fileAsset.storageKey
				} satisfies IFileProcessingJobData);

				const jobId = job.id?.toString() ?? "";
				if (jobId) {
					await this.filesRepository.updateFileAssetJobId(fileAsset.id, jobId);
				}

				return {
					id: fileAsset.id,
					jobId,
					url: fileAsset.url,
					name: fileAsset.name,
					storageKey: fileAsset.storageKey,
					sizeBytes: fileAsset.sizeBytes,
					mimeType: fileAsset.mimeType
				};
			})
		);
	}
}
