import { MarketingLayout } from "@/features/marketing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(marketing)")({
	component: MarketingLayout
});
