import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/(platform)/p/tutor-chats/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div></div>;
}
