import { MESSAGES_API_ROUTES } from "@/features/messages";
import { fetcher } from "@/lib/fetcher";
import {
	createMessageInputSchema,
	findAllMessagesInputSchema,
	type TCreateMessageInput,
	type TCreateMessageResponse,
	type TFindAllMessagesInput,
	TFindAllMessagesResponse
} from "@repo/schemas";
import { createServerFn } from "@tanstack/react-start";
import qs from "query-string";

export const getAllMessagesFn = createServerFn({
	method: "POST"
})
	.inputValidator((data: TFindAllMessagesInput) => findAllMessagesInputSchema.parse(data))
	.handler(async ({ data }) => {
		const { tutorChatId, ...rest } = data;

		

		const url = qs.stringifyUrl({
			url: MESSAGES_API_ROUTES.root(tutorChatId),
			query: rest
		});

		return await fetcher.get(url).json<TFindAllMessagesResponse>();
	});

export const createMessageFn = createServerFn({ method: "POST" })
	.inputValidator((data: TCreateMessageInput) => createMessageInputSchema.parse(data))
	.handler(async ({ data }) => {
		const { tutorChatId, ...rest } = data;
		return await fetcher
			.post(MESSAGES_API_ROUTES.root(tutorChatId), {
				json: rest
			})
			.json<TCreateMessageResponse>();
	});
