import z from "zod";
import {tutorChatSchema} from "../models";

export const createTutorChatInputSchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, "Name must be at least 3 characters long")
		.max(60, "Name must be at most 60 characters long"),
	description: z
		.string()
		.trim()
		.max(500, "Description must be at most 500 characters long")
		.optional(),
	topic: z
		.string()
		.trim()
		.min(3, "Topic must be at least 3 characters long")
		.max(60, "Topic must be at most 60 characters long")
		.optional(),
	prompt: z
		.string()
		.trim()
		.min(10, "Prompt must be at least 10 characters long")
		.max(2000, "Prompt must be at most 2000 characters long")
		.optional(),
});

export const createTutorChatResponseSchema = tutorChatSchema;

export type TCreateTutorChatInput = z.infer<typeof createTutorChatInputSchema>;
export type TCreateTutorChatResponse = z.infer<
	typeof createTutorChatResponseSchema
>;
