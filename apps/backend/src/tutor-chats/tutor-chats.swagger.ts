import {applyDecorators} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTooManyRequestsResponse,
	ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {
	BulkDeleteTutorChatQuery,
	CreateTutorChatInput,
	CreateTutorChatResponse,
	FindAllTutorChatsQuery,
	FindAllTutorChatsResponse,
	UpdateTutorChatInput,
	UpdateTutorChatResponse
} from "./tutor-chats.dto";

export const ApiFindAllTutorChats = () => {
	return applyDecorators(
		ApiOperation({
			summary: "Get all tutor chats for the authenticated user",
			description:
				"Retrieves a paginated list of tutor chats associated with the authenticated user. " +
				"Supports cursor-based pagination to load chats incrementally."
		}),
		ApiQuery({
			type: FindAllTutorChatsQuery
		}),
		ApiOkResponse({
			description: "List of tutor chats retrieved successfully.",
			type: FindAllTutorChatsResponse
		}),
		ApiUnauthorizedResponse({
			description: "User not authenticated"
		}),
		ApiTooManyRequestsResponse({
			description: "Too many requests - Rate limit exceeded"
		})
	);
};

export const ApiCreateTutorChat = () => {
	return applyDecorators(
		ApiOperation({
			summary: "Create a new tutor chat",
			description: "Creates a new chat session with a tutor. " + "Initializes the chat context and settings."
		}),
		ApiBody({
			type: CreateTutorChatInput,
			description: "Details for the new tutor chat"
		}),
		ApiCreatedResponse({
			description: "The tutor chat has been successfully created.",
			type: CreateTutorChatResponse
		}),
		ApiBadRequestResponse({
			description: "Invalid input data"
		}),
		ApiUnauthorizedResponse({
			description: "User not authenticated"
		}),
		ApiTooManyRequestsResponse({
			description: "Too many requests - Rate limit exceeded"
		})
	);
};

export const ApiUpdateTutorChat = () => {
	return applyDecorators(
		ApiOperation({
			summary: "Update a tutor chat",
			description: "Updates the topic or other properties of an existing tutor chat."
		}),
		ApiBody({
			type: UpdateTutorChatInput,
			description: "Use ID and fields to update"
		}),
		ApiOkResponse({
			description: "The tutor chat has been successfully updated.",
			type: UpdateTutorChatResponse
		}),
		ApiNotFoundResponse({
			description: "The tutor chat could not be found or does not belong to the requesting user."
		}),
		ApiUnauthorizedResponse({
			description: "User not authenticated"
		}),
		ApiTooManyRequestsResponse({
			description: "Too many requests - Rate limit exceeded"
		})
	);
};

export const ApiDeleteTutorChat = () => {
	return applyDecorators(
		ApiOperation({
			summary: "Delete a tutor chat",
			description:
				"Permanently deletes a tutor chat session and all associated messages. " + "This action cannot be undone."
		}),
		ApiParam({
			name: "tutorChatId",
			type: String,
			description: "The unique identifier of the tutor chat to delete",
			example: "cm4abc123def456ghi789jkl"
		}),
		ApiNoContentResponse({
			description: "The tutor chat has been successfully deleted."
		}),
		ApiNotFoundResponse({
			description: "The tutor chat could not be found or does not belong to the requesting user."
		}),
		ApiUnauthorizedResponse({
			description: "User not authenticated"
		}),
		ApiTooManyRequestsResponse({
			description: "Too many requests - Rate limit exceeded"
		})
	);
};

export const ApiBulkDeleteTutorChats = () => {
	return applyDecorators(
		ApiOperation({
			summary: "Delete multiple tutor chats",
			description:
				"Permanently deletes multiple tutor chat sessions identified by their IDs. " +
				"Ignores IDs that are not found or do not belong to the user."
		}),
		ApiQuery({
			type: BulkDeleteTutorChatQuery
		}),
		ApiNoContentResponse({
			description: "The tutor chats have been successfully deleted."
		}),
		ApiNotFoundResponse({
			description: "Some of the tutor chats could not be found or do not belong to the requesting user."
		}),
		ApiUnauthorizedResponse({
			description: "User not authenticated"
		}),
		ApiTooManyRequestsResponse({
			description: "Too many requests - Rate limit exceeded"
		})
	);
};
