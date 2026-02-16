import {createFileRoute} from "@tanstack/react-router";
import z from "zod";
import {TutorChatView} from "@/features/tutor-chat";

export const Route = createFileRoute("/(platform)/p/tutor-chats/$tutorChatId")({
	component: RouteComponent,
	params: {
		parse: (params) =>
			z
				.object({
					tutorChatId: z.uuidv4()
				})
				.parse(params)
	}
});

function RouteComponent() {
	const { tutorChatId } = Route.useParams();
	return <TutorChatView tutorChatId={tutorChatId} />;
}
