import {Button, Checkbox, Skeleton} from "@repo/ui";
import {useMutation, useSuspenseInfiniteQuery} from "@tanstack/react-query";
import {CheckSquareIcon, MessageSquarePlusIcon, Trash2Icon, XIcon} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";
import {MODALS, useConfirm, useInfiniteQueryRef, useModal} from "@/features/shared";
import {
	DEFAULT_TUTOR_CHATS_LIMIT,
	EmptyChatsState,
	getBulkDeleteTutorChatsMutationOptions,
	getInfiniteTutorChatsQueryOptions,
	TutorChatCard
} from "@/features/tutor-chats";

export const TutorChatsView = () => {
	const { open } = useModal(MODALS.CREATE_TUTOR_CHAT);
	const [isBulkMode, setIsBulkMode] = useState(false);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [ConfirmationModal, confirm] = useConfirm({
		title: "Delete multiple chats?",
		message: `Are you sure you want to delete ${selectedIds.length} selected chat(s)? This action cannot be undone.`
	});

	const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useSuspenseInfiniteQuery(
		getInfiniteTutorChatsQueryOptions({ limit: DEFAULT_TUTOR_CHATS_LIMIT })
	);

	const { mutate: bulkDelete } = useMutation(getBulkDeleteTutorChatsMutationOptions());

	const ref = useInfiniteQueryRef({
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetching
	});

	const chats = data?.pages?.flatMap((p) => p.data) ?? [];

	const toggleBulkMode = () => {
		setIsBulkMode(!isBulkMode);
		setSelectedIds([]);
	};

	const toggleSelection = (id: string) => {
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
	};

	const toggleSelectAll = () => {
		if (selectedIds.length === chats.length) {
			setSelectedIds([]);
		} else {
			setSelectedIds(chats.map((c) => c.id));
		}
	};

	const handleDeleteSelected = async () => {
		if (selectedIds.length === 0) return;

		const ok = await confirm();
		if (!ok) return;

		bulkDelete(
			{ ids: selectedIds },
			{
				onSuccess: () => {
					toast.success("Chats deleted successfully");
					setSelectedIds([]);
					setIsBulkMode(false);
				},
				onError: (error) => {
					if (error instanceof Error) toast.error(error.message);
				}
			}
		);
	};

	if (chats.length === 0) {
		return <EmptyChatsState />;
	}

	return (
		<div className="p-4 sm:p-6 space-y-6">
			<ConfirmationModal />
			<div className="relative overflow-hidden rounded-2xl border bg-card/70 p-5 sm:p-6 shadow-sm">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_60%)]" />
				<div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-1">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Tutor Chats</p>
						<h2 className="text-xl font-semibold text-foreground">Your ongoing conversations</h2>
						<p className="text-sm text-muted-foreground">
							{chats.length} conversation{chats.length !== 1 ? "s" : ""} in progress
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Button variant={isBulkMode ? "secondary" : "outline"} size="sm" className="gap-2" onClick={toggleBulkMode}>
							{isBulkMode ? (
								<>
									<XIcon className="size-4" />
									Cancel
								</>
							) : (
								<>
									<CheckSquareIcon className="size-4" />
									Bulk Actions
								</>
							)}
						</Button>
						<Button variant="outline" size="sm" className="gap-2" onClick={open}>
							<MessageSquarePlusIcon className="size-4" />
							New Chat
						</Button>
					</div>
				</div>
			</div>

			{isBulkMode && (
				<div className="flex flex-col gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-3">
						<Checkbox
							id="select-all"
							checked={selectedIds.length === chats.length && chats.length > 0}
							onCheckedChange={toggleSelectAll}
						/>
						<label
							htmlFor="select-all"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Select All ({selectedIds.length} selected)
						</label>
					</div>
					<Button
						variant="destructive"
						size="sm"
						className="gap-2"
						disabled={selectedIds.length === 0}
						onClick={handleDeleteSelected}>
						<Trash2Icon className="size-4" />
						Delete Selected
					</Button>
				</div>
			)}

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{chats.map((item) => (
					<TutorChatCard
						key={item.id}
						data={item}
						isBulkMode={isBulkMode}
						isSelected={selectedIds.includes(item.id)}
						onToggleSelection={toggleSelection}
					/>
				))}
			</div>
			{hasNextPage && <div ref={ref} />}
		</div>
	);
};

export const TutorChatsViewSkeleton = () => {
	return (
		<div className="p-4 sm:p-6 space-y-6">
			<Skeleton className="h-28 w-full rounded-2xl" />
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				<Skeleton className="h-40 w-full rounded-2xl" />
				<Skeleton className="h-40 w-full rounded-2xl" />
				<Skeleton className="h-40 w-full rounded-2xl" />
			</div>
		</div>
	);
};
