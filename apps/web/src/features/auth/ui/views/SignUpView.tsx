import { signUpInputSchema, type TSignUpInput } from "@repo/schemas";
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
	Input,
	Separator
} from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AUTH_API_ROUTES, getSendVerificationCodeMutationOptions, getSignUpMutationOptions } from "@/features/auth";

export const SignUpView = () => {
	const navigate = useNavigate();

	const { mutateAsync: signUp } = useMutation(getSignUpMutationOptions());
	const { mutate: sendVerificationEmail } = useMutation(getSendVerificationCodeMutationOptions());

	const form = useForm({
		defaultValues: {
			email: "",
			username: "",
			password: ""
		} as TSignUpInput,
		validators: {
			onBlur: signUpInputSchema,
			onSubmit: signUpInputSchema
		},
		onSubmit: async ({ value }) => {
			try {
				await signUp(value);

				toast.success("Account created successfully");

				sendVerificationEmail();

				await navigate({
					to: "/verification"
				});
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message);
				}
			}
		}
	});

	const handleSocialAuth = (provider: "google" | "github") => {
		const apiUrl = import.meta.env.VITE_API_URL;
		const route = AUTH_API_ROUTES[provider];
		window.location.href = `${apiUrl}/api/${route}`;
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-2xl">Create an account</CardTitle>
				<CardDescription>Enter your information to get started</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-4">
					<FieldGroup className={"gap-2"}>
						<form.Field name={"username"}>
							{(field) => {
								const isInvalid = !field.state.meta.isValid && field.state.meta.isTouched;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Username</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											type="text"
											placeholder="username"
											autoComplete="username"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name={"email"}>
							{(field) => {
								const isInvalid = !field.state.meta.isValid && field.state.meta.isTouched;
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
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name={"password"}>
							{(field) => {
								const isInvalid = !field.state.meta.isValid && field.state.meta.isTouched;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Password</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											type="password"
											placeholder="Create a password"
											autoComplete="new-password"
										/>
										{isInvalid && <FieldError errors={field.state.meta.errors.toSpliced(1)} />}
									</Field>
								);
							}}
						</form.Field>
					</FieldGroup>

					<Button type="submit" className="w-full">
						Sign up
					</Button>
				</form>

				<div className="relative my-6">
					<Separator />
					<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
						OR
					</span>
				</div>

				<div className={"flex gap-2 w-full"}>
					<Button onClick={() => handleSocialAuth("google")} variant="outline">
						<img src={"/icons/google.svg"} alt={"Google logo"} className={"size-5"} />
						Continue with Google
					</Button>
					<Button onClick={() => handleSocialAuth("github")} variant="outline">
						<img src={"/icons/github.svg"} alt={"Github logo"} className={"size-5"} />
						Continue with Github
					</Button>
				</div>
			</CardContent>
			<CardFooter className="flex-col gap-2">
				<div className="text-sm text-muted-foreground text-center">
					Already have an account?{" "}
					<Link to="/sign-in" className="text-primary hover:underline">
						Sign in
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
};
