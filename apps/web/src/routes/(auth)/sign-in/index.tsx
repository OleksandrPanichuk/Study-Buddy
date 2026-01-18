import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { SignInView } from "@/features/auth";
import { zPathname } from "@/lib";

export const Route = createFileRoute("/(auth)/sign-in/")({
	component: RouteComponent,
	validateSearch: z.object({
		redirect_url: zPathname.catch("/").optional()
	})
});

function RouteComponent() {
	const { redirect_url } = Route.useSearch();
	return <SignInView redirectUrl={redirect_url} />;
}
