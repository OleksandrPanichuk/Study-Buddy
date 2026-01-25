import z from "zod";
import { zDate } from "@/utils";

export const tutorChatSchema = z.object({
	id: z.uuidv4(),
	name: z.string().min(3).max(60),
	description: z.string().max(500).nullish(),
	topic: z.string().min(3).max(60).nullish(),
	prompt: z.string().min(10).max(2000),
	createdAt: zDate,
	updatedAt: zDate
});

export type TTutorChat = z.infer<typeof tutorChatSchema>;
