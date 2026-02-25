import type { TCreateMessageInput, TFindAllMessagesInput, TFindAllMessagesResponse } from "@repo/schemas";
import { type InfiniteData, infiniteQueryOptions, mutationOptions } from "@tanstack/react-query";
import { createMessageFn, DEFAULT_MESSAGES_LIMIT, getAllMessagesFn, MESSAGES_QUERY_KEYS } from "@/features/messages";

export const getInfiniteMessagesQueryOptions = (data: TFindAllMessagesInput) =>
	infiniteQueryOptions({
		queryKey: MESSAGES_QUERY_KEYS.getAll(data),
		queryFn: async ({ pageParam }) => getAllMessagesFn({ data: { ...data, cursor: pageParam } }),
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		initialPageParam: data.cursor
	});

export const getCreateMessageMutationOptions = () =>
	mutationOptions({
		mutationFn: (data: TCreateMessageInput) => createMessageFn({ data }),
		onSuccess: (response, variables, _onMutationResult, { client }) => {
			client.setQueriesData(
				{
					queryKey: MESSAGES_QUERY_KEYS.getAll({ tutorChatId: variables.tutorChatId, limit: DEFAULT_MESSAGES_LIMIT }),
					exact: false
				},
				(old) => {
					if (!old) return old;

					const oldData = old as InfiniteData<TFindAllMessagesResponse>;

					if (!oldData.pages.length) return old;

					const firstPage = oldData.pages[0];

					if (!firstPage) return old;

					const newMessages = [response.assistantMessage, response.userMessage, ...firstPage.data];

					return {
						...oldData,
						pages: [
							{
								...firstPage,
								data: newMessages
							},
							...oldData.pages.slice(1)
						]
					} satisfies InfiniteData<TFindAllMessagesResponse>;
				}
			);
		}
	});
