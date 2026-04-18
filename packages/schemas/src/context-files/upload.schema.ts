import z from "zod";
import {zfd} from "zod-form-data";
import {contextFileSchema} from "../models";

export const uploadContextFileInputSchema = zfd.formData({
	file: zfd.file(z.instanceof(File)),
	priority: zfd.numeric(z.number().int()),
	note: zfd.text(z.string().optional()),
	tutorChatId: zfd.text(z.uuidv4())
});

export type TUploadContextFileInput = z.infer<typeof uploadContextFileInputSchema>;

export const uploadContextFileBodySchema = z.object({
	priority: z.coerce.number().int(),
	note: z.string().optional(),
	tutorChatId: z.uuidv4()
});

export type TUploadContextFileBody = z.infer<typeof uploadContextFileBodySchema>;

export const uploadContextFileResponseSchema = contextFileSchema.extend({
	jobId: z.string(),
	url: z.url()
});

export type TUploadContextFileResponse = z.infer<typeof uploadContextFileResponseSchema>;

export const updateContextFileInputSchema = z.object({
	contextFileId: z.uuidv4(),
	note: z.string().nullable().optional(),
	priority: z.number().int().optional()
});

export type TUpdateContextFileInput = z.infer<typeof updateContextFileInputSchema>;

export const updateContextFileBodySchema = z.object({
	note: z.string().nullable().optional(),
	priority: z.coerce.number().int().optional()
});

export type TUpdateContextFileBody = z.infer<typeof updateContextFileBodySchema>;

export const updateContextFileResponseSchema = contextFileSchema;

export type TUpdateContextFileResponse = z.infer<typeof updateContextFileResponseSchema>;

export const getContextFilesItemSchema = contextFileSchema.extend({
	file: z.object({
		id: z.uuidv4(),
		name: z.string(),
		mimeType: z.string(),
		sizeBytes: z.number(),
		url: z.url(),
		jobId: z.string().nullable()
	})
});

export const getContextFilesResponseSchema = z.array(getContextFilesItemSchema);

export type TGetContextFilesItem = z.infer<typeof getContextFilesItemSchema>;
export type TGetContextFilesResponse = z.infer<typeof getContextFilesResponseSchema>;
