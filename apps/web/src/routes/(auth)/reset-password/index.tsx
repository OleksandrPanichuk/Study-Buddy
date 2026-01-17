import { verifyResetPasswordTokenInputSchema } from "@repo/schemas";
import { createFileRoute } from "@tanstack/react-router";
import { InvalidResetTokenView, ResetPasswordView, verifyResetTokenFn } from "@/features/auth";

export const Route = createFileRoute("/(auth)/reset-password/")({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	validateSearch: verifyResetPasswordTokenInputSchema,
	beforeLoad: async ({ search }) => {
		const result = await verifyResetTokenFn({ data: { token: search.token } });

		if (!result.valid) {
			throw new Error("Invalid reset token");
		}
	}
});

function RouteComponent() {
	const { token } = Route.useSearch();
	return <ResetPasswordView token={token} />;
}

function ErrorComponent() {
	return <InvalidResetTokenView />;
}
