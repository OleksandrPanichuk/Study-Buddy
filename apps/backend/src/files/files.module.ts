import {AIModule} from "@app/ai";
import {S3Module} from "@app/s3";
import {BullModule} from "@nestjs/bullmq";
import {Module} from "@nestjs/common";
import {FileProcessingService} from "@/files/file-processing.service";
import {FilesController} from "@/files/files.controller";
import {FilesProcessor} from "@/files/files.processor";
import {FilesRepository} from "@/files/files.repository";
import {FilesService} from "@/files/files.service";
import {TutorChatsModule} from "@/tutor-chats/tutor-chats.module";

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
