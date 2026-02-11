import { google } from "@ai-sdk/google";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MessageStatus } from "@prisma/generated/enums";
import { generateText, streamText } from "ai";
import { Job } from "bullmq";
import { max } from "rxjs";
import type {
	IGenerateResponseJobData,
	IGenerateWithStreamingData,
	IMessageStreamEventData
} from "@/messages/messages.interfaces";
import { MessagesRepository } from "@/messages/messages.repository";
import { TutorChatsRepository } from "@/tutor-chats/tutor-chats.repository";

@Processor("messages")
export class MessagesProcessor extends WorkerHost {
	private readonly logger = new Logger(MessagesProcessor.name);

	constructor(
		private readonly eventEmitter: EventEmitter2,
		private readonly messagesRepository: MessagesRepository,
		private readonly tutorChatsRepository: TutorChatsRepository
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
				return;
			}

			const userMessage = await this.messagesRepository.findById(userMessageId);
			const assistantMessage = await this.messagesRepository.findById(assistantMessageId);

			if (!(userMessage && assistantMessage)) {
				this.logger.error(
					`User message with ID ${userMessageId} or assistant message with ID ${assistantMessageId} not found`
				);
				return;
			}

			if (userMessage.userId !== userId) {
				this.logger.error(`User message with ID ${userMessageId} does not belong to user ${userId}`);
				return;
			}

			if (assistantMessage.userId !== userId) {
				this.logger.error(`Assistant message with ID ${assistantMessageId} does not belong to user ${userId}`);
				return;
			}

			if (userMessage.tutorChatId !== tutorChatId || assistantMessage.tutorChatId !== tutorChatId) {
				this.logger.error(
					`User message with ID ${userMessageId} or assistant message with ID ${assistantMessageId} does not belong to tutor chat ${tutorChatId}`
				);
				return;
			}

			// 	TODO: get recent messages, context files and current message attachments for the system prompt
			this.logger.log("Getting recent messages, context files and current message attachments for the system prompt");

			const enhancedSystemPrompt = this.buildSystemPrompt(tutorChat.prompt, tutorChat.topic);

			const result = await this.generateWithStreaming({
				model: assistantMessage.model,
				systemPrompt: enhancedSystemPrompt,
				prompt: userMessage.content,
				assistantMessageId,
				tutorChatId
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

			this.eventEmitter.emit("message.stream", {
				tutorChatId,
				assistantMessageId,
				status: "COMPLETE"
			} satisfies IMessageStreamEventData);

			this.logger.log(`Message ${assistantMessageId} processed successfully in ${latencyMs}ms`);

			return { success: true, assistantMessageId };
		} catch (error) {
			this.logger.error(`Failed to process message ${assistantMessageId}`, error);

			await this.messagesRepository.update({
				id: assistantMessageId,
				content: "Failed to generate response. Please try again.",
				status: MessageStatus.FAILED
			});

			this.eventEmitter.emit("message.stream", {
				tutorChatId,
				assistantMessageId,
				status: "FAILED",
				error: error instanceof Error ? error.message : "Unknown error"
			} satisfies IMessageStreamEventData);

			throw error;
		}
	}

	private async generateWithStreaming({
		assistantMessageId,
		model,
		prompt,
		systemPrompt,
		tutorChatId
	}: IGenerateWithStreamingData) {
		const options = {
			model: google(model),
			system: systemPrompt,
			maxOutputTokens: 4096,
			temperature: 0.7,
			prompt
		};
		try {
			const result = streamText(options);

			let fullText = "";

			for await (const chunk of result.textStream) {
				fullText += chunk;
				this.eventEmitter.emit("message.stream", {
					tutorChatId,
					assistantMessageId,
					content: chunk,
					status: "STREAMING"
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

			const result = await generateText(options);

			this.eventEmitter.emit("message.stream", {
				tutorChatId,
				assistantMessageId,
				content: result.text,
				status: "STREAMING"
			} satisfies IMessageStreamEventData);

			return {
				content: result.text,
				inputTokens: result.usage?.inputTokens,
				outputTokens: result.usage?.outputTokens
			};
		}
	}

	private buildSystemPrompt(tutorChatPrompt?: string, chatTopic?: string): string {
		// TODO: get base system prompt with full instructions, then append tutorChatPrompt and chatTopic
		let systemPrompt = tutorChatPrompt;

		if (chatTopic) {
			systemPrompt += `\n\nCurrent topic: ${chatTopic}`;
		}

		return systemPrompt;
	}
}
