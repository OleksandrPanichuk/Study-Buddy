import {createMessageInputSchema, type TCreateMessageInput, type TCreateMessageResponse} from "@repo/schemas";
import {createServerFn} from "@tanstack/react-start";
import {MESSAGES_API_ROUTES} from "@/features/messages";
import {fetcher} from "@/lib/fetcher";

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
