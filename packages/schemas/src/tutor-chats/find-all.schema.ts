import z from "zod";
import { tutorChatSchema } from "@/models";

export const findAllTutorChatsInputSchema = z.object({
	limit: z.number().min(1).max(100).optional().default(20),
	cursor: z.uuidv4().nullish()
});

export const findAllTutorChatsResponseSchema = z.object({
	data: z.array(tutorChatSchema),
	nextCursor: z.string().nullish()
});

export type TFindAllTutorChatsInput = z.infer<typeof findAllTutorChatsInputSchema>;
export type TFindAllTutorChatsResponse = z.infer<typeof findAllTutorChatsResponseSchema>;
