import z from "zod";
import { messageSchema } from "../models";

export const createMessageInputSchema = z.object({
	tutorChatId: z.uuidv4("Invalid chat id format"),
	content: z.string().trim().min(1, "Content cannot be empty").max(10000, "Content cannot exceed 10,000 characters"),
	model: z.string().optional()
});

export const createMessageResponseSchema = messageSchema;

export type TCreateMessageInput = z.infer<typeof createMessageInputSchema>;
export type TCreateMessageResponse = z.infer<typeof createMessageResponseSchema>;
