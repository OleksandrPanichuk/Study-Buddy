import { mutationOptions } from "@tanstack/react-query";
import { deleteFileAssetFn, uploadTutorChatFilesFn } from "./functions";

export const getUploadTutorChatFilesMutationOptions = (tutorChatId: string) =>
	mutationOptions({
		mutationFn: (files: File[]) => uploadTutorChatFilesFn(tutorChatId, files),
	});

export const getDeleteFileAssetMutationOptions = () =>
	mutationOptions({
		mutationFn: (fileAssetId: string) =>
			deleteFileAssetFn({
				data: {
					fileAssetId,
				},
			}),
	});
