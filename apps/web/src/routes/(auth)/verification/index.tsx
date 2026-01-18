import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { VerifyEmailView } from "@/features/auth";
import { zPathname } from "@/lib";

export const Route = createFileRoute("/(auth)/verification/")({
	component: RouteComponent,
	validateSearch: z.object({
		redirect_url: zPathname.catch("/").optional()
	})
});

function RouteComponent() {
	const { redirect_url } = Route.useSearch();
	return <VerifyEmailView redirectUrl={redirect_url} />;
}
