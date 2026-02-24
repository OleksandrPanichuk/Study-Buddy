import {AI_DEFAULT_MODEL, type AIModels, ALLOWED_MIME_TYPES, MAX_FILE_SIZE} from "@repo/constants";
import {createMessageInputSchema, type  TCreateMessageInput} from "@repo/schemas";
import type {TUploadFilesResponse} from "@repo/schemas/files";
import {
	PromptInput as PromptInputBase,
	PromptInputActionAddAttachments,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputBody,
	PromptInputFooter,
	PromptInputProvider,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputTools,
	usePromptInputController
} from "@repo/ui";
import {useForm} from "@tanstack/react-form";
import {useMutation} from "@tanstack/react-query";
import {useCallback, useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {ModelSelect, PromptInputAttachmentsPreview} from "@/features/tutor-chat";
import {
	deleteFileAssetFn,
	getDeleteFileAssetMutationOptions,
	getUploadTutorChatFilesMutationOptions
} from "@/features/tutor-chat/api";

interface IPromptInputProps {
	tutorChatId: string;
}

type UploadedFilesMap = Map<string, TUploadFilesResponse[number][]>;

interface PromptInputInnerProps extends IPromptInputProps {
	uploadingIds: Set<string>;
	uploadedFiles: TUploadFilesResponse;
}

const PromptInputInner = ({ uploadingIds, uploadedFiles }: PromptInputInnerProps) => {
	const controller = usePromptInputController();

	const form = useForm({
		validators: { onSubmit: createMessageInputSchema },
		defaultValues: {
			content: "",
			model: AI_DEFAULT_MODEL,
			files: undefined
		} as TCreateMessageInput,
		onSubmit: async ({ value }) => {
			controller.textInput.clear();
			console.log({ value });
		}
	});

	useEffect(() => {
		form.setFieldValue("files", uploadedFiles.length > 0 ? uploadedFiles : undefined);
	}, [uploadedFiles, form]);

	return (
		<PromptInputBase
			accept={ALLOWED_MIME_TYPES.join(",")}
			maxFileSize={MAX_FILE_SIZE}
			onError={(error) => toast.error(error.message)}
			onSubmit={form.handleSubmit}>
			<PromptInputAttachmentsPreview uploadingIds={uploadingIds} />

			<PromptInputBody>
				<form.Field name="content">
					{(field) => (
						<PromptInputTextarea
							placeholder="Ask your study buddy anything…"
							value={field.state.value}
							onChange={(e) => {
								field.handleChange(e.target.value);
								controller.textInput.setInput(e.target.value);
							}}
						/>
					)}
				</form.Field>
			</PromptInputBody>

			<PromptInputFooter>
				<PromptInputTools>
					<PromptInputActionMenu>
						<PromptInputActionMenuTrigger />
						<PromptInputActionMenuContent>
							<PromptInputActionAddAttachments />
						</PromptInputActionMenuContent>
					</PromptInputActionMenu>

					<form.Field name="model">
						{(field) => (
							<ModelSelect
								value={field.state.value as AIModels | undefined}
								onChange={(val) => field.handleChange(val)}
							/>
						)}
					</form.Field>
				</PromptInputTools>

				<PromptInputSubmit />
			</PromptInputFooter>
		</PromptInputBase>
	);
};

export const PromptInput = ({ tutorChatId }: IPromptInputProps) => {
	const uploadedFilesRef = useRef<UploadedFilesMap>(new Map());

	const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
	const [uploadedFiles, setUploadedFiles] = useState<TUploadFilesResponse>([]);

	const uploadMutation = useMutation(getUploadTutorChatFilesMutationOptions(tutorChatId));
	const deleteMutation = useMutation(getDeleteFileAssetMutationOptions());

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

			uploadMutation.mutate(files, {
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
		[uploadMutation]
	);

	const handleFileRemoved = useCallback(
		(localId: string) => {
			const assets = uploadedFilesRef.current.get(localId);

			if (!assets?.length) return;

			uploadedFilesRef.current.delete(localId);

			setUploadedFiles(Array.from(uploadedFilesRef.current.values()).flat());

			for (const asset of assets) {
				deleteMutation.mutate(asset.id, {
					onError: () => toast.error("Failed to delete file from storage")
				});
			}
		},
		[deleteMutation]
	);

	return (
		<PromptInputProvider onFilesAdded={handleFilesAdded} onFileRemoved={handleFileRemoved}>
			<PromptInputInner tutorChatId={tutorChatId} uploadingIds={uploadingIds} uploadedFiles={uploadedFiles} />
		</PromptInputProvider>
	);
};
