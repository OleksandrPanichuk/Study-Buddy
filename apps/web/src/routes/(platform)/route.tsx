import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { ensureCurrentUser } from "@/lib";

export const Route = createFileRoute("/(platform)")({
	component: RouteComponent,
	beforeLoad: async ({ context, location }) => {
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
	return <Outlet />;
}
