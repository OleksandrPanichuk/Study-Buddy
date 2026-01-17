import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/features/marketing";
import { ensureCurrentUser } from "@/lib";

export const Route = createFileRoute("/(marketing)")({
	component: MarketingLayout,
	beforeLoad: async ({ context }) => {
		await ensureCurrentUser(context.queryClient);
	}
});
