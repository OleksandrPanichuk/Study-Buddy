import z from "zod";
import {fileAssetSchema} from "../models";

export const uploadFilesInputSchema = z.instanceof(FormData).refine(
	(data) => {
		const files = data.getAll("files");
		return files.length > 0 && files.every((file) => file instanceof File);
	},
	{
		message: "Expected at least one file",
	},
)

export type TUploadFilesInput = z.infer<typeof uploadFilesInputSchema>;

export const uploadFilesResponseSchema = z.array(
	fileAssetSchema
		.omit({
			status: true,
			textHash: true,
			userId: true,
			createdAt: true,
			updatedAt: true,
		})
		.extend({
			jobId: z.string(),
		}),
);

export type TUploadFilesResponse = z.infer<typeof uploadFilesResponseSchema>;
