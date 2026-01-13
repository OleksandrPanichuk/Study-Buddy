import { VerifyEmailView } from "@/features/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/verification/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <VerifyEmailView />;
}
