import { AIModule } from "@app/ai";
import { S3Module } from "@app/s3";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { FilesController } from "@/files/files.controller";
import { FilesRepository } from "@/files/files.repository";
import { TutorChatsModule } from "@/tutor-chats/tutor-chats.module";
import { FileProcessingService } from "./file-processing.service";
import { FilesProcessor } from "./files.processor";
import { FilesService } from "./files.service";

@Module({
	imports: [
		TutorChatsModule,
		S3Module,
		AIModule,
		BullModule.registerQueue({
			name: "file-processing"
		})
	],
	controllers: [FilesController],
	providers: [FilesService, FilesRepository, FilesProcessor, FileProcessingService]
})
export class FilesModule {}
