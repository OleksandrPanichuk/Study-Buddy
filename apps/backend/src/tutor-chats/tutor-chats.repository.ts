import {PrismaService} from "@app/prisma";
import {Injectable} from "@nestjs/common";
import type {ICreateTutorCharInput, IFindAllTutorChatsInput, IUpdateTutorChatInput} from "./interfaces";

@Injectable()
export class TutorChatsRepository {
	constructor(private readonly db: PrismaService) {}

	public findByUserId(dto: IFindAllTutorChatsInput) {
		return this.db.tutorChat.findMany({
			where: {
				userId: dto.userId
			},
			take: dto.take,
			cursor: dto.cursor ? { id: dto.cursor } : undefined,
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

	public create(dto: ICreateTutorCharInput) {
		return this.db.tutorChat.create({
			data: {
				userId: dto.userId,
				name: dto.name,
				description: dto.description,
				topic: dto.topic,
				prompt: dto.prompt
			}
		});
	}

	public update(dto: IUpdateTutorChatInput) {
		return this.db.tutorChat.update({
			where: {
				id: dto.id
			},
			data: {
				name: dto.name,
				description: dto.description,
				topic: dto.topic,
				prompt: dto.prompt
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
