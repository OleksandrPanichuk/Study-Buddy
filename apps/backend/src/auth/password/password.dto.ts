import {
  resetPasswordSchema,
  sendResetPasswordTokenSchema,
  verifyResetPasswordTokenSchema,
} from "@repo/schemas";
import { createZodDto } from "nestjs-zod";

export class VerifyResetPasswordTokenInput extends createZodDto(
  verifyResetPasswordTokenSchema,
) {}

export class ResetPasswordInput extends createZodDto(resetPasswordSchema) {}

export class SendResetPasswordTokenInput extends createZodDto(
  sendResetPasswordTokenSchema,
) {}
