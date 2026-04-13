import {uploadContextFileInputSchema, uploadContextFileResponseSchema} from "@repo/schemas";
import {createZodDto} from "nestjs-zod";

export class UploadContextFileInput extends createZodDto(uploadContextFileInputSchema) {}

export class UploadContextFileResponse extends createZodDto(uploadContextFileResponseSchema) {}
