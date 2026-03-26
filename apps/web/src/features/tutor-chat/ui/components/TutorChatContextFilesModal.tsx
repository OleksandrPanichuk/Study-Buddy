import type {TTutorChat} from "@repo/schemas";
import {Dialog, DialogContent} from "@repo/ui";
import {MODALS, useModal} from "@/features/shared";

export interface ITutorChatContextFilesModalData {
	data: TTutorChat;
}

export const TutorChatContextFilesModal = () => {
	const { state, close, isOpen } = useModal(MODALS.TUTOR_CHAT_CONTEXT_FILES);

	if (!state) return null;

	return (
		<Dialog open={isOpen} onOpenChange={close}>
			<DialogContent>Content</DialogContent>
		</Dialog>
	);
};
