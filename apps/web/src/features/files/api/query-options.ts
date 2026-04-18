import type { TGetContextFilesItem } from "@repo/schemas";
import type { TUploadFilesResponse } from "@repo/schemas/files";
import { mutationOptions, type QueryClient, queryOptions } from "@tanstack/react-query";
import {
	deleteFileAssetFn,
	getContextFilesFn,
	updateContextFileFn,
	uploadContextFileFn,
	uploadTutorChatFilesFn
} from "./functions.ts";

export type ContextFile = TUploadFilesResponse[number] & {
	contextFileId: string;
	note: string | null;
	priority: number;
};

const mapToContextFile = (item: TGetContextFilesItem): ContextFile => ({
	id: item.fileId,
	contextFileId: item.id,
	jobId: item.file.jobId ?? "",
	url: item.file.url,
	name: item.file.name,
	storageKey: null,
	sizeBytes: item.file.sizeBytes,
	mimeType: item.file.mimeType,
	note: item.note,
	priority: item.priority
});

export const getContextFilesQueryOptions = (tutorChatId: string) =>
	queryOptions({
		queryKey: ["context-files", tutorChatId] as const,
		queryFn: async () => {
			const data = await getContextFilesFn({ data: { tutorChatId } });
			return data.map(mapToContextFile);
		},
		enabled: !!tutorChatId
	});

export const getUploadTutorChatFilesMutationOptions = (tutorChatId: string) =>
	mutationOptions({
		mutationFn: (files: File[]) => {
			const formData = new FormData();
			formData.append("tutorChatId", tutorChatId);
			for (const file of files) formData.append("files", file);
			return uploadTutorChatFilesFn({ data: formData });
		}
	});

export const getUploadContextFileMutationOptions = (tutorChatId: string, queryClient: QueryClient) =>
	mutationOptions({
		mutationFn: async (files: File[]) => {
			return Promise.all(
				files.map(async (file, index) => {
					const formData = new FormData();
					formData.append("file", file);
					formData.append("tutorChatId", tutorChatId);
					formData.append("priority", String(index));

					const contextFile = await uploadContextFileFn({ data: formData });

					return {
						id: contextFile.fileId,
						contextFileId: contextFile.id,
						jobId: contextFile.jobId,
						url: contextFile.url,
						name: file.name,
						storageKey: null,
						sizeBytes: file.size,
						mimeType: file.type,
						note: contextFile.note ?? null,
						priority: contextFile.priority
					} satisfies ContextFile;
				})
			);
		},
		onSuccess: (newFiles) => {
			queryClient.setQueryData(getContextFilesQueryOptions(tutorChatId).queryKey, (prev) => {
				if (!prev) return newFiles;
				const existingIds = new Set(prev.map((f) => f.id));
				return [...prev, ...newFiles.filter((f) => !existingIds.has(f.id))];
			});
		}
	});

export const getUpdateContextFileMutationOptions = (queryClient: QueryClient) =>
	mutationOptions({
		mutationFn: ({
			contextFileId,
			note,
			priority
		}: {
			contextFileId: string;
			note?: string | null;
			priority?: number;
		}) => updateContextFileFn({ data: { contextFileId, note, priority } }),
		onSuccess: (updated, { contextFileId }) => {
			for (const [key, data] of queryClient.getQueriesData<ContextFile[]>({ queryKey: ["context-files"] })) {
				if (!data) continue;
				queryClient.setQueryData(
					key,
					data.map((f) =>
						f.contextFileId === contextFileId ? { ...f, note: updated.note, priority: updated.priority } : f
					)
				);
			}
		}
	});

export const getDeleteFileAssetMutationOptions = () =>
	mutationOptions({
		mutationFn: (fileAssetId: string) =>
			deleteFileAssetFn({
				data: {
					fileAssetId
				}
			})
	});
