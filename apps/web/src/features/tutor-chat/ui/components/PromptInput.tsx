import {
	AI_DEFAULT_MODEL,
	ALLOWED_MIME_TYPES,
	MAX_FILE_SIZE,
} from "@repo/constants";
import {
	createMessageInputSchema,
	type TCreateMessageInput,
} from "@repo/schemas";
import {
	PromptInputActionAddAttachments,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInput as PromptInputBase,
	PromptInputBody,
	PromptInputFooter,
	PromptInputProvider,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputTools,
	usePromptInputController,
} from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
	ModelSelect,
	PromptInputAttachmentsPreview,
} from "@/features/tutor-chat";

interface IPromptInputProps {
	tutorChatId: string;
}

const PromptInputInner = ({ tutorChatId }: IPromptInputProps) => {
	const controller = usePromptInputController();

	const form = useForm({
		validators: {
			onSubmit: createMessageInputSchema,
		},
		defaultValues: {
			content: "",
			model: AI_DEFAULT_MODEL,
		} as TCreateMessageInput,
		onSubmit: async ({ value, formApi }) => {
			controller.textInput.clear();
		},
	});

	return (
		<PromptInputBase
			accept={ALLOWED_MIME_TYPES.join(",")}
			maxFileSize={MAX_FILE_SIZE}
			onError={(error) => toast.error(error.message)}
			onSubmit={form.handleSubmit}
		>
			<PromptInputAttachmentsPreview />

			<PromptInputBody>
				<form.Field name="content">
					{(field) => (
						<PromptInputTextarea
							placeholder="Ask your study buddy anything…"
							value={field.state.value}
							onChange={(e) => {
								field.handleChange(e.target.value);
								controller.textInput.setInput(e.target.value);
							}}
						/>
					)}
				</form.Field>
			</PromptInputBody>

			<PromptInputFooter>
				<PromptInputTools>
					<PromptInputActionMenu>
						<PromptInputActionMenuTrigger />
						<PromptInputActionMenuContent>
							<PromptInputActionAddAttachments />
						</PromptInputActionMenuContent>
					</PromptInputActionMenu>

					<form.Field name="model">
						{(field) => (
							<ModelSelect
								value={field.state.value}
								onChange={(val) => field.handleChange(val)}
							/>
						)}
					</form.Field>
				</PromptInputTools>

				<PromptInputSubmit />
			</PromptInputFooter>
		</PromptInputBase>
	);
};

export const PromptInput = ({ tutorChatId }: IPromptInputProps) => {
	return (
		<PromptInputProvider>
			<PromptInputInner tutorChatId={tutorChatId} />
		</PromptInputProvider>
	);
};
