import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import {
  BulkDeleteTutorChatsInput,
  CreateTutorChatInput,
  FindAllTutorChatsQuery,
} from "./tutor-chats.dto";

export const ApiFindAllTutorChats = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Get all tutor chats for the authenticated user",
      description:
        "Retrieves a list of tutor chats associated with the authenticated user.",
    }),
    ApiQuery({
      type: FindAllTutorChatsQuery,
    }),
  );
};

export const ApiCreateTutorChat = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Create a new tutor chat",
      description: "Creates a new chat session with a tutor.",
    }),
    ApiBody({
      type: CreateTutorChatInput,
    }),
    ApiCreatedResponse({
      description: "The tutor chat has been successfully created.",
    }),
  );
};

export const ApiDeleteTutorChat = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Delete a tutor chat",
      description: "Deletes a tutor chat session.",
    }),
    ApiParam({
      name: "tutorChatId",
      type: String,
      description: "Parameters for deleting a tutor chat",
    }),
    ApiNoContentResponse({
      description: "The tutor chat has been successfully deleted.",
    }),
    ApiNotFoundResponse({
      description:
        "The tutor chat could not be found or tutor chat does not belong to the requesting user.",
    }),
  );
};

export const ApiBulkDeleteTutorChats = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Delete multiple tutor chats",
      description: "Deletes multiple tutor chat sessions.",
    }),
    ApiBody({
      type: BulkDeleteTutorChatsInput,
    }),
    ApiNoContentResponse({
      description: "The tutor chats have been successfully deleted.",
    }),
    ApiNotFoundResponse({
      description:
        "Some of the tutor chats could not be found or do not belong to the requesting user.",
    }),
  );
};
