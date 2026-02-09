import { FileStatus, PrismaService } from "@app/prisma";
import { Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import type { ICreateFileAssetData, ICreateFileChunkData } from "./files.interfaces";

@Injectable()
export class FilesRepository {
	constructor(private readonly db: PrismaService) {}

	// FileAsset Operations
	public findFileAssetById(id: string) {
		return this.db.fileAsset.findUnique({
			where: {
				id
			}
		});
	}

	public createFileAssets(data: ICreateFileAssetData[]) {
		return this.db.fileAsset.createManyAndReturn({
			data: data.map((file) => ({
				userId: file.userId,
				name: file.name,
				mimeType: file.mimeType,
				sizeBytes: file.sizeBytes,
				url: file.url,
				status: file.status,
				storageKey: file.storageKey
			}))
		});
	}

	public updateFileAssetStatus(id: string, status: FileStatus) {
		return this.db.fileAsset.update({
			where: {
				id
			},
			data: {
				status
			}
		});
	}

	public updateFileAssetTextHash(id: string, textHash: string) {
		return this.db.fileAsset.update({
			where: {
				id
			},
			data: {
				textHash,
				status: FileStatus.READY
			}
		});
	}

	// FileChunk Operations

	public findChunksByFileId(fileId: string) {
		return this.db.fileChunk.findMany({
			where: {
				fileId
			}
		});
	}

	public findSimilarChunks(embedding: number[], limit = 10, threshold = 0.7) {
		const vectorStr = `[${embedding.join(",")}]`;

		return this.db.$queryRaw`
            SELECT
              id,
              "file_id" as "fileId",
              content,
              index,
              "token_count" as "tokenCount",
              1 - (embedding <=> ${vectorStr}::vector) as similarity
            FROM "file_chunks"
            WHERE 1 - (embedding <=> ${vectorStr}::vector) > ${threshold}
            ORDER BY embedding <=> ${vectorStr}::vector
            LIMIT ${limit}
          `;
	}
	

	public async createChunks(fileAssetId: string, data: ICreateFileChunkData[]) {
		await this.db.$transaction(
			data.map((chunk) => {
				return this.db.$executeRaw`
                    INSERT INTO "file_chunks" (id, index, content, token_count, embedding, file_id)
                    VALUES (${uuid()}, ${chunk.index}, ${chunk.content}, ${chunk.tokenCount}, ${chunk.embedding}::vector, ${fileAssetId})
                `;
			})
		);
	}


	public deleteChunksByFileId(fileId: string) {
		return this.db.fileChunk.deleteMany({
			where: {
				fileId
			}
		});
	}
}
