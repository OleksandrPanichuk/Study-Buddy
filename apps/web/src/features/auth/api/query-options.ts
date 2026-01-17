import type {
	TResetPasswordInput,
	TSendResetPasswordTokenInput,
	TSignInInput,
	TSignUpInput,
	TVerifyEmailInput
} from "@repo/schemas/auth";
import { mutationOptions } from "@tanstack/react-query";
import {
	forgotPasswordFn,
	type IAuthStore,
	resetPasswordFn,
	sendVerificationCodeFn,
	signInFn,
	signOutFn,
	signUpFn,
	verifyEmailFn
} from "@/features/auth";

export const getSignInMutationOptions = (setUser: IAuthStore["setUser"]) =>
	mutationOptions({
		mutationFn: (data: TSignInInput) => signInFn({ data }),
		onSuccess: (user) => {
			setUser(user);
		}
	});

export const getSignUpMutationOptions = (setUser: IAuthStore["setUser"]) =>
	mutationOptions({
		mutationFn: (data: TSignUpInput) => signUpFn({ data }),
		onSuccess: (user) => {
			setUser(user);
		}
	});

export const getSignOutMutationOptions = (setUser: IAuthStore["setUser"]) =>
	mutationOptions({
		mutationFn: () => signOutFn(),
		onSuccess: () => {
			setUser(null);
		}
	});

export const getForgotPasswordMutationOptions = () =>
	mutationOptions({
		mutationFn: (data: TSendResetPasswordTokenInput) => forgotPasswordFn({ data })
	});

export const getResetPasswordMutationOptions = () =>
	mutationOptions({
		mutationFn: (data: TResetPasswordInput) => resetPasswordFn({ data })
	});

export const getSendVerificationCodeMutationOptions = () =>
	mutationOptions({
		mutationFn: () => sendVerificationCodeFn()
	});

export const getVerifyEmailMutationOptions = () =>
	mutationOptions({
		mutationFn: (data: TVerifyEmailInput) => verifyEmailFn({ data })
	});
