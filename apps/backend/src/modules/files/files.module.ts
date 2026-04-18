import {S3Module} from "@app/s3";
import {Module} from "@nestjs/common";
import {FilesController} from "@/modules/files/files.controller";
import {FilesRepository} from "@/modules/files/files.repository";
import {FilesService} from "@/modules/files/files.service";
import {TutorChatsModule} from "@/modules/tutor-chats/tutor-chats.module";
import {FileProcessingModule} from "@/modules/file-processing/file-processing.module";

@Module({
	imports: [TutorChatsModule, S3Module, FileProcessingModule],
	controllers: [FilesController],
	providers: [FilesService, FilesRepository],
	exports: [FilesService]
})
export class FilesModule {}
