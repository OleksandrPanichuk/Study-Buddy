import {z} from "zod";
import {zDate} from "@/utils";

export const fileSchema = z.object({
	id: z.uuidv4(),
	url: z.url(),
	key: z.string().optional(),
	createdAt: zDate,
});

export type TFile = z.infer<typeof fileSchema>;
