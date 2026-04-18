import { MessageRole, MessageStatus } from "@app/prisma";
import { AIModels } from "@repo/constants";
import { MessageStreamStatus } from "@/modules/messages/messages.constants";

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
	fileJobs?: Array<{
		fileId: string;
		jobId: string;
	}>;
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

export interface IFindRecentMessagesForContextData {
	tutorChatId: string;
	userId: string;
	excludeMessageIds?: string[];
	limit?: number;
}

export interface IFindAttachmentsForContextData {
	messageId: string;
	userId: string;
	chunkLimit?: number;
}

export interface IFindContextFilesForContextData {
	tutorChatId: string;
	userId: string;
	fileLimit?: number;
	chunkLimit?: number;
}

export interface IContextMessage {
	id: string;
	role: MessageRole;
	content: string;
	createdAt: Date;
}

export interface IContextAttachment {
	id: string;
	name: string;
	mimeType: string;
	sizeBytes: number;
	status: string;
	chunks: string[];
}

export interface IContextTutorFile {
	id: string;
	priority: number;
	note?: string | null;
	name: string;
	mimeType: string;
	sizeBytes: number;
	status: string;
	chunks: string[];
}

export interface IBuildContextReturn {
	recentMessages: IContextMessage[];
	attachments: IContextAttachment[];
	contextFiles: IContextTutorFile[];
}
