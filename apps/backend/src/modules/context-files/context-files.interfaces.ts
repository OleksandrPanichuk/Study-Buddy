export interface ICreateContextFileData {
	tutorChatId: string;
	fileId: string;
	priority?: number;
	note?: string;
}

export interface IUpdateContextFileData {
	note?: string | null;
	priority?: number;
}
