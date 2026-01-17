import { z } from "zod";
import { zPassword } from "../utils";

export const verifyResetPasswordTokenInputSchema = z.object({
	token: z.string().describe("Reset password token"),
	email: z.email().describe("User email address")
});

export const sendResetPasswordTokenInputSchema = z.object({
	email: z.email("Invalid email address").trim().describe("User email address"),
	resetPageUrl: z.url("Invalid url").trim().describe("URL of the password reset page on the client")
});

export const resetPasswordInputSchema = verifyResetPasswordTokenInputSchema.extend({
	password: zPassword.describe("New password")
});

export const verifyResetPasswordTokenResponseSchema = z.object({
	valid: z.boolean().describe("Indicates if the token is valid")
});

export type TVerifyResetPasswordTokenInput = z.infer<typeof verifyResetPasswordTokenInputSchema>;
export type TSendResetPasswordTokenInput = z.infer<typeof sendResetPasswordTokenInputSchema>;
export type TResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;

export type TVerifyResetPasswordTokenResponse = z.infer<typeof verifyResetPasswordTokenResponseSchema>;
