import {AIModels} from "@repo/constants";
import z from "zod";
import {uploadFilesResponseSchema} from "../files";
import {messageSchema} from "../models";

export const createMessageInputSchema = z.object({
	tutorChatId: z.uuidv4("Invalid ID"),
	content: z
		.string()
		.trim()
		.min(1, "Content cannot be empty")
		.max(10000, "Content cannot exceed 10,000 characters"),
	model: z.enum(AIModels).optional(),
	files: uploadFilesResponseSchema.optional(),
});

export const createMessageResponseSchema = z.object({
	userMessage: messageSchema,
	assistantMessage: messageSchema,
});

export type TCreateMessageInput = z.infer<typeof createMessageInputSchema>;
export type TCreateMessageResponse = z.infer<
	typeof createMessageResponseSchema
>;
