import { AIModule } from "@app/ai";
import { PrismaModule } from "@app/prisma";
import { S3Module } from "@app/s3";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { FILE_PROCESSING_QUEUE } from "@/modules/file-processing/file-processing.constants";
import { FileProcessingProcessor } from "@/modules/file-processing/file-processing.processor";
import { FileProcessingQueueService } from "@/modules/file-processing/file-processing-queue.service";
import { TextExtractionService } from "@/modules/file-processing/text-extraction.service";
import { FilesRepository } from "@/modules/files/files.repository";

@Module({
	imports: [
		BullModule.registerQueue({
			name: FILE_PROCESSING_QUEUE
		}),
		AIModule,
		S3Module,
		PrismaModule
	],
	providers: [TextExtractionService, FileProcessingProcessor, FileProcessingQueueService, FilesRepository],
	exports: [FileProcessingQueueService]
})
export class FileProcessingModule {}
