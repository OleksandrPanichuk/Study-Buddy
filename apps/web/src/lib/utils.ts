import type { QueryClient } from "@tanstack/react-query";
import { getCurrentUserQueryOptions, PROFILE_QUERY_KEYS } from "@/features/profile";
import type { TUser } from "@/types";

type TryCatchSuccessfullResult<T> = [T, null];
type TryCatchFailedResult = [null, Error];
type TryCatchResult<T> = TryCatchSuccessfullResult<T> | TryCatchFailedResult;

export async function tryCatch<T>(promise: Promise<T>): Promise<TryCatchResult<T>> {
	try {
		const result = await promise;
		return [result, null];
	} catch (error) {
		const errorObject =
			error instanceof Error ? error : new Error(typeof error === "string" ? error : JSON.stringify(error));
		return [null, errorObject];
	}
}

export async function ensureCurrentUser(queryClient: QueryClient) {
	const user = queryClient.getQueryData<TUser | null>(PROFILE_QUERY_KEYS.currentUser());

	if (user) {
		return [user, null];
	}

	return await tryCatch(queryClient.ensureQueryData(getCurrentUserQueryOptions()));
}


