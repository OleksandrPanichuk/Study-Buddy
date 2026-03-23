import {
  bulkDeleteTutorChatsInputSchema,
  createTutorChatInputSchema,
  createTutorChatResponseSchema,
  deleteTutorChatInputSchema,
  findAllTutorChatsInputSchema,
  findAllTutorChatsResponseSchema,
  findTutorChatInputSchema,
  updateTutorChatInputSchema,
  updateTutorChatResponseSchema
} from "@repo/schemas";
import {createZodDto} from "nestjs-zod";

export class CreateTutorChatInput extends createZodDto(createTutorChatInputSchema) {}

export class CreateTutorChatResponse extends createZodDto(createTutorChatResponseSchema) {}

export class FindAllTutorChatsQuery extends createZodDto(findAllTutorChatsInputSchema) {}

export class FindAllTutorChatsResponse extends createZodDto(findAllTutorChatsResponseSchema) {}

export class FindTutorChatParams extends createZodDto(findTutorChatInputSchema) {}

export class FindTutorChatResponse extends createZodDto(findAllTutorChatsResponseSchema) {}

export class DeleteTutorChatParams extends createZodDto(deleteTutorChatInputSchema) {}

export class BulkDeleteTutorChatQuery extends createZodDto(bulkDeleteTutorChatsInputSchema) {}

export class UpdateTutorChatInput extends createZodDto(updateTutorChatInputSchema) {}

export class UpdateTutorChatResponse extends createZodDto(updateTutorChatResponseSchema) {}
