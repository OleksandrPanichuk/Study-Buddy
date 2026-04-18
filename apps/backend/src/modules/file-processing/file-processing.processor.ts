import {createHash} from "node:crypto";
import {AIService} from "@app/ai";
import {FileStatus} from "@app/prisma";
import {S3Service} from "@app/s3";
import {Processor, WorkerHost} from "@nestjs/bullmq";
import {Logger} from "@nestjs/common";
import {Job} from "bullmq";
import {FILE_PROCESSING_QUEUE} from "@/modules/file-processing/file-processing.constants";
import type {IFileProcessingJobData} from "@/modules/file-processing/file-processing.interfaces";
import {TextExtractionService} from "@/modules/file-processing/text-extraction.service";
import type {ICreateFileChunkData} from "@/modules/files/files.interfaces";
import {FilesRepository} from "@/modules/files/files.repository";

@Processor(FILE_PROCESSING_QUEUE)
export class FileProcessingProcessor extends WorkerHost {
	private readonly logger = new Logger(FileProcessingProcessor.name);

	constructor(
		private readonly s3Service: S3Service,
		private readonly filesRepository: FilesRepository,
		private readonly aiService: AIService,
		private readonly textExtractionService: TextExtractionService
	) {
		super();
	}

	async process(job: Job<IFileProcessingJobData>) {
		const { fileAssetId, storageKey } = job.data;

		try {
			const fileAsset = await this.filesRepository.findFileAssetById(fileAssetId);

			if (!fileAsset) {
				this.logger.error(`File asset with ID ${fileAssetId} not found`);
				return;
			}

			await this.filesRepository.updateFileAssetJobId(fileAsset.id, job.id?.toString() ?? null);

			this.logger.log(`Downloading file ${storageKey} (asset ${fileAssetId})`);
			const buffer = await this.s3Service.downloadFile(storageKey);

			let text = await this.textExtractionService.extractTextFromBuffer(buffer, fileAsset.mimeType, fileAsset.name);

			text = (text || "").replace(/\s+/g, " ").trim();

			if (!text) {
				this.logger.warn(`No text extracted from file ${fileAssetId}`);
				await this.filesRepository.updateFileAssetStatus(fileAssetId, FileStatus.FAILED);
				return;
			}

			const textHash = createHash("sha256").update(text).digest("hex");

			if (fileAsset.textHash && fileAsset.textHash === textHash) {
				this.logger.log(
					`File ${fileAssetId} has already been processed with the same content, skipping embedding generation`
				);
				await this.filesRepository.updateFileAssetStatus(fileAssetId, FileStatus.READY);
				return;
			}

			await this.filesRepository.deleteChunksByFileId(fileAssetId);

			const contents = this.textExtractionService.recursiveChunkText(text);
			this.logger.log(`Split into ${contents.length} chunks for file ${fileAssetId}`);

			this.logger.log(`Generating embeddings for ${contents.length} chunks`);

			const embeddings = await this.aiService.createEmbeddings(contents);

			if (!Array.isArray(embeddings) || embeddings.length !== contents.length) {
				throw new Error("Embedding provider returned a mismatched number of vectors");
			}

			const rows = contents.map((content, index) => ({
				index,
				content,
				tokenCount: this.textExtractionService.estimateTokenCount(content),
				embedding: embeddings[index]
			})) satisfies ICreateFileChunkData[];

			await this.filesRepository.createChunks(fileAssetId, rows);
			await this.filesRepository.updateFileAssetTextHash(fileAssetId, textHash);

			this.logger.log(`File ${fileAssetId} processed successfully`);
		} catch (error) {
			this.logger.error(
				`Failed processing file ${fileAssetId}: ${error instanceof Error ? error.message : "Unknown error"}`,
				error instanceof Error ? error.stack : undefined
			);

			await this.filesRepository.updateFileAssetStatus(fileAssetId, FileStatus.FAILED);
			throw error;
		}
	}
}
