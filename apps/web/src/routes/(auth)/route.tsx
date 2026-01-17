import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthLayout, sendVerificationCodeFn } from "@/features/auth";
import { ensureCurrentUser } from "@/lib";

export const Route = createFileRoute("/(auth)")({
	component: AuthLayout,
	beforeLoad: async ({ context, location }) => {
		const [currentUser] = await ensureCurrentUser(context.queryClient);

		if (currentUser && !currentUser.emailVerified && location.pathname !== "/verification") {
			sendVerificationCodeFn();
			throw redirect({
				to: "/verification"
			});
		}

		if (currentUser?.emailVerified) {
			throw redirect({
				to: "/"
			});
		}
	}
});
