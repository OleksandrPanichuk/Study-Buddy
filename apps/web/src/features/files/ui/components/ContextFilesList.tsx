import {Button, Spinner} from "@repo/ui";
import {CheckCircle2Icon, FileIcon, FileTextIcon, PencilIcon, Trash2Icon, XIcon} from "lucide-react";
import {useState} from "react";
import type {ContextFile} from "@/features/files";
import {useConfirm} from "@/features/shared";

interface ContextFilesListProps {
	files: ContextFile[];
	removingIds: Set<string>;
	updatingIds: Set<string>;
	onRemove: (file: ContextFile) => void;
	onUpdate: (file: ContextFile, data: {note: string | null; priority: number}) => void;
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileMeta(mimeType: string): {
	icon: typeof FileIcon;
	color: string;
	bg: string;
	label: string;
} {
	switch (mimeType) {
		case "application/pdf":
			return {icon: FileTextIcon, color: "text-red-500", bg: "bg-red-500/10", label: "PDF"};
		case "application/msword":
			return {icon: FileTextIcon, color: "text-blue-500", bg: "bg-blue-500/10", label: "DOC"};
		case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
			return {icon: FileTextIcon, color: "text-blue-500", bg: "bg-blue-500/10", label: "DOCX"};
		case "text/markdown":
			return {icon: FileTextIcon, color: "text-purple-500", bg: "bg-purple-500/10", label: "MD"};
		default:
			return {icon: FileIcon, color: "text-muted-foreground", bg: "bg-muted", label: "TXT"};
	}
}

interface EditState {
	note: string;
	priority: string;
}

export const ContextFilesList = ({files, removingIds, updatingIds, onRemove, onUpdate}: ContextFilesListProps) => {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editState, setEditState] = useState<EditState>({note: "", priority: "0"});
	const [ConfirmDialog, confirm] = useConfirm({
		title: "Delete file?",
		message: "This will permanently remove the file from this tutor chat's context. This action cannot be undone."
	});

	const openEdit = (file: ContextFile) => {
		setEditingId(file.id);
		setEditState({note: file.note ?? "", priority: String(file.priority)});
	};

	const cancelEdit = () => setEditingId(null);

	const saveEdit = (file: ContextFile) => {
		const priority = Number.parseInt(editState.priority, 10);
		onUpdate(file, {
			note: editState.note.trim() || null,
			priority: Number.isNaN(priority) ? file.priority : priority
		});
		setEditingId(null);
	};

	const handleRemove = async (file: ContextFile) => {
		const ok = await confirm();
		if (ok) onRemove(file);
	};

	if (files.length === 0) return null;

	return (
		<>
			<div className="space-y-2">
			<div className="flex items-center justify-between">
				<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uploaded files</p>
				<span className="rounded-full border bg-muted/50 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
					{files.length}
				</span>
			</div>

			<div className="overflow-hidden rounded-2xl border bg-muted/10">
				{files.map((file, i) => {
					const {icon: Icon, color, bg, label} = getFileMeta(file.mimeType);
					const isRemoving = removingIds.has(file.id);
					const isUpdating = updatingIds.has(file.id);
					const isEditing = editingId === file.id;

					return (
						<div key={file.id} className={i !== 0 ? "border-t" : ""}>
							<div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30">
								<div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
									<Icon className={`size-4 ${color}`} />
								</div>

								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium leading-tight">{file.name}</p>
									<div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
										<span className="text-[10px] font-bold uppercase text-muted-foreground">{label}</span>
										<span className="text-[10px] text-muted-foreground/60">·</span>
										<span className="text-[10px] text-muted-foreground">{formatBytes(file.sizeBytes)}</span>
										{file.priority > 0 && (
											<>
												<span className="text-[10px] text-muted-foreground/60">·</span>
												<span className="text-[10px] text-muted-foreground">Priority {file.priority}</span>
											</>
										)}
										{file.note && (
											<>
												<span className="text-[10px] text-muted-foreground/60">·</span>
												<span className="max-w-[160px] truncate text-[10px] italic text-muted-foreground">{file.note}</span>
											</>
										)}
									</div>
								</div>

								<div className="flex shrink-0 items-center gap-2">
									<div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5">
										<CheckCircle2Icon className="size-3 text-emerald-500" />
										<span className="text-[10px] font-semibold text-emerald-600">Ready</span>
									</div>

									<Button
										variant="ghost"
										size="icon-sm"
										disabled={isRemoving || isUpdating}
										onClick={() => (isEditing ? cancelEdit() : openEdit(file))}
										className="size-7 text-muted-foreground hover:text-foreground"
									>
										{isEditing ? <XIcon className="size-3.5" /> : <PencilIcon className="size-3.5" />}
									</Button>

									<Button
										variant="ghost"
										size="icon-sm"
										disabled={isRemoving || isEditing}
										onClick={() => handleRemove(file)}
										className="size-7 text-muted-foreground hover:text-destructive"
									>
										{isRemoving ? <Spinner className="size-3.5" /> : <Trash2Icon className="size-3.5" />}
									</Button>
								</div>
							</div>

							{isEditing && (
								<div className="border-t border-primary/10 bg-primary/2.5 px-4 py-2.5">
									<div className="flex items-center gap-2">
										<textarea
											value={editState.note}
											onChange={(e) => setEditState((s) => ({...s, note: e.target.value}))}
											placeholder="Add a note…"
											rows={1}
											className="flex-1 resize-none rounded-md border border-border/60 bg-background/80 px-2.5 py-1.5 text-xs leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring/60 transition-colors"
										/>

										<div className="flex shrink-0 items-center gap-0.5">
											<span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
												Pri
											</span>
											<button
												type="button"
												onClick={() =>
													setEditState((s) => ({...s, priority: String(Math.max(0, Number(s.priority) - 1))}))
												}
												className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
											>
												<span className="text-sm leading-none">−</span>
											</button>
											<span className="w-5 text-center text-xs font-semibold tabular-nums">{editState.priority}</span>
											<button
												type="button"
												onClick={() =>
													setEditState((s) => ({...s, priority: String(Number(s.priority) + 1)}))
												}
												className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
											>
												<span className="text-sm leading-none">+</span>
											</button>
										</div>

										<div className="flex shrink-0 items-center gap-1">
											<Button
												size="sm"
												disabled={isUpdating}
												onClick={() => saveEdit(file)}
												className="h-6 px-2.5 text-[11px] font-semibold"
											>
												{isUpdating ? <Spinner className="mr-1 size-2.5" /> : null}
												Save
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={cancelEdit}
												className="h-6 px-2 text-[11px] text-muted-foreground"
											>
												Cancel
											</Button>
										</div>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
		<ConfirmDialog />
		</>
	);
};
