export interface IFindAllTutorChatsInput {
	take?: number;
	cursor?: string | null;
	userId: string;
}
