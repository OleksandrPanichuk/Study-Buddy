import {createFileRoute} from "@tanstack/react-router";
import {SignInView} from "@/features/auth";

export const Route = createFileRoute("/(auth)/sign-in/")({
  component: RouteComponent,
});

function RouteComponent() {
	return <SignInView />;
}
