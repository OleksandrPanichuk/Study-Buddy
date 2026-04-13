export interface ICreateUserData {
	email: string;
	username: string;
	hash?: string;
	avatarUrl?: string;
}

export interface IUpdateFailedLoginAttemptsData {
	attempts: number;
	lockedUntil: Date | null;
}
