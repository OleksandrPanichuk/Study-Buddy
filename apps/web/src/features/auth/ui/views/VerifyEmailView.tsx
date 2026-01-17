import { type TVerifyEmailInput, verifyEmailSchema } from "@repo/schemas";
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
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getSendVerificationCodeMutationOptions, getVerifyEmailMutationOptions } from "@/features/auth";
import { PROFILE_QUERY_KEYS } from "@/features/profile";

interface IVerifyEmailViewProps {
	redirectUrl?: string;
}

export const VerifyEmailView = ({ redirectUrl }: IVerifyEmailViewProps) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { mutateAsync: verifyEmail } = useMutation(getVerifyEmailMutationOptions());
	const { mutateAsync: sendVerificationEmail } = useMutation(getSendVerificationCodeMutationOptions());

	const form = useForm({
		defaultValues: {
			code: ""
		} as TVerifyEmailInput,
		validators: {
			onBlur: verifyEmailSchema,
			onSubmit: verifyEmailSchema
		},
		onSubmit: async ({ value }) => {
			try {
				await verifyEmail(value);

				queryClient.setQueryData(PROFILE_QUERY_KEYS.currentUser(), (oldData) => {
					if (!oldData) return oldData;

					return {
						...oldData,
						emailVerified: true
					};
				});

				if (redirectUrl) {
					navigate({
						href: redirectUrl
					});
				} else {
					navigate({
						to: "/"
					});
				}
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message);
				}
			}
		}
	});

	const handleResendCode = async () => {
		try {
			await sendVerificationEmail();
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-2xl">Verify your email</CardTitle>
				<CardDescription>Enter the 6-digit code sent to your email address</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-4">
					<FieldGroup className={"gap-2"}>
						<form.Field name={"code"}>
							{(field) => {
								const isInvalid = !field.state.meta.isValid && field.state.meta.isTouched;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Verification Code</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="123456"
											maxLength={6}
											className="text-center tracking-widest text-lg"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
					</FieldGroup>
					<Button type="submit" className="w-full">
						Verify Email
					</Button>
				</form>
				<div className="mt-4 text-center text-sm">
					Did&apos;t receive the code?{" "}
					<Button variant="link" className="p-0 h-auto font-normal" onClick={handleResendCode}>
						Resend
					</Button>
				</div>
			</CardContent>
			<CardFooter className="justify-center">
				<Button variant="link" asChild>
					<Link to="/sign-in">To sign in</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};
