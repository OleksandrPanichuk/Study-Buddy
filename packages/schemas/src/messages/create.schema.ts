import {AIModels} from "@repo/constants";
import z from "zod";
import {messageSchema} from "../models";

export const createMessageInputSchema = z.object({
	content: z
		.string()
		.trim()
		.min(1, "Content cannot be empty")
		.max(10000, "Content cannot exceed 10,000 characters"),
	model: z.nativeEnum(AIModels).optional(),
});

export const createMessageResponseSchema = z.object({
	userMessage: messageSchema,
	assistantMessage: messageSchema,
});

export type TCreateMessageInput = z.infer<typeof createMessageInputSchema>;
export type TCreateMessageResponse = z.infer<
	typeof createMessageResponseSchema
>;
