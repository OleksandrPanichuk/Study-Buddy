import z from "zod";
import {zfd} from "zod-form-data";
import {fileAssetSchema} from "../models";

export const uploadFilesInputSchema = zfd.formData({
	files: zfd.repeatable(z.array(zfd.file(z.instanceof(File))).min(1, "Expected at least one file")),
	tutorChatId: zfd.text(z.uuidv4("Invalid ID"))
});

export type TUploadFilesInput = z.infer<typeof uploadFilesInputSchema>;

export const uploadFilesResponseSchema = z.array(
	fileAssetSchema
		.omit({
			status: true,
			textHash: true,
			userId: true,
			createdAt: true,
			updatedAt: true
		})
		.extend({
			jobId: z.string()
		})
);

export type TUploadFilesResponse = z.infer<typeof uploadFilesResponseSchema>;
