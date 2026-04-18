import {ALLOWED_MIME_TYPES, MAX_FILE_SIZE} from "@repo/constants";
import type {TTutorChat} from "@repo/schemas";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Spinner
} from "@repo/ui";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {AlertCircleIcon, CheckCircle2Icon, Files, PaperclipIcon, UploadCloudIcon} from "lucide-react";
import {type DragEvent, useCallback, useRef, useState} from "react";
import {toast} from "sonner";
import {
	type ContextFile,
	getContextFilesQueryOptions,
	getDeleteFileAssetMutationOptions,
	getUpdateContextFileMutationOptions,
	getUploadContextFileMutationOptions
} from "@/features/files";
import {MODALS, useModal} from "@/features/shared";
import {ContextFilesList} from "./ContextFilesList";

export interface IContextFilesModalData {
	data: TTutorChat;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This component is complex due to the various states and interactions involved in file uploading, drag-and-drop handling, and error management. Refactoring it into smaller components or custom hooks could help reduce complexity, but for now, it's structured this way to keep related logic together.
export const ContextFilesModal = () => {
	const {isOpen, state, close} = useModal(MODALS.CONTEXT_FILES);
	const [isDragging, setIsDragging] = useState(false);
	const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
	const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
	const fileInputRef = useRef<HTMLInputElement>(null);
	const queryClient = useQueryClient();

	const tutorChat = state?.data;
	const tutorChatId = tutorChat?.id ?? "";

	const {data: files = []} = useQuery({
		...getContextFilesQueryOptions(tutorChatId),
		enabled: isOpen && !!tutorChatId
	});

	const {mutate: upload, isPending: isUploading} = useMutation(
		getUploadContextFileMutationOptions(tutorChatId, queryClient)
	);

	const {mutate: deleteFile} = useMutation(getDeleteFileAssetMutationOptions());
	const {mutate: updateFile} = useMutation(getUpdateContextFileMutationOptions(queryClient));

	const handleClose = () => {
		setRemovingIds(new Set());
		setUpdatingIds(new Set());
		close();
	};

	const validateAndUpload = useCallback(
		(filesToUpload: File[]) => {
			const valid: File[] = [];
			const errors: string[] = [];

			for (const file of filesToUpload) {
				if (!ALLOWED_MIME_TYPES.includes(file.type)) {
					errors.push(`"${file.name}" has an unsupported format`);
				} else if (file.size > MAX_FILE_SIZE) {
					errors.push(`"${file.name}" exceeds the 100 MB limit`);
				} else {
					valid.push(file);
				}
			}

			for (const err of errors) toast.error(err);
			if (!valid.length) return;

			upload(valid, {
				onSuccess: (newFiles) => {
					toast.success(
						newFiles.length === 1 ? `"${newFiles[0]?.name}" uploaded successfully` : `${newFiles.length} files uploaded`
					);
				},
				onError: () => toast.error("Upload failed. Please try again.")
			});
		},
		[upload]
	);

	const handleRemove = (file: ContextFile) => {
		setRemovingIds((prev) => new Set(prev).add(file.id));
		deleteFile(file.id, {
			onSuccess: () => {
				queryClient.setQueryData(getContextFilesQueryOptions(tutorChatId).queryKey, (prev) =>
					prev?.filter((f) => f.id !== file.id)
				);
				setRemovingIds((prev) => {
					const next = new Set(prev);
					next.delete(file.id);
					return next;
				});
			},
			onError: () => {
				setRemovingIds((prev) => {
					const next = new Set(prev);
					next.delete(file.id);
					return next;
				});
				toast.error("Failed to remove file. Please try again.");
			}
		});
	};

	const handleUpdate = (file: ContextFile, data: {note: string | null; priority: number}) => {
		setUpdatingIds((prev) => new Set(prev).add(file.id));
		updateFile(
			{contextFileId: file.contextFileId, note: data.note, priority: data.priority},
			{
				onSuccess: () => {
					setUpdatingIds((prev) => {
						const next = new Set(prev);
						next.delete(file.id);
						return next;
					});
					toast.success("File updated");
				},
				onError: () => {
					setUpdatingIds((prev) => {
						const next = new Set(prev);
						next.delete(file.id);
						return next;
					});
					toast.error("Failed to update file. Please try again.");
				}
			}
		);
	};

	const onDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const onDragLeave = useCallback((e: React.DragEvent) => {
		if (!e.currentTarget.contains(e.relatedTarget as Node)) {
			setIsDragging(false);
		}
	}, []);

	const onDrop = useCallback(
		(e: DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			validateAndUpload(Array.from(e.dataTransfer.files));
		},
		[validateAndUpload]
	);

	if (!state) return null;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-2xl">
				{/* Header */}
				<div className="relative border-b px-6 py-5 sm:px-8">
					<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_10%_0%,rgba(168,85,247,0.08),transparent_60%),radial-gradient(50%_50%_at_90%_0%,rgba(59,130,246,0.07),transparent_55%)]" />
					<DialogHeader className="relative text-left">
						<div className="flex items-center gap-4">
							<div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border bg-background/80 shadow-sm">
								<PaperclipIcon className="size-5 text-foreground" />
							</div>
							<div className="min-w-0 space-y-0.5">
								<DialogTitle className="text-lg font-bold sm:text-xl">Context Files</DialogTitle>
								<DialogDescription className="text-sm">
									Uploaded files are embedded and used as knowledge for{" "}
									<span className="font-medium text-foreground">{tutorChat?.name}</span>
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>
				</div>

				{/* Content */}
				<div className="flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
					{/* Drop zone */}
					<div
						onDragOver={onDragOver}
						onDragLeave={onDragLeave}
						onDrop={onDrop}
						onClick={() => !isUploading && fileInputRef.current?.click()}
						className={[
							"relative flex cursor-pointer select-none flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all",
							isDragging
								? "border-primary/60 bg-primary/5"
								: isUploading
									? "cursor-default border-muted bg-muted/20"
									: "border-muted-foreground/20 bg-muted/20 hover:border-primary/40 hover:bg-primary/5"
						].join(" ")}>
						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept={ALLOWED_MIME_TYPES.join(",")}
							className="sr-only"
							onChange={(e) => {
								validateAndUpload(Array.from(e.target.files ?? []));
								e.target.value = "";
							}}
						/>

						{isUploading ? (
							<>
								<div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
									<Spinner className="size-5 text-primary" />
								</div>
								<div className="space-y-1">
									<p className="text-sm font-semibold">Uploading…</p>
									<p className="text-xs text-muted-foreground">Processing your files</p>
								</div>
							</>
						) : (
							<>
								<div
									className={[
										"flex size-12 items-center justify-center rounded-2xl transition-colors",
										isDragging ? "bg-primary/15" : "bg-muted"
									].join(" ")}>
									<UploadCloudIcon
										className={["size-6 transition-colors", isDragging ? "text-primary" : "text-muted-foreground"].join(
											" "
										)}
									/>
								</div>
								<div className="space-y-1">
									<p className="text-sm font-semibold">
										{isDragging ? "Drop to upload" : "Drag & drop or click to browse"}
									</p>
									<p className="text-xs text-muted-foreground">PDF, DOCX, TXT, MD — up to 100 MB each</p>
								</div>
								{files.length > 0 && (
									<div className="mt-1 flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
										<Files className="size-3" />
										<span>Add more files</span>
									</div>
								)}
							</>
						)}
					</div>

					{/* File list */}
					<ContextFilesList
						files={files}
						removingIds={removingIds}
						updatingIds={updatingIds}
						onRemove={handleRemove}
						onUpdate={handleUpdate}
					/>

					{/* Empty state tip */}
					{files.length === 0 && !isUploading && (
						<div className="rounded-xl border bg-muted/20 px-4 py-3">
							<div className="flex items-start gap-3">
								<AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
								<p className="text-xs leading-relaxed text-muted-foreground">
									Context files are parsed and embedded as knowledge for this tutor chat. The AI will automatically draw
									from them when answering your questions.
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				<DialogFooter className="border-t bg-muted/30 px-6 py-4 sm:px-8">
					<div className="flex w-full items-center justify-between">
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							{files.length > 0 && (
								<>
									<CheckCircle2Icon className="size-3.5 text-emerald-500" />
									<span>
										{files.length} file
										{files.length !== 1 ? "s" : ""} added to context
									</span>
								</>
							)}
						</div>
						<Button type="button" onClick={handleClose} className="h-9 px-5 text-sm font-semibold">
							Done
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
