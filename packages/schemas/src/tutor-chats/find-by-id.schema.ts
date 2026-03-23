import {z} from "zod";
import {tutorChatSchema} from "../models";

export const findTutorChatInputSchema = z.object({
	tutorChatId: z.uuidv4(),
});

export const findTutorChatResponseSchema = tutorChatSchema;

export type TFindTutorChatInput = z.infer<typeof findTutorChatInputSchema>;
export type TFindTutorChatResponse = z.infer<
	typeof findTutorChatResponseSchema
>;
