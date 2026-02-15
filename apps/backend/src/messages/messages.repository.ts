import {PrismaService} from "@app/prisma";
import {Injectable} from "@nestjs/common";
import type {ICreateMessageData, IFindAllMessagesData, IUpdateMessageData} from "./messages.interfaces";

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

	public createMessagePair(userMessageData: ICreateMessageData, assistantMessageData: ICreateMessageData) {
		return this.db.$transaction([
			this.db.message.create({
				data: {
					tutorChatId: userMessageData.tutorChatId,
					userId: userMessageData.userId,
					content: userMessageData.content,
					role: userMessageData.role,
					model: userMessageData.model,
					status: userMessageData.status
				}
			}),
			this.db.message.create({
				data: {
					tutorChatId: assistantMessageData.tutorChatId,
					userId: assistantMessageData.userId,
					content: assistantMessageData.content,
					role: assistantMessageData.role,
					model: assistantMessageData.model,
					status: assistantMessageData.status
				}
			})
		]);
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
