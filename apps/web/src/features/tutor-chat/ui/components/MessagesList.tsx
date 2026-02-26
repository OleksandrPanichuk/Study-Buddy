import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton, cn } from "@repo/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MessageSquareIcon } from "lucide-react";
import { DEFAULT_MESSAGES_LIMIT, getInfiniteMessagesQueryOptions, useMessageStream } from "@/features/messages";
import { useInfiniteQueryRef } from "@/features/shared";
import { MessageItem } from "./MessageItem";

interface IMessagesListProps {
	tutorChatId: string;
}

export const MessagesList = ({ tutorChatId }: IMessagesListProps) => {
	const { data, fetchNextPage, isLoading, hasNextPage, isFetching } = useInfiniteQuery(
		getInfiniteMessagesQueryOptions({ limit: DEFAULT_MESSAGES_LIMIT, tutorChatId })
	);

	const ref = useInfiniteQueryRef({
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetching
	});

	const rawMessages = data?.pages.flatMap((page) => page.data) ?? [];
	const streamingAssistantMessageId = rawMessages.find(
		(message) => message.role === "ASSISTANT" && message.status === "PROCESSING"
	)?.id;


	useMessageStream({
		tutorChatId,
		assistantMessageId: streamingAssistantMessageId
	});

	const messages = [...rawMessages].reverse();

	return (
		<Conversation className="relative size-full">
			<ConversationContent className={cn("pb-4 max-w-4xl mx-auto w-full", messages.length === 0 && "h-full")}>
				{hasNextPage && !isFetching && <div ref={ref} />}

				{isFetching && !isLoading && (
					<div className="flex items-center justify-center py-4">
						<div className="w-8 h-8 border-2 border-gray-300 rounded-full animate-spin" />
					</div>
				)}

				{messages.length === 0 ? (
					<ConversationEmptyState
						description="Messages will appear here as the conversation progresses."
						icon={<MessageSquareIcon className="size-6" />}
						title="Start a conversation"
					/>
				) : (
					messages.map((message) => <MessageItem key={message.id} message={message} />)
				)}
			</ConversationContent>
			<ConversationScrollButton />
		</Conversation>
	);
};
