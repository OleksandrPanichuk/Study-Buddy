export interface ICreateTutorCharInput {
	userId: string;

	name: string;
	description?: string;
	topic?: string;
	prompt?: string;
}

export interface IFindAllTutorChatsInput {
	take?: number;
	cursor?: string | null;
	userId: string;
}

export interface IUpdateTutorChatInput {
	id: string;
	name?: string;
	description?: string;
	topic?: string;
	prompt?: string;
}
