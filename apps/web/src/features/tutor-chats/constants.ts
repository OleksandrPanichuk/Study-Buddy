import type {TFindAllTutorChatsInput} from "@repo/schemas";

export const TUTOR_CHATS_API_ROUTES = {
	root: "tutor-chats",
} as const;

export const TUTOR_CHATS_QUERY_KEYS = {
	base: ["tutor-chats"],
	findAll: (data?: TFindAllTutorChatsInput) =>
		[...TUTOR_CHATS_QUERY_KEYS.base, "all", data?.limit, data?.cursor].filter(
			Boolean,
		),
};
