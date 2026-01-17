import { verifyResetPasswordTokenInputSchema } from "@repo/schemas";
import { createFileRoute } from "@tanstack/react-router";
import { InvalidResetTokenView, ResetPasswordView, verifyResetTokenFn } from "@/features/auth";

export const Route = createFileRoute("/(auth)/reset-password/")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	validateSearch: verifyResetPasswordTokenInputSchema,
	beforeLoad: async ({ search }) => {
		const result = await verifyResetTokenFn({ data: { token: search.token, email: search.email } });

		if (!result.valid) {
			throw new Error("Invalid reset token");
		}
	}
});

function RouteComponent() {
	const { token, email } = Route.useSearch();
	return <ResetPasswordView token={token} email={email} />;
}

function ErrorComponent() {
	return <InvalidResetTokenView />;
}
