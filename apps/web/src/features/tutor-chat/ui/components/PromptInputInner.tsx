import {AI_DEFAULT_MODEL, type AIModels, ALLOWED_MIME_TYPES, MAX_FILE_SIZE} from "@repo/constants";
import {createMessageInputSchema, type TCreateMessageInput, type TUploadFilesResponse} from "@repo/schemas";
import {
	PromptInput as PromptInputBase,
	PromptInputActionAddAttachments,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputBody,
	PromptInputFooter,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputTools,
	usePromptInputController
} from "@repo/ui";
import {useForm} from "@tanstack/react-form";
import {useEffect} from "react";
import {toast} from "sonner";
import {ModelSelect, PromptInputAttachmentsPreview} from "@/features/tutor-chat";

interface PromptInputInnerProps {
	tutorChatId: string;
	uploadingIds: Set<string>;
	uploadedFiles: TUploadFilesResponse;
	onSubmit: (values: TCreateMessageInput) => Promise<boolean>;
}

const getDefaultValues = (tutorChatId: string): TCreateMessageInput => ({
	content: "",
	model: AI_DEFAULT_MODEL,
	files: undefined,
	tutorChatId
});

export const PromptInputInner = ({ uploadingIds, uploadedFiles, onSubmit, tutorChatId }: PromptInputInnerProps) => {
	const controller = usePromptInputController();

	const form = useForm({
		validators: { onSubmit: createMessageInputSchema },
		defaultValues: getDefaultValues(tutorChatId),
		onSubmit: async ({ value, formApi }) => {
			const success = await onSubmit?.(value);

			if (success) {
				formApi.reset(getDefaultValues(tutorChatId));

				controller.textInput.clear();
				controller.attachments.clear();
			}
		}
	});

	useEffect(() => {
		form.setFieldValue("files", uploadedFiles.length > 0 ? uploadedFiles : undefined);
	}, [uploadedFiles, form]);

	return (
		<PromptInputBase
			accept={ALLOWED_MIME_TYPES.join(",")}
			maxFileSize={MAX_FILE_SIZE}
			onError={(error) => toast.error(error.message)}
			onSubmit={form.handleSubmit}>
			<PromptInputAttachmentsPreview uploadingIds={uploadingIds} />

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
								value={field.state.value as AIModels | undefined}
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
