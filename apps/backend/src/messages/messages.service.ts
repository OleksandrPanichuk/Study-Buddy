import { MessageRole, MessageStatus } from "@app/prisma";
import { InjectQueue } from "@nestjs/bullmq";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { AI_DEFAULT_MODEL } from "@repo/constants";
import { Queue } from "bullmq";
import type { IGenerateResponseJobData } from "@/messages/messages.interfaces";
import { MessagesRepository } from "@/messages/messages.repository";
import { TutorChatsRepository } from "@/tutor-chats/tutor-chats.repository";
import {
	CreateMessageInput,
	CreateMessageResponse,
	FindAllMessagesQuery,
	FindAllMessagesResponse
} from "./messages.dto";

@Injectable()
export class MessagesService {
	constructor(
		@InjectQueue("messages") private readonly messagesQueue: Queue,
		private readonly messagesRepository: MessagesRepository,
		private readonly tutorChatsRepository: TutorChatsRepository
	) {}

	public async findAll(
		dto: FindAllMessagesQuery,
		tutorChatId: string,
		userId: string
	): Promise<FindAllMessagesResponse> {
		const { limit = 20, cursor } = dto;

		const take = cursor ? limit + 1 : limit;

		const messages = await this.messagesRepository.findAll({
			tutorChatId,
			take,
			cursor,
			userId
		});

		let nextCursor: string | null = null;

		if (messages.length > limit) {
			const nextItem = messages.pop()!;
			nextCursor = nextItem.id;
		}

		return {
			data: messages,
			nextCursor
		};
	}

	public async create(dto: CreateMessageInput, tutorChatId: string, userId: string): Promise<CreateMessageResponse> {
		const { content, model = AI_DEFAULT_MODEL, files } = dto;

		const tutorChat = await this.tutorChatsRepository.findById(tutorChatId);

		if (!tutorChat) {
			throw new NotFoundException(`Tutor chat with ID ${tutorChatId} not found`);
		}

		if (tutorChat.userId !== userId) {
			throw new ForbiddenException("You do not have permission to send messages in this tutor chat");
		}

		const [userMessage, assistantMessage] = await this.messagesRepository.createMessagePair(
			{
				role: MessageRole.USER,
				tutorChatId,
				userId,
				content
			},
			{
				content: "Response is being generated...",
				role: MessageRole.ASSISTANT,
				status: MessageStatus.PROCESSING,
				tutorChatId,
				userId,
				model
			}
		);

		const jobData = {
			assistantMessageId: assistantMessage.id,
			userMessageId: userMessage.id,
			tutorChatId,
			userId
		} satisfies IGenerateResponseJobData;

		await this.messagesQueue.add("generate-response", jobData, {
			removeOnFail: false,
			removeOnComplete: true,
			attempts: 3,
			backoff: {
				type: "exponential",
				delay: 1000
			}
		});

		return {
			userMessage,
			assistantMessage
		};
	}
}
