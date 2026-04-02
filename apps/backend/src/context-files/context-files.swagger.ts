import { applyDecorators } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConsumes,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTooManyRequestsResponse,
	ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { UploadContextFileResponse } from "./context-files.dto";

export const ApiUploadContextFile = () => {
	return applyDecorators(
		ApiOperation({
			summary: "Upload a context file",
			description:
				"Uploads a single file and links it as context to a tutor chat. " +
				"The file is stored and queued for asynchronous processing."
		}),
		ApiConsumes("multipart/form-data"),
		ApiParam({
			name: "tutorChatId",
			type: String,
			description: "The unique identifier of the tutor chat session",
			example: "cm4abc123def456ghi789jkl"
		}),
		ApiBody({
			description: "File and metadata used to create a context file entry",
			schema: {
				type: "object",
				properties: {
					file: {
						type: "string",
						format: "binary",
						description: "File to upload. Allowed types: PDF, DOC, DOCX, TXT."
					},
					tutorChatId: {
						type: "string",
						format: "uuid",
						description: "Tutor chat identifier"
					},
					note: {
						type: "string",
						description: "Optional note for this context file"
					},
					priority: {
						type: "integer",
						description: "Priority used when ordering context files"
					}
				},
				required: ["file", "tutorChatId", "priority"]
			}
		}),
		ApiOkResponse({
			description: "Context file uploaded and queued for processing.",
			type: UploadContextFileResponse
		}),
		ApiNotFoundResponse({
			description: "The tutor chat with the specified ID was not found"
		}),
		ApiBadRequestResponse({
			description: "Invalid request payload or unsupported file upload"
		}),
		ApiUnauthorizedResponse({
			description: "User not authenticated"
		}),
		ApiTooManyRequestsResponse({
			description: "Too many requests - Rate limit exceeded"
		})
	);
};

