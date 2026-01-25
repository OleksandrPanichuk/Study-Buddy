import type {TCreateTutorChatInput, TFindAllTutorChatsInput, TFindAllTutorChatsResponse,} from "@repo/schemas";
import {type InfiniteData, infiniteQueryOptions, mutationOptions, queryOptions,} from "@tanstack/react-query";
import {createTutorChatFn, getAllTutorChatsFn, TUTOR_CHATS_QUERY_KEYS,} from "@/features/tutor-chats";

export const getTutorChatsQueryOptions = (
	data: Omit<TFindAllTutorChatsInput, "cursor">,
) =>
	queryOptions({
		queryFn: () => getAllTutorChatsFn({ data }),
		queryKey: TUTOR_CHATS_QUERY_KEYS.findAll(data),
	});

export const getInfiniteTutorChatsQueryOptions = (
	data: TFindAllTutorChatsInput,
) =>
	infiniteQueryOptions({
		queryFn: () => getAllTutorChatsFn({ data }),
		queryKey: TUTOR_CHATS_QUERY_KEYS.findAll(data),
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		initialPageParam: data.cursor,
	});

export const createTutorChatMutationOptions = () =>
	mutationOptions({
		mutationFn: (data: TCreateTutorChatInput) => createTutorChatFn({ data }),
		onSuccess: (tutorChat, _variables, _onMutationResult, { client }) => {
			client.setQueriesData(
				{
					queryKey: TUTOR_CHATS_QUERY_KEYS.findAll(),
					exact: false,
				},
				(old) => {
					if (!old) return old;

					const inf = old as InfiniteData<TFindAllTutorChatsResponse>;

					if (!inf.pages?.length) return old;

					const firstPage = inf.pages[0];

					if (!firstPage || !Array.isArray(firstPage.data)) return old;

					const nextFirstPageData = [tutorChat, ...firstPage.data];

					return {
						...inf,
						pages: [
							{ ...firstPage, data: nextFirstPageData },
							...inf.pages.slice(1),
						],
					};
				},
			);
		},
	});
