import { PrismaService } from "@app/prisma";
import { Injectable } from "@nestjs/common";
import type { ICreateTutorCharInput, IFindAllTutorChatsInput, IUpdateTutorChatInput } from "./tutor-chats.interfaces";

@Injectable()
export class TutorChatsRepository {
	constructor(private readonly db: PrismaService) {}

	public findByUserId(data: IFindAllTutorChatsInput) {
		return this.db.tutorChat.findMany({
			where: {
				userId: data.userId
			},
			take: data.take,
			cursor: data.cursor ? { id: data.cursor } : undefined,
			orderBy: {
				createdAt: "desc"
			}
		});
	}

	public findById(id: string) {
		return this.db.tutorChat.findUnique({
			where: { id }
		});
	}

	public create(data: ICreateTutorCharInput) {
		return this.db.tutorChat.create({
			data: {
				userId: data.userId,
				name: data.name,
				description: data.description,
				topic: data.topic,
				prompt: data.prompt
			}
		});
	}

	public update(data: IUpdateTutorChatInput) {
		return this.db.tutorChat.update({
			where: {
				id: data.id
			},
			data: {
				name: data.name,
				description: data.description,
				topic: data.topic,
				prompt: data.prompt
			}
		});
	}

	public delete(id: string) {
		return this.db.tutorChat.delete({
			where: {
				id
			}
		});
	}

	public bulkDelete(ids: string[]) {
		return this.db.tutorChat.deleteMany({
			where: {
				id: {
					in: ids
				}
			}
		});
	}
}
