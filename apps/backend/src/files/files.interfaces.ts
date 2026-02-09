import { FileStatus } from "@app/prisma";

export interface ICreateFileAssetData {
	name: string;
	mimeType: string;
	sizeBytes: number;
	url: string;
	userId: string;
	status: FileStatus;
	storageKey: string;
}

export interface ICreateFileChunkData {
	index: number;
	content: string;
	tokenCount: number;
	embedding: number[];
}

export interface IFileProcessingJobData {
	fileAssetId: string;
	storageKey: string;
}

