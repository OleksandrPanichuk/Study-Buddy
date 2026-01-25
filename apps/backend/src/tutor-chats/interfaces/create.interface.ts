export interface ICreateTutorCharInput {
	userId: string;

	name: string;
	description?: string;
	topic?: string;
	prompt?: string;
}
