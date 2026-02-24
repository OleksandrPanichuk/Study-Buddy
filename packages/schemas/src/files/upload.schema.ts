import z from "zod";

export const uploadFilesInputSchema = z.instanceof(FormData).refine(
	(data) => {
		const files = data.getAll("files");
		return files.length > 0 && files.every((file) => file instanceof File);
	},
	{
		error: "Expected at least one file",
	},
);

export type TUploadFilesInput = z.infer<typeof uploadFilesInputSchema>;

export const uploadFilesResponseSchema = z.array(
	z.object({
		id: z.uuidv4(),
		jobId: z.string(),
		url: z.url(),
		key: z.string(),
	}),
);

export type TUploadFilesResponse = z.infer<typeof uploadFilesResponseSchema>;
