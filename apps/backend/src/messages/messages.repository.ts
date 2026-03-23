import {AttachmentScope, MessageStatus, PrismaService} from "@app/prisma";
import {Injectable} from "@nestjs/common";
import type {
	ICreateMessageData,
	IFindAllMessagesData,
	IFindAttachmentsForContextData,
	IFindRecentMessagesForContextData,
	IUpdateMessageData
} from "./messages.interfaces";

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

	public async findRecentForContext(data: IFindRecentMessagesForContextData) {
		const messages = await this.db.message.findMany({
			where: {
				tutorChatId: data.tutorChatId,
				userId: data.userId,
				status: MessageStatus.COMPLETE,
				id: data.excludeMessageIds?.length ? {notIn: data.excludeMessageIds} : undefined
			},
			select: {
				id: true,
				role: true,
				content: true,
				createdAt: true
			},
			take: data.limit ?? 8,
			orderBy: {
				createdAt: "desc"
			}
		});

		return messages.reverse();
	}

	public async findAttachmentsForContext(data: IFindAttachmentsForContextData) {
		const attachments = await this.db.messageAttachment.findMany({
			where: {
				messageId: data.messageId,
				message: {
					userId: data.userId
				}
			},
			select: {
				file: {
					select: {
						id: true,
						name: true,
						mimeType: true,
						sizeBytes: true,
						status: true,
						chunks: {
							select: {
								content: true
							},
							orderBy: {
								index: "asc"
							},
							take: data.chunkLimit ?? 2
						}
					}
				}
			}
		});

		return attachments.map(({file}) => ({
			id: file.id,
			name: file.name,
			mimeType: file.mimeType,
			sizeBytes: file.sizeBytes,
			status: file.status,
			chunks: file.chunks.map((chunk) => chunk.content)
		}));
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
