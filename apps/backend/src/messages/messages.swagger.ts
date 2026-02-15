import {applyDecorators} from "@nestjs/common";
import {
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiProduces,
    ApiQuery,
    ApiTooManyRequestsResponse,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {CreateMessageInput, CreateMessageResponse, FindAllMessagesQuery, FindAllMessagesResponse} from "./messages.dto";

export const ApiFindAllMessages = () => {
	return applyDecorators(
		ApiOperation({
			summary: "Find all messages",
			description:
				"Retrieves a paginated list of messages for a specific tutor chat session. " +
				"Supports cursor-based pagination. " +
				"Returns messages in chronological order."
		}),
		ApiParam({
			name: "tutorChatId",
			type: String,
			description: "The unique identifier of the tutor chat session",
			example: "cm4abc123def456ghi789jkl"
		}),
		ApiQuery({
			type: FindAllMessagesQuery
		}),
		ApiOkResponse({
			description: "List of messages retrieved successfully.",
			type: FindAllMessagesResponse
		}),
		ApiNotFoundResponse({
			description: "The tutor chat with the specified ID was not found"
		}),
		ApiUnauthorizedResponse({
			description: "User not authenticated"
		}),
		ApiTooManyRequestsResponse({
			description: "Too many requests - Rate limit exceeded"
		})
	);
};

export const ApiCreateMessage = () => {
	return applyDecorators(
		ApiOperation({
			summary: "Send a message",
			description:
				"Sends a new user message to the tutor chat and initiates the assistant's response generation. " +
				"The assistant's response is created with a 'PROCESSING' status and can be streamed using the stream endpoint. " +
				"Returns both the created user message and the placeholder assistant message."
		}),
		ApiParam({
			name: "tutorChatId",
			type: String,
			description: "The unique identifier of the tutor chat session",
			example: "cm4abc123def456ghi789jkl"
		}),
		ApiBody({
			type: CreateMessageInput,
			description: "Message content and optional model configuration"
		}),
		ApiCreatedResponse({
			description: "Message sent successfully.",
			type: CreateMessageResponse
		}),
		ApiNotFoundResponse({
			description: "The tutor chat with the specified ID was not found"
		}),
		ApiForbiddenResponse({
			description: "User does not have permission to send messages in this tutor chat"
		}),
		ApiUnauthorizedResponse({
			description: "User not authenticated"
		}),
		ApiTooManyRequestsResponse({
			description: "Too many requests - Rate limit exceeded"
		})
	);
};

export const ApiStreamMessage = () => {
	return applyDecorators(
		ApiOperation({
			summary: "Stream message response",
			description:
				"Establishes a Server-Sent Events (SSE) connection to stream the assistant's response generation. " +
				"Emits events with the generated text chunks as they become available. " +
				"The stream closes automatically when generation is complete or fails."
		}),
		ApiParam({
			name: "tutorChatId",
			type: String,
			description: "The unique identifier of the tutor chat session",
			example: "cm4abc123def456ghi789jkl"
		}),
		ApiParam({
			name: "messageId",
			type: String,
			description: "The unique identifier of the assistant message to stream",
			example: "cm4xyz789abc012def345ghi"
		}),
		ApiOkResponse({
			description: "Event stream established successfully.",
			content: {
				"text/event-stream": {
					schema: {
						type: "object",
						properties: {
							data: {
								type: "object",
								properties: {
									messageId: { type: "string" },
									content: { type: "string" },
									status: { type: "string", enum: ["STREAMING", "COMPLETE", "FAILED"] },
									error: { type: "string", nullable: true }
								}
							}
						}
					}
				}
			}
		}),
		ApiNotFoundResponse({
			description: "The tutor chat or message was not found"
		}),
		ApiUnauthorizedResponse({
			description: "User not authenticated"
		}),
		ApiProduces("text/event-stream")
	);
};
