import { Injectable, NotFoundException } from "@nestjs/common";
import {
	CreateTutorChatInput,
	CreateTutorChatResponse,
	FindAllTutorChatsQuery,
	FindAllTutorChatsResponse,
	UpdateTutorChatInput,
	UpdateTutorChatResponse
} from "./tutor-chats.dto";
import { TutorChatsRepository } from "./tutor-chats.repository";

@Injectable()
export class TutorChatsService {
	constructor(private readonly tutorChatsRepository: TutorChatsRepository) {}

	public async findAll(dto: FindAllTutorChatsQuery, userId: string): Promise<FindAllTutorChatsResponse> {
		const take = dto.infinite ? dto.limit + 1 : dto.limit;

		const data = await this.tutorChatsRepository.findByUserId({
			cursor: dto.cursor,
			take,
			userId
		});

		let nextCursor: string | null = null;

		if (data.length > dto.limit) {
			const nextItem = data.pop();
			nextCursor = nextItem!.id;
		}
		return {
			data,
			nextCursor
		};
	}

	public async create(dto: CreateTutorChatInput, userId: string): Promise<CreateTutorChatResponse> {
		return this.tutorChatsRepository.create({
			...dto,
			userId
		});
	}

	public async update(dto: UpdateTutorChatInput, userId: string): Promise<UpdateTutorChatResponse> {
		const existingChat = await this.tutorChatsRepository.findById(dto.id);

		if (!existingChat || existingChat.userId !== userId) {
			throw new NotFoundException("Tutor chat not found");
		}

		return this.tutorChatsRepository.update(dto);
	}

	public async delete(tutorChatId: string, userId: string) {
		const existingChat = await this.tutorChatsRepository.findById(tutorChatId);

		if (!existingChat || existingChat.userId !== userId) {
			throw new NotFoundException("Tutor chat not found");
		}

		// TODO: delete all messages/files associated with this chat

		return this.tutorChatsRepository.delete(tutorChatId);
	}

	public async bulkDelete(ids: string[], userId: string) {
		const existingChats = await Promise.all(ids.map((id) => this.tutorChatsRepository.findById(id)));

		if (existingChats.some((chat) => !chat || chat.userId !== userId)) {
			throw new NotFoundException("Some of the tutor chats were not found");
		}

		// TODO: delete all messages/files associated with this chat
		return this.tutorChatsRepository.bulkDelete(ids);
	}
}
