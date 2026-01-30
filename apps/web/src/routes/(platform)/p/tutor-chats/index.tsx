import {createFileRoute} from "@tanstack/react-router";
import {Suspense} from "react";
import {
	DEFAULT_TUTOR_CHATS_LIMIT,
	getInfiniteTutorChatsQueryOptions,
	TutorChatsView,
	TutorChatsViewSkeleton
} from "@/features/tutor-chats";

export const Route = createFileRoute("/(platform)/p/tutor-chats/")({
	component: RouteComponent,
	loader: ({ context }) => {
		void context.queryClient.prefetchInfiniteQuery(
			getInfiniteTutorChatsQueryOptions({ limit: DEFAULT_TUTOR_CHATS_LIMIT })
		);
	}
});

function RouteComponent() {
	return (
		<Suspense fallback={<TutorChatsViewSkeleton />}>
			<TutorChatsView />
		</Suspense>
	);
}
