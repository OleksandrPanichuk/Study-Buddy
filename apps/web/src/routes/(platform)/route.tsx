import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { ensureCurrentUser } from "@/lib";

export const Route = createFileRoute("/(platform)")({
	component: RouteComponent,
	beforeLoad: async ({ context, location }) => {
		const [currentUser] = await ensureCurrentUser(context.queryClient);

		if (currentUser && !currentUser.emailVerified) {
			throw redirect({
				to: "/verification",
				search: {
					redirect_url: location.href
				}
			});
		}
	}
});

function RouteComponent() {
	return <Outlet />;
}
