import {createFileRoute, redirect} from "@tanstack/react-router";
import {PlatformLayout} from "@/features/platform";
import {ensureCurrentUser} from "@/lib";

export const Route = createFileRoute("/(platform)")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const [currentUser, error] = await ensureCurrentUser(context.queryClient);

		if (!currentUser || error) {
			throw redirect({
				to: "/sign-in",
				search: {
					redirect_url: location.pathname
				}
			});
		}

		if (!currentUser.emailVerified) {
			throw redirect({
				to: "/verification",
				search: {
					redirect_url: location.pathname
				}
			});
		}
	}
});

function RouteComponent() {
	return <PlatformLayout />;
}
