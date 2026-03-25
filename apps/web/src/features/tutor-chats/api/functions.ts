import {
	bulkDeleteTutorChatsInputSchema,
	createTutorChatInputSchema,
	deleteTutorChatInputSchema,
	findAllTutorChatsInputSchema,
	findTutorChatInputSchema,
	type TBulkDeleteTutorChatsInput,
	type TCreateTutorChatInput,
	type TCreateTutorChatResponse,
	type TDeleteTutorChatInput,
	type TFindAllTutorChatsInput,
	type TFindAllTutorChatsResponse,
	type TFindTutorChatInput,
	type TTutorChat,
	type TUpdateTutorChatInput,
	type TUpdateTutorChatResponse,
	updateTutorChatInputSchema
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

export const getTutorChatFn = createServerFn({ method: "GET" })
	.inputValidator((data: TFindTutorChatInput) => findTutorChatInputSchema.parse(data))
	.handler(async (ctx) => {
		return await fetcher.get(TUTOR_CHATS_API_ROUTES.by_id(ctx.data.tutorChatId)).json<TTutorChat>();
	});

export const createTutorChatFn = createServerFn({ method: "POST" })
	.inputValidator((data: TCreateTutorChatInput) => createTutorChatInputSchema.parse(data))
	.handler(async (ctx) => {
		return await fetcher
			.post(TUTOR_CHATS_API_ROUTES.root, {
				json: ctx.data
			})
			.json<TCreateTutorChatResponse>();
	});

export const updateTutorChatFn = createServerFn({ method: "POST" })
	.inputValidator((data: TUpdateTutorChatInput) => updateTutorChatInputSchema.parse(data))
	.handler(async (ctx) => {
		return await fetcher
			.patch(TUTOR_CHATS_API_ROUTES.root, {
				json: ctx.data
			})
			.json<TUpdateTutorChatResponse>();
	});

export const deleteTutorChatFn = createServerFn({ method: "POST" })
	.inputValidator((data: TDeleteTutorChatInput) => deleteTutorChatInputSchema.parse(data))
	.handler(async (ctx) => {
		return await fetcher.delete(TUTOR_CHATS_API_ROUTES.by_id(ctx.data.tutorChatId)).json<TTutorChat>();
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
