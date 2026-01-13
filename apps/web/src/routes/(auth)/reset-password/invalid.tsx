import {createFileRoute} from "@tanstack/react-router";
import {InvalidResetTokenView} from "@/features/auth";

export const Route = createFileRoute("/(auth)/reset-password/invalid")({
	component: InvalidTokenComponent
});

function InvalidTokenComponent() {
	return <InvalidResetTokenView />;
}
