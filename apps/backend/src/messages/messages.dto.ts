import {
	createMessageInputSchema,
	createMessageResponseSchema,
	findAllMessagesInputSchema,
	findAllMessagesResponseSchema
} from "@repo/schemas";
import { createZodDto } from "nestjs-zod";

export class FindAllMessagesQuery extends createZodDto(findAllMessagesInputSchema) {}

export class FindAllMessagesResponse extends createZodDto(findAllMessagesResponseSchema) {}

export class CreateMessageInput extends createZodDto(createMessageInputSchema) {}

export class CreateMessageResponse extends createZodDto(createMessageResponseSchema) {}
