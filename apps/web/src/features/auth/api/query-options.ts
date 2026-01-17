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
	resetPasswordFn,
	sendVerificationCodeFn,
	signInFn,
	signOutFn,
	signUpFn,
	verifyEmailFn
} from "@/features/auth";
import { PROFILE_QUERY_KEYS } from "@/features/profile";

export const getSignInMutationOptions = () =>
	mutationOptions({
		mutationFn: (data: TSignInInput) => signInFn({ data }),
		onSuccess: (user, _variables, _onMutationResult, { client }) => {
			client.setQueryData(PROFILE_QUERY_KEYS.currentUser(), user);
		}
	});

export const getSignUpMutationOptions = () =>
	mutationOptions({
		mutationFn: (data: TSignUpInput) => signUpFn({ data }),
		onSuccess: (user, _variables, _onMutationResult, { client }) => {
			client.setQueryData(PROFILE_QUERY_KEYS.currentUser(), user);
		}
	});

export const getSignOutMutationOptions = () =>
	mutationOptions({
		mutationFn: () => signOutFn(),
		onSuccess: (_data, _variables, _onMutationResult, { client }) => {
			client.setQueryData(PROFILE_QUERY_KEYS.currentUser(), null);
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
