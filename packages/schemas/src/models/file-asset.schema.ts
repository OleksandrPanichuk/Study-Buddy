import {z} from "zod";
import {zDate} from "../utils";

export const fileAssetSchema = z.object({
	id: z.uuidv4(),
	name: z.string(),
	mimeType: z.string(),
	sizeBytes: z.number().int(),
	url: z.url(),
	storageKey: z.string().nullable(),
	status: z
		.enum(["PROCESSING", "UPLOADING", "READY", "FAILED"])
		.default("UPLOADING"),
	textHash: z.string().nullable(),

	userId: z.uuidv4(),
	createdAt: zDate,
	updatedAt: zDate,
});

export type TFileAsset = z.infer<typeof fileAssetSchema>;
