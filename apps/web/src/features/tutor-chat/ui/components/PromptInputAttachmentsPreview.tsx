import {
	Attachment,
	AttachmentInfo,
	AttachmentPreview,
	AttachmentRemove,
	Attachments,
	PromptInputHeader,
	usePromptInputAttachments,
} from "@repo/ui";

export const PromptInputAttachmentsPreview = () => {
	const attachments = usePromptInputAttachments();

	if (attachments.files.length === 0) return null;

	const handleRemove = (id: string) => {
		attachments.remove(id);
	};

	return (
		<PromptInputHeader>
			<Attachments variant="inline">
				{attachments.files.map((file) => (
					<Attachment
						key={file.id}
						data={file}
						onRemove={() => handleRemove(file.id)}
					>
						<AttachmentPreview />
						<AttachmentInfo />
						<AttachmentRemove />
					</Attachment>
				))}
			</Attachments>
		</PromptInputHeader>
	);
};
