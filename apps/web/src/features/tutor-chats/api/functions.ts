import {
	bulkDeleteTutorChatsInputSchema,
	findAllTutorChatsInputSchema,
	type TBulkDeleteTutorChatsInput,
	type TFindAllTutorChatsInput,
	type TFindAllTutorChatsResponse
} from "@repo/schemas";
import {createServerFn} from "@tanstack/react-start";
import qs from "query-string";
import {TUTOR_CHATS_API_ROUTES} from "@/features/tutor-chats";
import {fetcher} from "@/lib/fetcher";

export const getAllTutorChatsFn = createServerFn({ method: "GET" })
	.inputValidator((data: TFindAllTutorChatsInput) => findAllTutorChatsInputSchema.parse(data))
	.handler(async (ctx) => {
		const cleanedQuery = Object.fromEntries(
			Object.entries(ctx.data ?? {}).filter(([, value]) => value !== null && value !== undefined && value !== "")
		);

		const url = qs.stringifyUrl({
			url: TUTOR_CHATS_API_ROUTES.root,
			query: cleanedQuery
		});

		return await fetcher.get(url).json<TFindAllTutorChatsResponse>();
	});

export const bulkDeleteTutorChatsFn = createServerFn({ method: "POST" })
	.inputValidator((data: TBulkDeleteTutorChatsInput) => bulkDeleteTutorChatsInputSchema.parse(data))
	.handler(async (ctx) => {
		const url = qs.stringifyUrl({
			url: TUTOR_CHATS_API_ROUTES.bulk,
			query: ctx.data
		});

		return await fetcher.delete(url).json<{ count: number }>();
	});
