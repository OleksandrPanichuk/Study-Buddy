import { ForgotPasswordView } from "@/features/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/forgot-password/")({
	component: RouteComponent
});

function RouteComponent() {
	return <ForgotPasswordView />;
}
