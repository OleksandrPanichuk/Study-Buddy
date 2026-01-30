import type {
	TCreateTutorChatInput,
	TFindAllTutorChatsInput,
	TFindAllTutorChatsResponse,
	TTutorChat
} from "@repo/schemas";
import {infiniteQueryOptions, mutationOptions, queryOptions} from "@tanstack/react-query";
import {createTutorChatFn, getAllTutorChatsFn, TUTOR_CHATS_QUERY_KEYS} from "@/features/tutor-chats";
import {isInfiniteQuery} from "@/lib";

export const getTutorChatsQueryOptions = (data: Omit<TFindAllTutorChatsInput, "cursor">) =>
	queryOptions({
		queryFn: async () => (await getAllTutorChatsFn({ data })).data,
		queryKey: TUTOR_CHATS_QUERY_KEYS.findAll(data)
	});

export const getInfiniteTutorChatsQueryOptions = (data: TFindAllTutorChatsInput) =>
	infiniteQueryOptions({
		queryFn: () => getAllTutorChatsFn({ data }),
		queryKey: TUTOR_CHATS_QUERY_KEYS.findAll(data),
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		initialPageParam: data.cursor
	});

export const getCreateTutorChatMutationOptions = () =>
	mutationOptions({
		mutationFn: (data: TCreateTutorChatInput) => createTutorChatFn({ data }),
		onSuccess: (tutorChat, _variables, _onMutationResult, { client }) => {
			client.setQueriesData(
				{
					queryKey: TUTOR_CHATS_QUERY_KEYS.findAll(),
					exact: false
				},
				(old) => {
					if (!old) return old;

					if (isInfiniteQuery<TFindAllTutorChatsResponse>(old)) {
						const firstPage = old.pages?.[0];

						if (!(firstPage && Array.isArray(firstPage.data))) return old;

						return {
							...old,
							pages: [
								{
									...firstPage,
									data: [tutorChat, ...firstPage.data]
								},
								...old.pages.slice(1)
							]
						};
					}

					return [tutorChat, ...(old as TTutorChat[])];
				}
			);
		}
	});
