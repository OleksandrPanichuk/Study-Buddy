import {z} from "zod";
import {zPassword} from "../utils";

export const verifyResetPasswordTokenSchema = z.object({
	token: z.string().describe("Reset password token"),
});

export const sendResetPasswordTokenSchema =
	verifyResetPasswordTokenSchema.extend({
		email: z
			.email("Invalid email address")
			.trim()
			.describe("User email address"),
	});

export const resetPasswordSchema = verifyResetPasswordTokenSchema.extend({
	password: zPassword.describe("New password"),
});
