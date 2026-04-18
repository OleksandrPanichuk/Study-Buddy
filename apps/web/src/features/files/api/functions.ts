import {type TGetContextFilesResponse, type TUpdateContextFileInput, type TUpdateContextFileResponse, type TUploadContextFileResponse, updateContextFileInputSchema, uploadContextFileInputSchema, uploadFilesInputSchema} from "@repo/schemas";
import {deleteFileAssetInputSchema, type TDeleteFileAssetInput, type TUploadFilesResponse} from "@repo/schemas/files";
import {createServerFn} from "@tanstack/react-start";
import {z} from "zod";
import {FILES_API_ROUTES} from "@/features/files";
import {fetcher} from "@/lib/fetcher.ts";

export const getContextFilesFn = createServerFn({ method: "GET" })
	.inputValidator((data: { tutorChatId: string }) => z.object({ tutorChatId: z.string().uuid() }).parse(data))
	.handler(async ({ data }) => {
		return fetcher.get(FILES_API_ROUTES.getContext(data.tutorChatId)).json<TGetContextFilesResponse>();
	});

export const uploadTutorChatFilesFn = createServerFn({ method: "POST" })
	.inputValidator((data: FormData) => uploadFilesInputSchema.parse(data))
	.handler(async ({ data }) => {
		const formData = new FormData();
		for (const file of data.files) formData.append("files", file);
		return fetcher
			.post(FILES_API_ROUTES.uploadTutorChat(data.tutorChatId as string), { body: formData })
			.json<TUploadFilesResponse>();
	});

export const uploadContextFileFn = createServerFn({ method: "POST" })
	.inputValidator((data: FormData) => uploadContextFileInputSchema.parse(data))
	.handler(async ({ data }) => {
		const formData = new FormData();
		formData.append("file", data.file);
		formData.append("tutorChatId", data.tutorChatId);
		formData.append("priority", String(data.priority));
		if (data.note) formData.append("note", data.note);

		return fetcher
			.post(FILES_API_ROUTES.uploadContext(data.tutorChatId), { body: formData })
			.json<TUploadContextFileResponse>();
	});

export const updateContextFileFn = createServerFn({ method: "POST" })
	.inputValidator((data: TUpdateContextFileInput) => updateContextFileInputSchema.parse(data))
	.handler(async ({ data }) => {
		return fetcher
			.patch(FILES_API_ROUTES.updateContext(data.contextFileId), {
				json: { note: data.note, priority: data.priority }
			})
			.json<TUpdateContextFileResponse>();
	});

export const deleteFileAssetFn = createServerFn({ method: "POST" })
	.inputValidator((data: TDeleteFileAssetInput) => deleteFileAssetInputSchema.parse(data))
	.handler(async ({ data }) => {
		await fetcher.delete(FILES_API_ROUTES.delete(data.fileAssetId));
	});
