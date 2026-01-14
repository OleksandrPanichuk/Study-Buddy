import { createServerFn } from "@tanstack/react-start";
import type { TCurrentUserResponse } from "@repo/schemas";
import { fetcher } from "@/lib/fetcher";
import { PROFILE_API_ROUTES } from "@/features/profile";


export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(async () => {
   return await fetcher.get(PROFILE_API_ROUTES.currentUser).json<TCurrentUserResponse>()
})
