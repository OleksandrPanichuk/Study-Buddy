import {useQuery} from "@tanstack/react-query";
import {getCurrentUserQueryOptions} from "@/features/profile";

export const useUser = () => {
	const { data: user } = useQuery(getCurrentUserQueryOptions());
	return user ?? null;
};
