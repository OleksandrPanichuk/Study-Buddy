import { deleteFileAssetInputSchema, uploadFilesResponseSchema } from "@repo/schemas";
import { createZodDto } from "nestjs-zod";

export class UploadFilesResponse extends createZodDto(uploadFilesResponseSchema) {}

export class DeleteFileAssetParams extends createZodDto(deleteFileAssetInputSchema) {}
