import z from "zod";
import {zDate} from "../utils";
import {fileAssetSchema} from "./file-asset.schema";

export const messageRoles = ["SYSTEM", "USER", "ASSISTANT", "TOOL"] as const;
export const messageStatuses = ["PROCESSING", "COMPLETE", "FAILED"] as const;

export const messageSchema = z.object({
	id: z.uuidv4(),
	role: z.enum(messageRoles),
	content: z.string(),
	model: z.string().nullable(),
	inputTokens: z.number().int().nullable(),
	outputTokens: z.number().int().nullable(),
	latencyMs: z.number().int().nullable(),
	status: z.enum(messageStatuses),

	tutorChatId: z.uuidv4(),
	userId: z.uuidv4(),

	createdAt: zDate,
	updatedAt: zDate,
});

export type TMessage = z.infer<typeof messageSchema>;

export const messageWithAttachmentsSchema = messageSchema.extend({
	attachments: z
		.array(
			fileAssetSchema.pick({
				id: true,
				name: true,
				mimeType: true,
				sizeBytes: true,
				url: true,
			}),
		)
		.optional(),
});

export type TMessageWithAttachments = z.infer<
	typeof messageWithAttachmentsSchema
>;
