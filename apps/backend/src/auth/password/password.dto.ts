import {
	resetPasswordInputSchema,
	sendResetPasswordTokenInputSchema,
	verifyResetPasswordTokenInputSchema,
	verifyResetPasswordTokenResponseSchema
} from "@repo/schemas";
import { createZodDto } from "nestjs-zod";

export class VerifyResetPasswordTokenInput extends createZodDto(verifyResetPasswordTokenInputSchema) {}
export class VerifyResetPasswordTokenResponse extends createZodDto(verifyResetPasswordTokenResponseSchema) {}

export class ResetPasswordInput extends createZodDto(resetPasswordInputSchema) {}

export class SendResetPasswordTokenInput extends createZodDto(sendResetPasswordTokenInputSchema) {}
