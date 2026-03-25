import { applyDecorators } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConsumes,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTooManyRequestsResponse,
	ApiUnauthorizedResponse
} from "@nestjs/swagger";

export const ApiUploadTutorChat = () => {
	return applyDecorators(
		ApiOperation({
			summary: "Upload files to a tutor chat",
			description:
				"Uploads one or more files to a specific tutor chat session for processing. " +
				"The files are stored in S3 and queued for asynchronous processing (text extraction, chunking, and embedding generation). " +
				"Maximum of 10 files can be uploaded per request. " +
				"Each file must not exceed 100MB in size. " +
				"Only PDF, DOC, DOCX, and TXT files are supported. " +
				"Returns an array of uploaded file information including file IDs, storage URLs, keys, and processing job IDs."
		}),
		ApiConsumes("multipart/form-data"),
		ApiBody({
			description: "Files to upload (maximum 10 files, each up to 100MB)",
			schema: {
				type: "object",
				properties: {
					files: {
						type: "array",
						items: {
							type: "string",
							format: "binary"
						},
						description: "Array of files to upload. Allowed types: PDF, DOC, DOCX, TXT. Max size per file: 100MB.",
						maxItems: 10
					}
				},
				required: ["files"]
			}
		}),
		ApiParam({
			name: "tutorChatId",
			type: String,
			description: "The unique identifier of the tutor chat session to upload files to",
			example: "cm4abc123def456ghi789jkl"
		}),
		ApiOkResponse({
			description:
				"Files uploaded successfully and queued for processing. " +
				"Returns an array of file objects containing file asset IDs, processing job IDs, S3 URLs, and storage keys.",
			schema: {
				type: "array",
				items: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "Unique identifier for the uploaded file asset",
							example: "cm4xyz789abc012def345ghi"
						},
						jobId: {
							type: "string",
							description: "ID of the background processing job for this file",
							example: "1234567890"
						},
						url: {
							type: "string",
							description: "S3 URL where the file is stored",
							example: "https://s3.amazonaws.com/bucket/tutor-chats/cm4abc123/document.pdf"
						},
						key: {
							type: "string",
							description: "S3 storage key for the file",
							example: "tutor-chats/cm4abc123def456ghi789jkl/1234567890-document.pdf"
						}
					}
				},
				example: [
					{
						id: "cm4xyz789abc012def345ghi",
						jobId: "1234567890",
						url: "https://s3.amazonaws.com/bucket/tutor-chats/cm4abc123/document.pdf",
						key: "tutor-chats/cm4abc123def456ghi789jkl/1234567890-document.pdf"
					}
				]
			}
		}),
		ApiNotFoundResponse({
			description: "The tutor chat with the specified ID was not found or does not belong to the authenticated user"
		}),
		ApiBadRequestResponse({
			description:
				"Invalid file upload. Possible reasons: " +
				"File type not allowed (only PDF, DOC, DOCX, TXT are supported), " +
				"file size exceeds 100MB limit, " +
				"more than 10 files uploaded, " +
				"or no files provided in the request"
		}),
		ApiUnauthorizedResponse({
			description: "User not authenticated - Authentication required to upload files"
		}),
		ApiTooManyRequestsResponse({
			description: "Too many requests - Rate limit exceeded (10 requests per minute)"
		})
	);
};

export const ApiDeleteFileAsset = () => {
	return applyDecorators(
		ApiOperation({
			summary: "Delete a file asset",
			description:
				"Permanently deletes a file asset owned by the authenticated user. " +
				"Removes the file from S3 storage and deletes all associated records (chunks, embeddings) from the database."
		}),
		ApiParam({
			name: "fileAssetId",
			type: String,
			description: "The unique identifier of the file asset to delete",
			example: "cm4xyz789abc012def345ghi"
		}),
		ApiNoContentResponse({ description: "File asset deleted successfully" }),
		ApiNotFoundResponse({ description: "File asset not found or does not belong to the authenticated user" }),
		ApiUnauthorizedResponse({ description: "User is not authenticated" }),
		ApiTooManyRequestsResponse({ description: "Rate limit exceeded" })
	);
};
