import {z} from "zod";
import {tutorChatSchema} from "@/models";

export const updateTutorChatInputSchema = z.object({
	id: z.uuidv4("Invalid Id"),
	name: z
		.string()
		.min(3, "Name must be at least 3 characters long")
		.max(60, "Name must be less than 60 characters long")
		.optional(),
	description: z
		.string()
		.max(500, "Description must be at most 500 characters long")
		.optional(),
	topic: z
		.string()
		.min(3, "Topic must be at least 3 characters long")
		.max(60, "Topic must be at most 60 characters long")
		.optional(),
	prompt: z
		.string()
		.min(10, "Prompt must be at least 10 characters long")
		.max(2000, "Prompt must be at most 2000 characters long")
		.optional(),
});

export const updateTutorChatResponseSchema = tutorChatSchema;

export type TUpdateTutorChatInput = z.infer<typeof updateTutorChatInputSchema>;
export type TUpdateTutorChatResponse = z.infer<
	typeof updateTutorChatResponseSchema
>;
