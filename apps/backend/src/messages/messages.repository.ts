import { PrismaService } from "@app/prisma";
import { Injectable } from "@nestjs/common";
import type { ICreateMessageData, IFindAllMessagesData, IUpdateMessageData } from "./messages.interfaces";
import { AttachmentScope } from "@app/prisma";

@Injectable()
export class MessagesRepository {
	constructor(private readonly db: PrismaService) {}

	public async findAll(data: IFindAllMessagesData) {
		const result = await this.db.message.findMany({
			where: {
				tutorChatId: data.tutorChatId,
				userId: data.userId
			},
			include: {
				attachments: {
					select: {
						id: true,
						fileId: true,
						file: {
							select: {
								id: true,
								name: true,
								mimeType: true,
								sizeBytes: true,
								url: true
							}
						}
					}
				}
			},
			take: data.take,
			cursor: data.cursor ? { id: data.cursor } : undefined,
			orderBy: {
				createdAt: "desc"
			}
		});

		return result.map((message) => ({
			...message,
			attachments: message.attachments.map((attachment) => attachment.file)
		}));
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

	public createMessageAttachments(messageId: string, fileIds: string[]) {
		if (!fileIds.length) return Promise.resolve({ count: 0 });

		return this.db.messageAttachment.createMany({
			data: fileIds.map((fileId) => ({
				scope: AttachmentScope.MESSAGE,
				messageId,
				fileId
			})),
			skipDuplicates: true
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
