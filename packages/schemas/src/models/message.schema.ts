import { zDate } from "src/utils";
import z from "zod";

export const messageRoles = ["SYSTEM", "USER", "ASSISTANT", "TOOL"] as const;

export const messageSchema = z.object({
	id: z.uuidv4(),
	role: z.enum(messageRoles),
	content: z.string(),
	model: z.string().nullable(),
	inputTokens: z.number().int().nullable(),
	outputTokens: z.number().int().nullable(),
	latencyMs: z.number().int().nullable(),

	tutorChatId: z.uuidv4(),
	userId: z.uuidv4(),

	createdAt: zDate,
	updatedAt: zDate
});

export type TMessage = z.infer<typeof messageSchema>;
