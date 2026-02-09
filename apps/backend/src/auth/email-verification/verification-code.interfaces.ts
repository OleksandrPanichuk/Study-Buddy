export interface ICreateVerificationCodeData {
	code: string;
	userId: string;
	expiresAt: Date;
	resendCount?: number;
}
