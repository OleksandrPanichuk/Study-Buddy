import {AIService} from "@app/ai";
import {Processor, WorkerHost} from "@nestjs/bullmq";
import {Logger} from "@nestjs/common";
import {EventEmitter2} from "@nestjs/event-emitter";
import {MessageStatus} from "@prisma/generated/enums";
import {AIModels} from "@repo/constants";
import {Job} from "bullmq";
import {MessagesSSEEvents, MessageStreamStatus} from "@/messages/messages.constants";
import type {
	IGenerateResponseJobData,
	IGenerateWithStreamingData,
	IMessageStreamEventData
} from "@/messages/messages.interfaces";
import {MessagesRepository} from "@/messages/messages.repository";
import {SYSTEM_PROMPT} from "@/shared/prompts";
import {TutorChatsRepository} from "@/tutor-chats/tutor-chats.repository";

@Processor("messages")
export class MessagesProcessor extends WorkerHost {
	private readonly logger = new Logger(MessagesProcessor.name);

	constructor(
		private readonly eventEmitter: EventEmitter2,
		private readonly messagesRepository: MessagesRepository,
		private readonly tutorChatsRepository: TutorChatsRepository,
		private readonly aiService: AIService
	) {
		super();
	}

	async process(job: Job<IGenerateResponseJobData>) {
		const { assistantMessageId, tutorChatId, userMessageId, userId } = job.data;

		const startTime = Date.now();

		try {
			const tutorChat = await this.tutorChatsRepository.findById(tutorChatId);

			if (!tutorChat || tutorChat.userId !== userId) {
				this.logger.error(`Tutor chat with ID ${tutorChatId} not found`);
				await this.failMessage(assistantMessageId, tutorChatId, userId, "Tutor chat not found");
				return;
			}

			const userMessage = await this.messagesRepository.findById(userMessageId);
			const assistantMessage = await this.messagesRepository.findById(assistantMessageId);

			if (!(userMessage && assistantMessage)) {
				this.logger.error(
					`User message with ID ${userMessageId} or assistant message with ID ${assistantMessageId} not found`
				);
				await this.failMessage(assistantMessageId, tutorChatId, userId, "Message not found");
				return;
			}

			if (userMessage.userId !== userId) {
				this.logger.error(`User message with ID ${userMessageId} does not belong to user ${userId}`);
				await this.failMessage(assistantMessageId, tutorChatId, userId, "Message not found");
				return;
			}

			if (assistantMessage.userId !== userId) {
				this.logger.error(`Assistant message with ID ${assistantMessageId} does not belong to user ${userId}`);
				await this.failMessage(assistantMessageId, tutorChatId, userId, "Message not found");
				return;
			}

			if (userMessage.tutorChatId !== tutorChatId || assistantMessage.tutorChatId !== tutorChatId) {
				this.logger.error(
					`User message with ID ${userMessageId} or assistant message with ID ${assistantMessageId} does not belong to tutor chat ${tutorChatId}`
				);
				await this.failMessage(assistantMessageId, tutorChatId, userId, "Message not found");
				return;
			}

			// 	TODO: get recent messages, context files and current message attachments for the system prompt
			this.logger.log("Getting recent messages, context files and current message attachments for the system prompt");

			const enhancedSystemPrompt = this.buildSystemPrompt(tutorChat.prompt, tutorChat.topic);

			const result = await this.generateWithStreaming({
				model: assistantMessage.model as AIModels,
				systemPrompt: enhancedSystemPrompt,
				prompt: userMessage.content,
				assistantMessageId,
				tutorChatId,
				userId
			});

			const latencyMs = Date.now() - startTime;

			await this.messagesRepository.update({
				id: assistantMessageId,
				content: result.content,
				status: MessageStatus.COMPLETE,
				inputTokens: result.inputTokens,
				outputTokens: result.outputTokens,
				latencyMs
			});

			this.eventEmitter.emit(MessagesSSEEvents.STREAM, {
				tutorChatId,
				assistantMessageId,
				status: MessageStreamStatus.COMPLETE,
				userId
			} satisfies IMessageStreamEventData);

			this.logger.log(`Message ${assistantMessageId} processed successfully in ${latencyMs}ms`);

			return { success: true, assistantMessageId };
		} catch (error) {
			this.logger.error(`Failed to process message ${assistantMessageId}`, error);

			const isFinalAttempt = job.attemptsMade >= (job.opts.attempts ?? 1) - 1;

			if (isFinalAttempt) {
				await this.failMessage(
					assistantMessageId,
					tutorChatId,
					userId,
					error instanceof Error ? error.message : "Failed to generate response after multiple attempts"
				);
			}

			throw error;
		}
	}

	private async generateWithStreaming({
		assistantMessageId,
		model,
		prompt,
		systemPrompt,
		tutorChatId,
		userId
	}: IGenerateWithStreamingData) {
		const options = {
			system: systemPrompt,
			maxOutputTokens: 4096,
			temperature: 0.7,
			model,
			prompt
		};
		try {
			const result = this.aiService.streamText(options);

			let fullText = "";

			for await (const chunk of result.textStream) {
				fullText += chunk;
				this.eventEmitter.emit(MessagesSSEEvents.STREAM, {
					content: chunk,
					status: MessageStreamStatus.STREAMING,
					tutorChatId,
					assistantMessageId,
					userId
				} satisfies IMessageStreamEventData);
			}

			const usage = await result.usage;

			return {
				content: fullText,
				inputTokens: usage.inputTokens,
				outputTokens: usage.outputTokens
			};
		} catch (error) {
			this.logger.warn(`Streaming failed for message ${assistantMessageId}, falling back to non-streaming`, error);

			const result = await this.aiService.generateText(options);

			this.eventEmitter.emit(MessagesSSEEvents.STREAM, {
				content: result.text,
				status: MessageStreamStatus.STREAMING,
				tutorChatId,
				assistantMessageId,
				userId
			} satisfies IMessageStreamEventData);

			return {
				content: result.text,
				inputTokens: result.usage?.inputTokens,
				outputTokens: result.usage?.outputTokens
			};
		}
	}

	private buildSystemPrompt(tutorChatPrompt?: string, chatTopic?: string): string {
		let systemPrompt = SYSTEM_PROMPT;

		if (tutorChatPrompt) {
			systemPrompt += `\n\n${tutorChatPrompt}`;
		}

		if (chatTopic) {
			systemPrompt += `\n\nCurrent topic: ${chatTopic}`;
		}

		return systemPrompt;
	}

	private async failMessage(assistantMessageId: string, tutorChatId: string, userId: string, reason: string) {
		await this.messagesRepository.update({
			id: assistantMessageId,
			content: "Failed to generate response. Please try again.",
			status: MessageStatus.FAILED
		});

		this.eventEmitter.emit(MessagesSSEEvents.STREAM, {
			status: MessageStreamStatus.FAILED,
			error: reason,
			assistantMessageId,
			tutorChatId,
			userId
		} satisfies IMessageStreamEventData);
	}
}
