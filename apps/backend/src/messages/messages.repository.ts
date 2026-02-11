import { PrismaService } from "@app/prisma";
import { Injectable } from "@nestjs/common";
import type { ICreateMessageData, IFindAllMessagesData, IUpdateMessageData } from "./messages.interfaces";

@Injectable()
export class MessagesRepository {
	constructor(private readonly db: PrismaService) {}

	public findAll(data: IFindAllMessagesData) {
		return this.db.message.findMany({
			where: {
				tutorChatId: data.tutorChatId,
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
		return this.db.message.findUnique({
			where: { id }
		});
	}

	public create(data: ICreateMessageData) {
		return this.db.message.create({
			data: {
				tutorChatId: data.tutorChatId,
				userId: data.userId,
				content: data.content,
				role: data.role,
				model: data.model,
				status: data.status
			}
		});
	}

	public update(data: IUpdateMessageData) {
		return this.db.message.update({
			where: {
				id: data.id
			},
			data: {
				content: data.content,
				status: data.status,
				inputTokens: data.inputTokens,
				outputTokens: data.outputTokens,
				latencyMs: data.latencyMs
			}
		});
	}
}
