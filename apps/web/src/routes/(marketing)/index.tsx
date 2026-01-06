import {createFileRoute} from "@tanstack/react-router";
import {MarketingView} from "@/features/marketing";

export const Route = createFileRoute("/(marketing)/")({
	component: MarketingPage,
});

function MarketingPage() {
	return <MarketingView />;
}
