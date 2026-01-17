export const PROFILE_API_ROUTES = {
	currentUser: "users/current"
} as const;

export const PROFILE_QUERY_KEYS = {
	base: ["profile"],
	currentUser: () => [...PROFILE_QUERY_KEYS.base, "currentUser"]
} as const;
