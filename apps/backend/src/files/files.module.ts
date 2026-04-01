import {S3Module} from "@app/s3";
import {Module} from "@nestjs/common";
import {FilesController} from "@/files/files.controller";
import {FilesRepository} from "@/files/files.repository";
import {FilesService} from "@/files/files.service";
import {TutorChatsModule} from "@/tutor-chats/tutor-chats.module";
import {FileProcessingModule} from "@/file-processing/file-processing.module";

@Module({
	imports: [TutorChatsModule, S3Module, FileProcessingModule],
	controllers: [FilesController],
	providers: [FilesService, FilesRepository]
})
export class FilesModule {}
