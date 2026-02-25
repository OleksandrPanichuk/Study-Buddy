import type {TCreateMessageInput, TUploadFilesResponse} from "@repo/schemas";
import {PromptInputProvider} from "@repo/ui";
import {useMutation} from "@tanstack/react-query";
import {useCallback, useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {
	deleteFileAssetFn,
	getDeleteFileAssetMutationOptions,
	getUploadTutorChatFilesMutationOptions
} from "@/features/files";
import {getCreateMessageMutationOptions} from "@/features/messages";
import {PromptInputInner} from "@/features/tutor-chat";
import {tryCatch} from "@/lib";

interface IPromptInputProps {
	tutorChatId: string;
}

type UploadedFilesMap = Map<string, TUploadFilesResponse[number][]>;

export const PromptInput = ({ tutorChatId }: IPromptInputProps) => {
	const uploadedFilesRef = useRef<UploadedFilesMap>(new Map());

	const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
	const [uploadedFiles, setUploadedFiles] = useState<TUploadFilesResponse>([]);

	const { mutateAsync: createMessage } = useMutation(getCreateMessageMutationOptions());
	const { mutate: uploadFiles } = useMutation(getUploadTutorChatFilesMutationOptions(tutorChatId));
	const { mutate: deleteFile } = useMutation(getDeleteFileAssetMutationOptions());

	const deleteAllUploaded = useCallback(() => {
		const allAssets = Array.from(uploadedFilesRef.current.values()).flat();
		for (const asset of allAssets) {
			deleteFileAssetFn({ data: { fileAssetId: asset.id } });
		}
		uploadedFilesRef.current.clear();
	}, []);

	useEffect(() => {
		window.addEventListener("beforeunload", deleteAllUploaded);
		window.addEventListener("pagehide", deleteAllUploaded);
		return () => {
			window.removeEventListener("beforeunload", deleteAllUploaded);
			window.removeEventListener("pagehide", deleteAllUploaded);
		};
	}, [deleteAllUploaded]);

	const handleFilesAdded = useCallback(
		(items: Array<{ file: File; localId: string }>, removeLocal: (id: string) => void) => {
			const localIds = items.map((i) => i.localId);
			const files = items.map((i) => i.file);

			setUploadingIds((prev) => {
				const next = new Set(prev);
				for (const id of localIds) next.add(id);
				return next;
			});

			uploadFiles(files, {
				onSuccess: (uploaded) => {
					for (let i = 0; i < localIds.length; i++) {
						const localId = localIds[i];
						const asset = uploaded[i];
						if (!asset) continue;
						if (!localId) continue;
						const existing = uploadedFilesRef.current.get(localId) ?? [];
						uploadedFilesRef.current.set(localId, [...existing, asset]);
					}

					setUploadedFiles(Array.from(uploadedFilesRef.current.values()).flat());

					setUploadingIds((prev) => {
						const next = new Set(prev);
						for (const id of localIds) next.delete(id);
						return next;
					});
				},
				onError: (error) => {
					toast.error(error instanceof Error ? error.message : "Failed to upload file(s)");

					for (const id of localIds) removeLocal(id);

					setUploadingIds((prev) => {
						const next = new Set(prev);
						for (const id of localIds) next.delete(id);
						return next;
					});
				}
			});
		},
		[uploadFiles]
	);

	const handleFileRemoved = useCallback(
		(localId: string) => {
			const assets = uploadedFilesRef.current.get(localId);

			if (!assets?.length) return;

			uploadedFilesRef.current.delete(localId);

			setUploadedFiles(Array.from(uploadedFilesRef.current.values()).flat());

			for (const asset of assets) {
				deleteFile(asset.id, {
					onError: () => toast.error("Failed to delete file from storage")
				});
			}
		},
		[deleteFile]
	);

	const handleSubmit = useCallback(
		async (values: TCreateMessageInput) => {
			const [_, error] = await tryCatch(createMessage(values));

			if (error) {
				toast.error(error.message);
				return false;
			}

			return true;
		},
		[createMessage]
	);

	return (
		<PromptInputProvider onFilesAdded={handleFilesAdded} onFileRemoved={handleFileRemoved}>
			<PromptInputInner
				tutorChatId={tutorChatId}
				uploadingIds={uploadingIds}
				uploadedFiles={uploadedFiles}
				onSubmit={handleSubmit}
			/>
		</PromptInputProvider>
	);
};
