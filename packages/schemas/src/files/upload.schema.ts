import z from "zod";

export const uploadFilesResponseSchema = z.array(
	z.object({
		id: z.uuidv4(),
		jobId: z.string(),
		url: z.url(),
		key: z.string()
	})
);

export type TUploadFilesResponse = z.infer<typeof uploadFilesResponseSchema>;
