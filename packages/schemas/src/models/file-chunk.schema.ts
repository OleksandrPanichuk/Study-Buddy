import {z} from "zod";
import {zDate} from "../utils";

export const fileChunkSchema = z.object({
	id: z.uuidv4(),
	index: z.number().int(),
	content: z.string(),
	tokeCount: z.number().int(),
	embedding: z.array(z.number()),
	fileId: z.uuidv4(),
	createdAt: zDate,
});

export type TFileChunk = z.infer<typeof fileChunkSchema>;
