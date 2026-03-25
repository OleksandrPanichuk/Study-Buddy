import z from "zod";
import { zDate } from "../utils";

export const contextFileSchema = z.object({
	id: z.uuidv4(),
	priority: z.number().int(),
	note: z.string().nullable(),
	tutorChatId: z.uuidv4(),
	fileId: z.uuidv4(),
	createdAt: zDate
});


export type TContextFile = z.infer<typeof contextFileSchema>;