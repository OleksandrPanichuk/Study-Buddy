import type {
	TBulkDeleteTutorChatsInput,
	TFindAllTutorChatsInput,
	TFindAllTutorChatsResponse,
	TTutorChat
} from "@repo/schemas";
import {infiniteQueryOptions, mutationOptions, queryOptions} from "@tanstack/react-query";
import {bulkDeleteTutorChatsFn, getAllTutorChatsFn, TUTOR_CHATS_QUERY_KEYS} from "@/features/tutor-chats";
import {isInfiniteQuery} from "@/lib";

export const getTutorChatsQueryOptions = (data: Omit<TFindAllTutorChatsInput, "cursor" | "infinite">) =>
	queryOptions({
		queryFn: async () => (await getAllTutorChatsFn({ data: { ...data, infinite: false } })).data,
		queryKey: TUTOR_CHATS_QUERY_KEYS.findAll(data)
	});

export const getInfiniteTutorChatsQueryOptions = (data: Omit<TFindAllTutorChatsInput, "infinite">) =>
	infiniteQueryOptions({
		queryFn: ({ pageParam }) =>
			getAllTutorChatsFn({
				data: {
					...data,
					cursor: pageParam,
					infinite: true
				}
			}),
		queryKey: TUTOR_CHATS_QUERY_KEYS.findAllInfinite(data),
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		initialPageParam: data.cursor
	});

export const getBulkDeleteTutorChatsMutationOptions = () =>
	mutationOptions({
		mutationFn: (data: TBulkDeleteTutorChatsInput) => bulkDeleteTutorChatsFn({ data }),
		onSuccess: (_result, variables, _onMutationResult, { client }) => {
			client.setQueriesData(
				{
					queryKey: TUTOR_CHATS_QUERY_KEYS.findAll(),
					exact: false
				},
				(old: unknown) => {
					if (!old) return old;

					if (isInfiniteQuery<TFindAllTutorChatsResponse>(old)) {
						return {
							...old,
							pages: old.pages.map((page) => ({
								...page,
								data: page.data.filter((chat) => !variables.ids.includes(chat.id))
							}))
						};
					}

					return (old as TTutorChat[]).filter((el) => !variables.ids.includes(el.id));
				}
			);
		}
	});
