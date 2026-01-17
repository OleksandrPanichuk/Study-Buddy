import {
	resetPasswordInputSchema,
	sendResetPasswordTokenInputSchema,
	signInInputSchema,
	signUpInputSchema,
	type TResetPasswordInput,
	type TSendResetPasswordTokenInput,
	type TSignInInput,
	type TSignInResponse,
	type TSignUpInput,
	type TSignUpResponse,
	TVerifyEmailInput,
	type TVerifyResetPasswordTokenInput,
	type TVerifyResetPasswordTokenResponse,
	verifyEmailSchema,
	verifyResetPasswordTokenInputSchema
} from "@repo/schemas";
import { createServerFn } from "@tanstack/react-start";
import { AUTH_API_ROUTES } from "@/features/auth";
import { fetcher } from "@/lib/fetcher";

export const signInFn = createServerFn({ method: "POST" })
	.inputValidator((data: TSignInInput) => signInInputSchema.parse(data))
	.handler(async (ctx) => {
		return await fetcher
			.post(AUTH_API_ROUTES.signIn, {
				json: ctx.data
			})
			.json<TSignInResponse>();
	});

export const signUpFn = createServerFn({ method: "POST" })
	.inputValidator((data: TSignUpInput) => signUpInputSchema.parse(data))
	.handler(async (ctx) => {
		return await fetcher
			.post(AUTH_API_ROUTES.signUp, {
				json: ctx.data
			})
			.json<TSignUpResponse>();
	});

export const signOutFn = createServerFn({ method: "GET" }).handler(async () => {
	await fetcher.get(AUTH_API_ROUTES.signOut);
});

export const forgotPasswordFn = createServerFn({ method: "POST" })
	.inputValidator((data: TSendResetPasswordTokenInput) => sendResetPasswordTokenInputSchema.parse(data))
	.handler(async (ctx) => {
		await fetcher.post(AUTH_API_ROUTES.forgotPassword, {
			json: ctx.data
		});
	});

export const resetPasswordFn = createServerFn({ method: "POST" })
	.inputValidator((data: TResetPasswordInput) => resetPasswordInputSchema.parse(data))
	.handler(async (ctx) => {
		await fetcher.patch(AUTH_API_ROUTES.resetPassword, {
			json: ctx.data
		});
	});

export const verifyResetTokenFn = createServerFn({ method: "POST" })
	.inputValidator((data: TVerifyResetPasswordTokenInput) => verifyResetPasswordTokenInputSchema.parse(data))
	.handler(async (ctx) => {
		return await fetcher
			.post(AUTH_API_ROUTES.verifyResetToken, {
				json: ctx.data
			})
			.json<TVerifyResetPasswordTokenResponse>();
	});

export const sendVerificationCodeFn = createServerFn({ method: "POST" }).handler(async () => {
	await fetcher.post(AUTH_API_ROUTES.sendVerificationCode);
});

export const verifyEmailFn = createServerFn({ method: "POST" })
	.inputValidator((data: TVerifyEmailInput) => verifyEmailSchema.parse(data))
	.handler(async (ctx) => {
		await fetcher.post(AUTH_API_ROUTES.verifyEmail, { json: ctx.data });
	});
