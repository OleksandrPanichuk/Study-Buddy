import z from "zod";
import { zDate } from "../utils";

export enum AttachmentScope {
	MESSAGE = "MESSAGE"
}

export const messageAttachmentSchema = z.object({
	id: z.uuidv4(),
	scope: z.enum(AttachmentScope),
	messageId: z.uuidv4(),
	fileId: z.uuidv4(),
	createdAt: zDate
});

export type TMessageAttachment = z.infer<typeof messageAttachmentSchema>;
