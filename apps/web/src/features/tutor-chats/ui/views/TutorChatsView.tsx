import {Button, Skeleton} from "@repo/ui";
import {useSuspenseInfiniteQuery} from "@tanstack/react-query";
import {MessageSquarePlusIcon} from "lucide-react";
import {MODALS, useInfiniteQueryRef, useModal} from "@/features/shared";
import {
	DEFAULT_TUTOR_CHATS_LIMIT,
	EmptyChatsState,
	getInfiniteTutorChatsQueryOptions,
	TutorChatCard
} from "@/features/tutor-chats";

export const TutorChatsView = () => {
	const { open } = useModal(MODALS.CREATE_TUTOR_CHAT);
	const { data, hasNextPage, fetchNextPage, isLoading, isFetching } = useSuspenseInfiniteQuery(
		getInfiniteTutorChatsQueryOptions({ limit: DEFAULT_TUTOR_CHATS_LIMIT })
	);

	const ref = useInfiniteQueryRef({
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetching
	});

	const chats = data?.pages?.flatMap((p) => p.data) ?? [];

	if (chats.length === 0) {
		return <EmptyChatsState />;
	}

	return (
		<div className="p-4 sm:p-6 space-y-6">
			<div className="relative overflow-hidden rounded-2xl border bg-card/70 p-5 sm:p-6 shadow-sm">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_60%)]" />
				<div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-1">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
							Tutor Chats
						</p>
						<h2 className="text-xl font-semibold text-foreground">Your ongoing conversations</h2>
						<p className="text-sm text-muted-foreground">
							{chats.length} conversation{chats.length !== 1 ? "s" : ""} in progress
						</p>
					</div>
					<Button variant="outline" size="sm" className="gap-2 self-start sm:self-auto" onClick={open}>
						<MessageSquarePlusIcon className="size-4" />
						New Chat
					</Button>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{chats.map((item) => (
					<TutorChatCard key={item.id} data={item} />
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
