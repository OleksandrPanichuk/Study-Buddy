import {
	Controller,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Post,
	UploadedFiles,
	UseInterceptors
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@/shared/decorators";
import { MAX_FILE_SIZE } from "./files.constants";
import { fileFilter } from "./files.helpers";
import type { FilesService } from "./files.service";

@ApiTags("files")
@Controller("files")
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@UseInterceptors(
		FilesInterceptor("files", 10, {
			fileFilter: fileFilter
		})
	)
	@Post("tutor-chat/:tutorChatId/upload")
	uploadTutorChat(
		@UploadedFiles(
			new ParseFilePipe({
				validators: [new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE })]
			})
		)
		files: Express.Multer.File[],
		@Param("tutorChatId") tutorChatId: string,
		@CurrentUser("id") userId: string
	) {
		return this.filesService.uploadTutorChat(files, tutorChatId, userId);
	}
}
