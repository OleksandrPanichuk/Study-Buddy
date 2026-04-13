import { createZodDto } from "nestjs-zod";
import { verifyEmailSchema } from "@repo/schemas";

export class VerifyEmailInput extends createZodDto(verifyEmailSchema) {}
