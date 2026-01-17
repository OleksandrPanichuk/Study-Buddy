import { queryOptions } from "@tanstack/react-query";
import { PROFILE_QUERY_KEYS } from "../constants";
import { getCurrentUserFn } from "./functions";

export const getCurrentUserQueryOptions = () =>
	queryOptions({
		queryKey: PROFILE_QUERY_KEYS.currentUser(),
		queryFn: () => getCurrentUserFn(),
		staleTime: 15 * 60 * 1000, // 15 minutes
		retry: false
	});
