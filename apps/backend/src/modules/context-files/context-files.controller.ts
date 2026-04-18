import {Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiTags} from "@nestjs/swagger";
import {Throttle, ThrottlerGuard} from "@nestjs/throttler";
import {ZodResponse} from "nestjs-zod";
import {RATE_LIMITS} from "@/constants";
import {GetContextFilesResponse, UpdateContextFileInput, UpdateContextFileResponse, UploadContextFileInput, UploadContextFileResponse} from "@/modules/context-files/context-files.dto";
import {ContextFilesService} from "@/modules/context-files/context-files.service";
import {CurrentUser} from "@/shared/decorators";
import {AuthenticatedGuard} from "@/shared/guards";
import {fileFilter} from "@/utils";
import {ApiUploadContextFile} from "./context-files.swagger";

@ApiTags("context-files")
@UseGuards(AuthenticatedGuard, ThrottlerGuard)
@Throttle({
	default: RATE_LIMITS.GLOBAL
})
@Controller("context-files")
export class ContextFilesController {
	constructor(private readonly contextFilesService: ContextFilesService) {}

	@ZodResponse({
		type: GetContextFilesResponse
	})
	@HttpCode(HttpStatus.OK)
	@Get(":tutorChatId")
	getContextFiles(@Param("tutorChatId") tutorChatId: string, @CurrentUser("id") userId: string) {
		return this.contextFilesService.findByTutorChatId(tutorChatId, userId);
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
	@Post(":tutorChatId/upload")
	uploadContextFile(
		@UploadedFile() file: Express.Multer.File,
		@Body() dto: UploadContextFileInput,
		@CurrentUser("id") userId: string
	) {
		return this.contextFilesService.upload(file, dto, userId);
	}

	@ZodResponse({
		type: UpdateContextFileResponse
	})
	@HttpCode(HttpStatus.OK)
	@Patch(":contextFileId")
	updateContextFile(
		@Param("contextFileId") contextFileId: string,
		@Body() dto: UpdateContextFileInput,
		@CurrentUser("id") userId: string
	) {
		return this.contextFilesService.update(contextFileId, dto, userId);
	}
}
