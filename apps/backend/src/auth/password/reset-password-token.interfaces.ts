export interface ICreateResetPasswordTokenData {
	token: string;
	userId: string;
	expiresAt: Date;
	resendCount?: number;
}
