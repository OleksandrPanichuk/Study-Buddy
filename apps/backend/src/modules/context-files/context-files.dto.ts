import {getContextFilesResponseSchema, updateContextFileBodySchema, updateContextFileResponseSchema, uploadContextFileBodySchema, uploadContextFileResponseSchema} from "@repo/schemas";
import {createZodDto} from "nestjs-zod";

export class UploadContextFileInput extends createZodDto(uploadContextFileBodySchema) {}

export class UploadContextFileResponse extends createZodDto(uploadContextFileResponseSchema) {}

export class UpdateContextFileInput extends createZodDto(updateContextFileBodySchema) {}

export class UpdateContextFileResponse extends createZodDto(updateContextFileResponseSchema) {}

export class GetContextFilesResponse extends createZodDto(getContextFilesResponseSchema) {}
