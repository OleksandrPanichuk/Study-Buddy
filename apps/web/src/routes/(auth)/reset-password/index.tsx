import {verifyResetPasswordTokenInputSchema} from "@repo/schemas";
import {createFileRoute, redirect} from "@tanstack/react-router";
import {ResetPasswordView, verifyResetTokenFn} from "@/features/auth";

export const Route = createFileRoute("/(auth)/reset-password/")({
	component: RouteComponent,
	validateSearch: verifyResetPasswordTokenInputSchema,
	beforeLoad: async ({ search }) => {
		const result = await verifyResetTokenFn({ data: { token: search.token } });

		if (!result.valid) {
			throw redirect({
				to: "/reset-password/invalid"
			});
		}
	}
});

function RouteComponent() {
	const { token } = Route.useSearch();
	return <ResetPasswordView token={token} />;
}
