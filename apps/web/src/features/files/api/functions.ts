import {uploadFilesInputSchema} from "@repo/schemas";
import {deleteFileAssetInputSchema, type TDeleteFileAssetInput, type TUploadFilesResponse} from "@repo/schemas/files";
import {createServerFn} from "@tanstack/react-start";
import {FILES_API_ROUTES} from "@/features/files";
import {fetcher} from "@/lib/fetcher.ts";

export const uploadTutorChatFilesFn = createServerFn({ method: "POST" })
	.inputValidator((data: FormData) =>
		uploadFilesInputSchema.refine((formData) => formData.get("tutorChatId") !== null).parse(data)
	)
	.handler(async ({ data }) => {
		return fetcher
			.post(FILES_API_ROUTES.uploadTutorChat(data.get("tutorChatId") as string), { body: data })
			.json<TUploadFilesResponse>();
	});

export const deleteFileAssetFn = createServerFn({ method: "POST" })
	.inputValidator((data: TDeleteFileAssetInput) => deleteFileAssetInputSchema.parse(data))
	.handler(async ({ data }) => {
		await fetcher.delete(FILES_API_ROUTES.delete(data.fileAssetId));
	});
