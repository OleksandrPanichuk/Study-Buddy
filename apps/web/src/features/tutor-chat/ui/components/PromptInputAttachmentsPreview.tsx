import {
	Attachment,
	AttachmentInfo,
	AttachmentPreview,
	AttachmentRemove,
	Attachments,
	PromptInputHeader,
	Spinner,
	usePromptInputAttachments
} from "@repo/ui";

interface IPromptInputAttachmentsPreviewProps {
	uploadingIds: Set<string>;
}

export const PromptInputAttachmentsPreview = ({ uploadingIds }: IPromptInputAttachmentsPreviewProps) => {
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
						onRemove={uploadingIds.has(file.id) ? undefined : () => handleRemove(file.id)}>
						{uploadingIds.has(file.id) ? <Spinner className="size-3" /> : <AttachmentPreview />}
						<AttachmentInfo />
						{!uploadingIds.has(file.id) && <AttachmentRemove />}
					</Attachment>
				))}
			</Attachments>
		</PromptInputHeader>
	);
};
