import type {TTutorChat} from "@repo/schemas";
import {Dialog, DialogContent} from "@repo/ui";
import {MODALS, useModal} from "@/features/shared";

export interface IContextFilesModalData {
	data: TTutorChat;
}

export const ContextFilesModal = () => {
	const { isOpen, state, close } = useModal(MODALS.CONTEXT_FILES);

	if (!state) return null;

	return (
		<Dialog open={isOpen} onOpenChange={close}>
			<DialogContent>Content</DialogContent>
		</Dialog>
	);
};
