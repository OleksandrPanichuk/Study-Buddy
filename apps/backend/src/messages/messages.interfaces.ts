import {MessageRole, MessageStatus} from "@app/prisma";
import {AIModels} from "@repo/constants";
import {MessageStreamStatus} from "@/messages/messages.constants";

export interface IFindAllMessagesData {
	tutorChatId: string;
	userId: string;
	take?: number;
	cursor?: string;
}

export interface ICreateMessageData {
	tutorChatId: string;
	userId: string;
	content: string;
	model?: AIModels;
	role: MessageRole;
	status?: MessageStatus;
}

export interface IGenerateResponseJobData {
	assistantMessageId: string;
	userMessageId: string;
	tutorChatId: string;
	userId: string;
}

export interface IUpdateMessageData {
	id: string;
	content?: string;
	status?: MessageStatus;
	inputTokens?: number;
	outputTokens?: number;
	latencyMs?: number;
}

export interface IMessageStreamEventData {
	tutorChatId: string;
	assistantMessageId: string;
	content?: string;
	status: MessageStreamStatus;
	error?: string;
	userId: string;
}

export interface IGenerateWithStreamingData {
	assistantMessageId: string;
	tutorChatId: string;
	model: AIModels;
	systemPrompt: string;
	prompt: string;
	userId: string;
}
