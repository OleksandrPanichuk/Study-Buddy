import z from "zod";
import { messageSchema } from "../models";

export const findAllMessagesInputSchema = z.object({
	cursor: z.uuidv4("Invalid cursor").optional(),
	limit: z.coerce.number().int().min(1).max(100).optional().default(20),
	tutorChatId: z.uuidv4("Invalid ID")
});

export const findAllMessagesResponseSchema = z.object({
	data: z.array(messageSchema),
	nextCursor: z.uuidv4().nullish()
});

export type TFindAllMessagesInput = z.infer<typeof findAllMessagesInputSchema>;

export type TFindAllMessagesResponse = z.infer<typeof findAllMessagesResponseSchema>;
