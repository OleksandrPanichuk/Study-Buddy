import { Injectable, NotFoundException } from "@nestjs/common";
import { ContextFilesRepository } from "@/modules/context-files/context-files.repository";
import { UploadContextFileInput, UploadContextFileResponse } from "@/modules/context-files/context-files.dto";
import { TutorChatsRepository } from "@/modules/tutor-chats/tutor-chats.repository";
import { FilesService } from "@/modules/files/files.service";

@Injectable()
export class ContextFilesService {
	constructor(
		private readonly filesService: FilesService,
		private readonly contextFilesRepository: ContextFilesRepository,
		private readonly tutorChatRepository: TutorChatsRepository
	) {}

	public async upload(
		file: Express.Multer.File,
		dto: UploadContextFileInput,
		userId: string
	): Promise<UploadContextFileResponse> {
		const tutorChat = await this.tutorChatRepository.findByIdAndUserId(dto.tutorChatId, userId);

		if (!tutorChat) {
			throw new NotFoundException(`Tutor chat with ID ${dto.tutorChatId} not found`);
		}

		const folder = `tutor-chat/context/${dto.tutorChatId}`;

		const [uploadedFile] = await this.filesService.upload([file], folder, userId);

		const contextFile = await this.contextFilesRepository.createContextFile({
			fileId: uploadedFile.id,
			tutorChatId: dto.tutorChatId,
			note: dto.note,
			priority: dto.priority
		});

		return {
			...contextFile,
			jobId: uploadedFile.jobId,
			url: uploadedFile.url
		};
	}
}
