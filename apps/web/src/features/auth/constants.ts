export const AUTH_API_ROUTES = {
	signIn: "auth/sign-in",
	signUp: "auth/sign-up",
	signOut: "auth/sign-out",
	forgotPassword: "auth/password/send",
	resetPassword: "auth/password/reset",
	verifyResetToken: "auth/password/verify",
	verifyEmail: "auth/email-verification/verify",
	sendVerificationCode: "auth/email-verification/code",
	google: "auth/sign-in/google",
	github: "auth/sign-in/github"
} as const;
