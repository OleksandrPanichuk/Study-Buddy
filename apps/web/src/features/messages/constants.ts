import type { TFindAllMessagesInput } from "@repo/schemas/messages";

export const MESSAGES_API_ROUTES = {
	root: (tutorChatId: string) => `tutor-chat/${tutorChatId}/messages`
} as const;

export const MESSAGES_QUERY_KEYS = {
	base: ["messages"],
	getAll: (data?: TFindAllMessagesInput) =>
		[...MESSAGES_QUERY_KEYS.base, "infinite", data?.tutorChatId, data?.limit, data?.cursor].filter(Boolean)
} as const;

export const DEFAULT_MESSAGES_LIMIT = 20;
