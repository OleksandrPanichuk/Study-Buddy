import type {TCurrentUserResponse} from "@repo/schemas";
import {createServerFn} from "@tanstack/react-start";
import {PROFILE_API_ROUTES} from "@/features/profile";
import {fetcher} from "@/lib/fetcher";

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(async () => {
	return await fetcher
		.get(PROFILE_API_ROUTES.currentUser, {
			retry: {
				limit: 0
			}
		})
		.json<TCurrentUserResponse>();
});
