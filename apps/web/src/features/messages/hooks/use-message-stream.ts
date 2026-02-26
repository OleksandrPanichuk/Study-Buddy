import type { TFindAllMessagesResponse } from "@repo/schemas";
import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { DEFAULT_MESSAGES_LIMIT, MESSAGES_API_ROUTES, MESSAGES_QUERY_KEYS } from "@/features/messages";

const PROCESSING_PLACEHOLDER = "Response is being generated...";
const FAILED_MESSAGE = "Failed to generate response. Please try again.";

type TMessageStreamStatus = "STREAMING" | "COMPLETE" | "FAILED";

interface IMessageStreamEvent {
	messageId: string;
	content: string;
	status: TMessageStreamStatus;
	error?: string;
}

interface IUseMessageStreamProps {
	tutorChatId: string;
	assistantMessageId?: string;
}

const parseStreamPayload = (raw: string): IMessageStreamEvent | null => {
	try {
		return JSON.parse(raw) as IMessageStreamEvent;
	} catch {
		return null;
	}
};

export const useMessageStream = ({ tutorChatId, assistantMessageId }: IUseMessageStreamProps) => {
	const queryClient = useQueryClient();
	const streamedChunksMapRef = useRef(new Map<string, boolean>());

	useEffect(() => {
		if (!assistantMessageId) return;
		if (typeof window === "undefined") return;

		const streamUrl = `${window.location.origin}/api/${MESSAGES_API_ROUTES.stream(tutorChatId, assistantMessageId)}`;
		const eventSource = new EventSource(streamUrl, { withCredentials: true });

		const updateMessageInCache = (
			updater: (message: TFindAllMessagesResponse["data"][number]) => TFindAllMessagesResponse["data"][number]
		) => {
			queryClient.setQueriesData(
				{
					queryKey: MESSAGES_QUERY_KEYS.getAll({ tutorChatId, limit: DEFAULT_MESSAGES_LIMIT }),
					exact: false
				},
				(oldData) => {
					if (!oldData) return oldData;

					const oldInfiniteData = oldData as InfiniteData<TFindAllMessagesResponse>;

					return {
						...oldInfiniteData,
						pages: oldInfiniteData.pages.map((page) => ({
							...page,
							data: page.data.map((message) => (message.id === assistantMessageId ? updater(message) : message))
						}))
					} satisfies InfiniteData<TFindAllMessagesResponse>;
				}
			);
		};

		eventSource.onopen = () => {
			console.log("Connected to message stream");
		};

		eventSource.onerror = (error) => {
			console.error("Error in message stream", error);
			eventSource.close();
		};

		eventSource.onmessage = (event) => {
			console.log({ event });
			const payload = parseStreamPayload(event.data);
			if (!payload || payload.messageId !== assistantMessageId) return;

			if (payload.status === "STREAMING") {
				const hasAlreadyStreamedChunk = streamedChunksMapRef.current.get(assistantMessageId) ?? false;
				streamedChunksMapRef.current.set(assistantMessageId, true);

				updateMessageInCache((message) => ({
					...message,
					status: "PROCESSING",
					content:
						hasAlreadyStreamedChunk || message.content !== PROCESSING_PLACEHOLDER
							? `${message.content}${payload.content}`
							: payload.content
				}));
				return;
			}

			if (payload.status === "COMPLETE") {
				updateMessageInCache((message) => ({
					...message,
					status: "COMPLETE"
				}));
				streamedChunksMapRef.current.delete(assistantMessageId);
				eventSource.close();
				return;
			}

			if (payload.status === "FAILED") {
				updateMessageInCache((message) => ({
					...message,
					status: "FAILED",
					content: FAILED_MESSAGE
				}));
				streamedChunksMapRef.current.delete(assistantMessageId);
				eventSource.close();
			}
		};

		return () => {
			streamedChunksMapRef.current.delete(assistantMessageId);
			eventSource.close();
		};
	}, [assistantMessageId, queryClient, tutorChatId]);
};
