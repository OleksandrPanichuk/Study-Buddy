import {FileStatus} from "@app/prisma";
import {S3Service} from "@app/s3";
import {Injectable, NotFoundException} from "@nestjs/common";
import {MAX_FILE_SIZE} from "@repo/constants";
import {FileProcessingQueueService} from "@/file-processing/file-processing-queue.service";
import type {IFileProcessingJobData} from "@/file-processing/file-processing.interfaces";
import {FilesRepository} from "@/files/files.repository";
import {TutorChatsRepository} from "@/tutor-chats/tutor-chats.repository";
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

		if (fileAsset.jobId) {
			await this.fileProcessingQueueService.cancel(fileAsset.jobId);
		}

		if (fileAsset.storageKey) {
			await this.s3Service.deleteFile(fileAsset.storageKey);
		}

		await this.filesRepository.deleteFileAsset(fileAssetId);
	}

	private async upload(files: Express.Multer.File[], folder: string, userId: string): Promise<UploadFilesResponse> {
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
