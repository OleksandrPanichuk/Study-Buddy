import z from "zod";
import {contextFileSchema} from "../models";

export const uploadContextFileInputSchema = z.object({
	priority: z.number().int(),
	note: z.string().optional(),
	tutorChatId: z.uuidv4()
});

export type TUploadContextFileInput = z.infer<typeof uploadContextFileInputSchema>;

export const uploadContextFileResponseSchema = contextFileSchema.extend({
	jobId: z.string(),
	url: z.url()
});

export type TUploadContextFileResponse = z.infer<typeof uploadContextFileResponseSchema>;
