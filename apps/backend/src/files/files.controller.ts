import {
	Controller,
	HttpCode,
	HttpStatus,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors
} from "@nestjs/common";
import {FilesInterceptor} from "@nestjs/platform-express";
import {ApiTags} from "@nestjs/swagger";
import {Throttle, ThrottlerGuard} from "@nestjs/throttler";
import {RATE_LIMITS} from "@/shared/constants";
import {CurrentUser} from "@/shared/decorators";
import {AuthenticatedGuard} from "@/shared/guards";
import {MAX_FILE_SIZE} from "./files.constants";
import {fileFilter} from "./files.helpers";
import {FilesService} from "./files.service";
import {ApiUploadTutorChat} from "./files.swagger";

@ApiTags("files")
@UseGuards(AuthenticatedGuard, ThrottlerGuard)
@Throttle({ default: RATE_LIMITS.GLOBAL })
@Controller("files")
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@ApiUploadTutorChat()
	@UseInterceptors(
		FilesInterceptor("files", 10, {
			fileFilter: fileFilter
		})
	)
	@HttpCode(HttpStatus.OK)
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
