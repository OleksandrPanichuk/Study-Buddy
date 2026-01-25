import {sendResetPasswordTokenInputSchema, type TSendResetPasswordTokenInput} from "@repo/schemas";
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
import {Link} from "@tanstack/react-router";
import {toast} from "sonner";
import {getForgotPasswordMutationOptions} from "@/features/auth";

export const ForgotPasswordView = () => {
	const { mutateAsync: forgotPassword } = useMutation(
		getForgotPasswordMutationOptions(),
	);

	const form = useForm({
		defaultValues: {
			email: "",
			resetPageUrl: `${import.meta.env.VITE_APP_URL}/reset-password`,
		} as TSendResetPasswordTokenInput,
		validators: {
			onBlur: sendResetPasswordTokenInputSchema,
			onSubmit: sendResetPasswordTokenInputSchema,
		},
		onSubmit: async ({ value, formApi }) => {
			try {
				await forgotPassword(value);

				toast.info(
					"If an account with that email exists, a reset link has been sent.",
				);
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message);
				}
			} finally {
				formApi.reset();
			}
		},
	});

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-2xl">Forgot password?</CardTitle>
				<CardDescription>
					Enter your email address and we'll send you a link to reset your
					password
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<FieldGroup className={"gap-2"}>
						<form.Field name={"email"}>
							{(field) => {
								const isInvalid =
									!field.state.meta.isValid && field.state.meta.isTouched;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Email</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											type="email"
											placeholder="your.email@example.com"
											autoComplete="email"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
					</FieldGroup>
					<Button type="submit" className="w-full">
						Send Reset Link
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
