import type {TFindAllTutorChatsInput} from "@repo/schemas";

export const TUTOR_CHATS_API_ROUTES = {
	root: "tutor-chats",
	bulk: "tutor-chats/bulk"
} as const;

export const TUTOR_CHATS_QUERY_KEYS = {
	base: ["tutor-chats"],
	findAll: (data?: TFindAllTutorChatsInput) =>
		[...TUTOR_CHATS_QUERY_KEYS.base, "all", data?.limit, data?.cursor].filter(Boolean),
	findAllInfinite: (data?: TFindAllTutorChatsInput) => [...TUTOR_CHATS_QUERY_KEYS.findAll(data), "infinite"]
};

export const DEFAULT_TUTOR_CHATS_LIMIT = 10;
