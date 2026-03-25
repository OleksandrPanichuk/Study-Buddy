import {mutationOptions} from "@tanstack/react-query";
import {deleteFileAssetFn, uploadTutorChatFilesFn} from "./functions.ts";

export const getUploadTutorChatFilesMutationOptions = (tutorChatId: string) =>
	mutationOptions({
		mutationFn: (files: File[]) => {
			const formData = new FormData();
			formData.append("tutorChatId", tutorChatId);
			for (const file of files) formData.append("files", file);
			return uploadTutorChatFilesFn({ data: formData });
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
