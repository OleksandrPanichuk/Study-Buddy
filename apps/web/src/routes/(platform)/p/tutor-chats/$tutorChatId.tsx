import {createFileRoute} from "@tanstack/react-router";
import z from "zod";
import {getTutorChatQueryOptions, TutorChatHeader, TutorChatView} from "@/features/tutor-chat";

export const Route = createFileRoute("/(platform)/p/tutor-chats/$tutorChatId")({
	component: RouteComponent,
	staticData: {
		headerComponent: TutorChatHeaderWithLoaderData,
		headerShowUserMenu: false
	},
	params: {
		parse: (params) =>
			z
				.object({
					tutorChatId: z.uuidv4()
				})
				.parse(params)
	},
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(getTutorChatQueryOptions(params.tutorChatId));
	}
});

function TutorChatHeaderWithLoaderData() {
	const tutorChat = Route.useLoaderData();
	return <TutorChatHeader tutorChat={tutorChat} />;
}

function RouteComponent() {
	const tutorChat = Route.useLoaderData();

	return <TutorChatView tutorChatId={tutorChat.id} />;
}
