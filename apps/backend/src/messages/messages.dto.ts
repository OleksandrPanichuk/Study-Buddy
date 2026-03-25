import {
	createMessageInputSchema,
	createMessageResponseSchema,
	findAllMessagesInputSchema,
	findAllMessagesResponseSchema
} from "@repo/schemas";
import { createZodDto } from "nestjs-zod";

export class FindAllMessagesQuery extends createZodDto(findAllMessagesInputSchema.omit({ tutorChatId: true })) {}

export class FindAllMessagesResponse extends createZodDto(findAllMessagesResponseSchema) {}

export class CreateMessageInput extends createZodDto(createMessageInputSchema.omit({ tutorChatId: true })) {}

export class CreateMessageResponse extends createZodDto(createMessageResponseSchema) {}
