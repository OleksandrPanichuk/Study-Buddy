import {createFileRoute} from "@tanstack/react-router";
import {AboutView} from "@/features/marketing";

export const Route = createFileRoute("/(marketing)/about")({
	component: AboutPage,
});

function AboutPage() {
	return <AboutView />;
}
