import {
	deleteFileAssetInputSchema,
	type TDeleteFileAssetInput,
} from "@repo/schemas/files";
import { createServerFn } from "@tanstack/react-start";
import { FILES_API_ROUTES } from "@/features/files";
import { fetcher } from "@/lib/fetcher";

export type TUploadedFileResult = {
	id: string;
	jobId: string | undefined;
	url: string;
	key: string | null;
};

export async function uploadTutorChatFilesFn(
	tutorChatId: string,
	files: File[],
) {
	const formData = new FormData();

	for (const file of files) {
		formData.append("files", file);
	}

	return fetcher
		.post(FILES_API_ROUTES.uploadTutorChat(tutorChatId), {
			body: formData,
		})
		.json<TUploadedFileResult[]>();
}

export const deleteFileAssetFn = createServerFn({ method: "POST" })
	.inputValidator((data: TDeleteFileAssetInput) =>
		deleteFileAssetInputSchema.parse(data),
	)
	.handler(async ({ data }) => {
		await fetcher.delete(FILES_API_ROUTES.delete(data.fileAssetId));
	});
