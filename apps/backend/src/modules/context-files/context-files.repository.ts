import { PrismaService } from "@app/prisma";
import { Injectable } from "@nestjs/common";
import type { ICreateContextFileData, IUpdateContextFileData } from "@/modules/context-files/context-files.interfaces";

@Injectable()
export class ContextFilesRepository {
	constructor(private readonly db: PrismaService) {}

	public findContextFilesByTutorChatId(tutorChatId: string) {
		return this.db.contextFile.findMany({
			where: {
				tutorChatId
			},
			include: {
				file: true
			}
		});
	}

	public findContextFilesByTutorChatIdWithChunks(tutorChatId: string) {
		return this.db.contextFile.findMany({
			where: {
				tutorChatId
			},
			include: {
				file: {
					include: {
						chunks: true
					}
				}
			}
		});
	}

	public findContextFileById(id: string) {
		return this.db.contextFile.findUnique({
			where: {
				id
			}
		});
	}

	public createContextFile(data: ICreateContextFileData) {
		return this.db.contextFile.create({
			data: {
				fileId: data.fileId,
				tutorChatId: data.tutorChatId,
				note: data.note,
				priority: data.priority
			}
		});
	}

	public deleteContextFile(id: string) {
		return this.db.contextFile.delete({
			where: {
				id
			}
		});
	}

	public updateContextFilePriority(id: string, priority: number) {
		return this.db.contextFile.update({
			where: { id },
			data: { priority }
		});
	}

	public updateContextFile(id: string, data: IUpdateContextFileData) {
		return this.db.contextFile.update({
			where: { id },
			data: {
				...(data.note !== undefined && { note: data.note }),
				...(data.priority !== undefined && { priority: data.priority })
			}
		});
	}

	public findContextFileWithTutorChat(id: string) {
		return this.db.contextFile.findUnique({
			where: { id },
			include: { tutorChat: true }
		});
	}
}
