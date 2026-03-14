import type {TMessageWithAttachments} from "@repo/schemas";
import {Attachment, type AttachmentData, AttachmentInfo, AttachmentPreview, Attachments,} from "@repo/ui";

interface IMessageAttachmentsProps {
	attachments: TMessageWithAttachments["attachments"];
}

export const MessageAttachments = ({
	attachments,
}: IMessageAttachmentsProps) => {
	if (!attachments || attachments?.length === 0) return null;

	return (
		<Attachments className="mt-2" variant="inline">
			{attachments.map((attachment) => {
				const data: AttachmentData = {
					id: attachment.id,
					filename: attachment.name,
					mediaType: attachment.mimeType,
					type: "file",
					url: attachment.url,
				};

				return (
					<a
						href={attachment.url}
						key={attachment.id}
						rel="noreferrer"
						target="_blank"
					>
						<Attachment data={data}>
							<AttachmentPreview />
							<AttachmentInfo />
						</Attachment>
					</a>
				);
			})}
		</Attachments>
	);
};
