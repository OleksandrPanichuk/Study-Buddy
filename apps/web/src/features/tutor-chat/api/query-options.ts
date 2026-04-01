import type {
    TCreateTutorChatInput,
    TDeleteTutorChatInput,
    TFindAllTutorChatsResponse,
    TTutorChat,
    TUpdateTutorChatInput
} from "@repo/schemas";
import {mutationOptions, queryOptions} from "@tanstack/react-query";
import {
    createTutorChatFn,
    deleteTutorChatFn,
    getTutorChatFn,
    TUTOR_CHAT_QUERY_KEYS,
    updateTutorChatFn
} from "@/features/tutor-chat";
import {TUTOR_CHATS_QUERY_KEYS} from "@/features/tutor-chats";
import {isInfiniteQuery} from "@/lib";

export const getTutorChatQueryOptions = (tutorChatId: string) =>
	queryOptions({
		queryKey: TUTOR_CHAT_QUERY_KEYS.findById(tutorChatId),
		queryFn: () => getTutorChatFn({ data: { tutorChatId } })
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
				(old: unknown) => {
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

export const getUpdateTutorChatMutationOptions = () =>
	mutationOptions({
		mutationFn: (data: TUpdateTutorChatInput) => updateTutorChatFn({ data }),
		onSuccess: (tutorChat, _variables, _onMutationResult, { client }) => {
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
								data: page.data.map((chat) => (chat.id === tutorChat.id ? tutorChat : chat))
							}))
						};
					}

					return (old as TTutorChat[]).map((chat) => (chat.id === tutorChat.id ? tutorChat : chat));
				}
			);

			client.setQueryData(TUTOR_CHAT_QUERY_KEYS.findById(tutorChat.id), tutorChat);
		}
	});

export const getDeleteTutorChatMutationOptions = () =>
	mutationOptions({
		mutationFn: (data: TDeleteTutorChatInput) => deleteTutorChatFn({ data }),
		onSuccess: (_result, variables, _onMutationResult, { client }) => {
			client.setQueriesData(
				{
					queryKey: TUTOR_CHATS_QUERY_KEYS.findAll(),
					exact: false
				},
				(old) => {
					if (!old) return old;

					if (isInfiniteQuery<TFindAllTutorChatsResponse>(old)) {
						return {
							...old,
							pages: old.pages.map((page) => ({
								...page,
								data: page.data.filter((chat) => chat.id !== variables.tutorChatId)
							}))
						};
					}

					return (old as TTutorChat[]).filter((el) => el.id !== variables.tutorChatId);
				}
			);
		}
	});
