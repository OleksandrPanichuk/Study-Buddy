import type {TCreateMessageInput} from "@repo/schemas";
import {mutationOptions} from "@tanstack/react-query";
import {createMessageFn} from "@/features/messages";

export const getCreateMessageMutationOptions = () =>
	mutationOptions({
		mutationFn: (data: TCreateMessageInput) => createMessageFn({ data }),
		onSuccess: (response, _variables, _onMutationResult, { client }) => {
			// TODO: add message to cache
		}
	});
