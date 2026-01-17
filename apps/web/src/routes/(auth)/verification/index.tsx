import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { VerifyEmailView } from "@/features/auth";

export const Route = createFileRoute("/(auth)/verification/")({
	component: RouteComponent,
	validateSearch: z.object({
		redirect_url: z.string().optional()
	})
});

function RouteComponent() {
	const { redirect_url } = Route.useSearch();
	return <VerifyEmailView redirectUrl={redirect_url} />;
}
