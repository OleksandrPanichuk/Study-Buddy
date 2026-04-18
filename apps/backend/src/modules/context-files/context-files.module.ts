import {S3Module} from "@app/s3";
import {Module} from "@nestjs/common";
import {ContextFilesController} from "@/modules/context-files/context-files.controller";
import {ContextFilesRepository} from "@/modules/context-files/context-files.repository";
import {ContextFilesService} from "@/modules/context-files/context-files.service";
import {FilesModule} from "@/modules/files/files.module";
import {TutorChatsModule} from "@/modules/tutor-chats/tutor-chats.module";

@Module({
	imports: [TutorChatsModule, S3Module, FilesModule],
	controllers: [ContextFilesController],
	providers: [ContextFilesService, ContextFilesRepository]
})
export class ContextFilesModule {}
