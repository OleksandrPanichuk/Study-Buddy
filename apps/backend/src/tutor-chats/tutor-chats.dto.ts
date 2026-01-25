import {
  bulkDeleteTutorChatsInputSchema,
  createTutorChatInputSchema,
  createTutorChatResponseSchema,
  deleteTutorChatInputSchema,
  findAllTutorChatsInputSchema,
  findAllTutorChatsResponseSchema,
  updateTutorChatInputSchema,
  updateTutorChatResponseSchema,
} from "@repo/schemas";
import { createZodDto } from "nestjs-zod";

export class CreateTutorChatInput extends createZodDto(
  createTutorChatInputSchema,
) {}

export class CreateTutorChatResponse extends createZodDto(
  createTutorChatResponseSchema,
) {}

export class FindAllTutorChatsInput extends createZodDto(
  findAllTutorChatsInputSchema,
) {}

export class FindAllTutorChatsResponse extends createZodDto(
  findAllTutorChatsResponseSchema,
) {}

export class DeleteTutorChatParams extends createZodDto(
  deleteTutorChatInputSchema,
) {}

export class BulkDeleteTutorChatsInput extends createZodDto(
  bulkDeleteTutorChatsInputSchema,
) {}

export class UpdateTutorChatInput extends createZodDto(
  updateTutorChatInputSchema,
) {}

export class UpdateTutorChatResponse extends createZodDto(
  updateTutorChatResponseSchema,
) {}
