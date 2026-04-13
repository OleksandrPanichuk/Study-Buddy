import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { ZodResponse } from "nestjs-zod";
import { RATE_LIMITS } from "@/constants";
import { ContextFilesService } from "@/modules/context-files/context-files.service";
import { CurrentUser } from "@/shared/decorators";
import { AuthenticatedGuard } from "@/shared/guards";
import { fileFilter } from "@/utils";
import { UploadContextFileInput, UploadContextFileResponse } from "./context-files.dto";
import { ApiUploadContextFile } from "./context-files.swagger";

@ApiTags("context-files")
@UseGuards(AuthenticatedGuard, ThrottlerGuard)
@Throttle({
	default: RATE_LIMITS.GLOBAL
})
@Controller("/context-files/:tutorChatId/upload")
export class ContextFilesController {
	constructor(private readonly contextFilesService: ContextFilesService) {}

	@Get("/testr")
	test() {
		return "Hello World!afs";
	}

	@ApiUploadContextFile()
	@ZodResponse({
		type: UploadContextFileResponse
	})
	@UseInterceptors(
		FileInterceptor("file", {
			fileFilter: fileFilter
		})
	)
	@HttpCode(HttpStatus.OK)
	@Post("upload")
	uploadContextFile(
		@UploadedFiles() file: Express.Multer.File,
		@Body() dto: UploadContextFileInput,
		@CurrentUser("id") userId: string
	) {
		return this.contextFilesService.upload(file, dto, userId);
	}
}
