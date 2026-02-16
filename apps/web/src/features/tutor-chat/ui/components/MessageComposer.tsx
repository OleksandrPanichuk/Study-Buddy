import {createMessageInputSchema, type TCreateMessageInput} from "@repo/schemas";
import {
	PromptInput,
	PromptInputBody,
	PromptInputFooter,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputTools
} from "@repo/ui";
import {useForm} from "@tanstack/react-form";
import type {ChangeEvent} from "react";
import {DEFAULT_MODEL, MessageActionMenu, ModelSelect} from "@/features/tutor-chat";

interface IMessageComposerProps {
	tutorChatId: string;
}

export const MessageComposer = ({ tutorChatId }: IMessageComposerProps) => {
	const form = useForm({
		validators: {
			onSubmit: createMessageInputSchema
		},
		defaultValues: {
			content: "",
			model: DEFAULT_MODEL
		} as TCreateMessageInput,
		onSubmit: async ({ value }) => {
			console.log({ value });
		}
	});

	return (
		<PromptInput onSubmit={() => form.handleSubmit()} globalDrop multiple>
			<PromptInputBody>
				<form.Field name="content">
					{(field) => (
						<PromptInputTextarea
							value={field.state.value}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) => field.handleChange(e.currentTarget.value)}
						/>
					)}
				</form.Field>
			</PromptInputBody>
			<PromptInputFooter>
				<PromptInputTools>
					<MessageActionMenu />
					<form.Field name="model">
						{(field) => <ModelSelect value={field.state.value} onChange={(value) => field.handleChange(value)} />}
					</form.Field>
				</PromptInputTools>
				<PromptInputSubmit />
			</PromptInputFooter>
		</PromptInput>
	);
};
