import { Module } from "@nestjs/common";
import { ContextFilesService } from "@/modules/context-files/context-files.service";
import { ContextFilesRepository } from "@/modules/context-files/context-files.repository";
import { ContextFilesController } from "@/modules/context-files/context-files.controller";
import { TutorChatsModule } from "@/modules/tutor-chats/tutor-chats.module";
import { S3Module } from "@app/s3";
import { FilesModule } from "@/modules/files/files.module";

@Module({
	imports: [TutorChatsModule, S3Module, FilesModule],
	controllers: [ContextFilesController],
	providers: [ContextFilesService, ContextFilesRepository]
})
export class ContextFilesModule {}
