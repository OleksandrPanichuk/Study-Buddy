import { DEFAULT_MESSAGES_LIMIT, getInfiniteMessagesQueryOptions } from "@/features/messages";
import { useInfiniteQueryRef } from "@/features/shared";
import {
	cn,
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
	Message,
	MessageContent,
	MessageResponse
} from "@repo/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MessageSquareIcon } from "lucide-react";

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

	const messages = data?.pages.flatMap((page) => page.data).reverse() ?? [];

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
					messages.map((message) => {
						const isAssistant = message.role === "ASSISTANT";

						return (
							<Message from={isAssistant ? "assistant" : "user"} key={message.id}>
								<MessageContent>
									{isAssistant ? <MessageResponse>{message.content}</MessageResponse> : message.content}
								</MessageContent>
							</Message>
						);
					})
				)}
			</ConversationContent>
			<ConversationScrollButton />
		</Conversation>
	);
};
