import {
    createTutorChatInputSchema,
    deleteTutorChatInputSchema,
    findTutorChatInputSchema,
    type TCreateTutorChatInput,
    type TCreateTutorChatResponse,
    type TDeleteTutorChatInput,
    type  TFindTutorChatInput,
    type TTutorChat,
    type TUpdateTutorChatInput,
    type TUpdateTutorChatResponse,
    updateTutorChatInputSchema
} from "@repo/schemas";
import {createServerFn} from "@tanstack/react-start";
import {TUTOR_CHAT_API_ROUTES} from "@/features/tutor-chat";
import {fetcher} from "@/lib/fetcher.ts";

export const getTutorChatFn = createServerFn({ method: "GET" })
	.inputValidator((data: TFindTutorChatInput) => findTutorChatInputSchema.parse(data))
	.handler(async (ctx) => {
		return await fetcher.get(TUTOR_CHAT_API_ROUTES.by_id(ctx.data.tutorChatId)).json<TTutorChat>();
	});

export const createTutorChatFn = createServerFn({ method: "POST" })
	.inputValidator((data: TCreateTutorChatInput) => createTutorChatInputSchema.parse(data))
	.handler(async (ctx) => {
		return await fetcher
			.post(TUTOR_CHAT_API_ROUTES.root, {
				json: ctx.data
			})
			.json<TCreateTutorChatResponse>();
	});

export const updateTutorChatFn = createServerFn({ method: "POST" })
	.inputValidator((data: TUpdateTutorChatInput) => updateTutorChatInputSchema.parse(data))
	.handler(async (ctx) => {
		return await fetcher
			.patch(TUTOR_CHAT_API_ROUTES.root, {
				json: ctx.data
			})
			.json<TUpdateTutorChatResponse>();
	});

export const deleteTutorChatFn = createServerFn({ method: "POST" })
	.inputValidator((data: TDeleteTutorChatInput) => deleteTutorChatInputSchema.parse(data))
	.handler(async (ctx) => {
		return await fetcher.delete(TUTOR_CHAT_API_ROUTES.by_id(ctx.data.tutorChatId)).json<TTutorChat>();
	});
