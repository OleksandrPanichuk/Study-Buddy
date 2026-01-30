import {
	createTutorChatInputSchema,
	type TCreateTutorChatInput,
	type TTutorChat,
	type TUpdateTutorChatInput,
	updateTutorChatInputSchema,
} from "@repo/schemas";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
	Input,
	Textarea,
} from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { tryCatch } from "@/lib";

type TTutorChatFormMode = "create" | "update";

type TTutorChatFormProps<TMode extends TTutorChatFormMode> =
	TMode extends "create"
		? {
				mode: "create";
				onSubmit: (data: TCreateTutorChatInput) => void | Promise<void>;
			}
		: {
				mode: "update";
				onSubmit: (data: TUpdateTutorChatInput) => void | Promise<void>;
				defaultValues: TTutorChat;
			};

const getCreateDefaultValues = (): TCreateTutorChatInput => {
	return {
		name: "",
	};
};

const getUpdateDefaultValues = (
	defaultValues: TTutorChat,
): TUpdateTutorChatInput => {
	return {
		id: defaultValues.id,
		name: defaultValues.name,
		description: defaultValues.description || undefined,
		topic: defaultValues.topic || undefined,
		prompt: defaultValues.prompt || undefined,
	};
};

export const tutorChatFormId = "tutor-chat-form";

export const TutorChatForm = <TMode extends TTutorChatFormMode>(
	props: TTutorChatFormProps<TMode>,
) => {
	const defaultValues =
		props.mode === "create"
			? getCreateDefaultValues()
			: getUpdateDefaultValues(props.defaultValues);

	const validators =
		props.mode === "create"
			? createTutorChatInputSchema
			: updateTutorChatInputSchema;

	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: validators,
			onBlur: validators,
		},
		onSubmit: async ({ value, formApi }) => {
			if (props.mode === "create") {
				await tryCatch(props.onSubmit(value as TCreateTutorChatInput));
			} else {
				await tryCatch(props.onSubmit(value as TUpdateTutorChatInput));
			}

			formApi.reset();
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			id={tutorChatFormId}
		>
			<FieldSet className="gap-6">
				<FieldGroup className="grid gap-6 md:grid-cols-2">
					<form.Field name="name">
						{(field) => {
							const isInvalid =
								!field.state.meta.isValid && field.state.meta.isTouched;

							return (
								<Field>
									<FieldLabel htmlFor={field.name}>Name</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(e.target.value || undefined)
										}
										aria-invalid={isInvalid}
										type="text"
										placeholder="Algebra Ace"
									/>
									{!isInvalid && (
										<FieldDescription>
											A short, memorable name for this tutor.
										</FieldDescription>
									)}
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
					<form.Field name="topic">
						{(field) => {
							const isInvalid =
								!field.state.meta.isValid && field.state.meta.isTouched;

							return (
								<Field>
									<FieldLabel htmlFor={field.name}>Topic</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(e.target.value || undefined)
										}
										aria-invalid={isInvalid}
										type="text"
										placeholder="Quadratic equations"
									/>
									{!isInvalid && (
										<FieldDescription>
											What should this tutor focus on?
										</FieldDescription>
									)}
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
					<form.Field name="description">
						{(field) => {
							const isInvalid =
								!field.state.meta.isValid && field.state.meta.isTouched;
							return (
								<Field className="md:col-span-2">
									<FieldLabel htmlFor={field.name}>Description</FieldLabel>
									<Textarea
										id={field.name}
										name={field.name}
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(e.target.value || undefined)
										}
										aria-invalid={isInvalid}
										placeholder="Friendly mentor for step-by-step math explanations."
									/>
									{!isInvalid && (
										<FieldDescription>
											Share the vibe, tone, or learning style.
										</FieldDescription>
									)}
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
					<form.Field name="prompt">
						{(field) => {
							const isInvalid =
								!field.state.meta.isValid && field.state.meta.isTouched;

							return (
								<Field className="md:col-span-2">
									<FieldLabel htmlFor={field.name}>Prompt</FieldLabel>
									<Textarea
										id={field.name}
										name={field.name}
										value={field.state.value || ""}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(e.target.value || undefined)
										}
										aria-invalid={isInvalid}
										placeholder="Explain concepts with examples, ask guiding questions, and check understanding."
									/>
									{!isInvalid && (
										<FieldDescription>
											Optional instructions to shape the tutor's behavior.
										</FieldDescription>
									)}
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
				</FieldGroup>
			</FieldSet>
		</form>
	);
};
