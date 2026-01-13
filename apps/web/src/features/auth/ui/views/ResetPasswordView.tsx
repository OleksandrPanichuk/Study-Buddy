import {resetPasswordInputSchema, type TResetPasswordInput} from "@repo/schemas";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	Input
} from "@repo/ui";
import {useForm} from "@tanstack/react-form";
import {useMutation} from "@tanstack/react-query";
import {Link, useNavigate} from "@tanstack/react-router";
import {toast} from "sonner";
import {getResetPasswordMutationOptions} from "@/features/auth";

interface IResetPasswordViewProps {
	token: string;
}

export const ResetPasswordView = ({ token }: IResetPasswordViewProps) => {
	const navigate = useNavigate();

	const { mutateAsync: resetPassword } = useMutation(getResetPasswordMutationOptions());

	const form = useForm({
		defaultValues: {
			password: "",

			token
		} as TResetPasswordInput,
		validators: {
			onBlur: resetPasswordInputSchema,
			onSubmit: resetPasswordInputSchema
		},
		onSubmit: async ({ value }) => {
			try {
				await resetPassword(value);

				toast.success("Password has been reset successfully. You can now sign in with your new password.");

				await navigate({
					to: "/sign-in"
				});
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message);
				}
			}
		}
	});

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-2xl">Reset password</CardTitle>
				<CardDescription>Enter your new password below</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-4">
					<FieldGroup className={"gap-2"}>
						<form.Field name={"password"}>
							{(field) => {
								const isInvalid = !field.state.meta.isValid && field.state.meta.isTouched;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>New Password</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											type="password"
											placeholder="••••••••"
											autoComplete="new-password"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
					</FieldGroup>
					<Button type="submit" className="w-full">
						Reset Password
					</Button>
				</form>
			</CardContent>
			<CardFooter className="justify-center">
				<Button variant="link" asChild>
					<Link to="/sign-in">Back to Sign In</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};
