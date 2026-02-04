import type {TTutorChat, TUpdateTutorChatInput} from "@repo/schemas";
import {Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@repo/ui";
import {useMutation} from "@tanstack/react-query";
import {PencilIcon} from "lucide-react";
import {toast} from "sonner";
import {MODALS, useModal} from "@/features/shared";
import {getUpdateTutorChatMutationOptions, TutorChatForm, tutorChatFormId} from "@/features/tutor-chats";

export interface IUpdateTutorChatModalData {
	data: TTutorChat;
}

export const UpdateTutorChatModal = () => {
	const { isOpen, close, state } = useModal(MODALS.UPDATE_TUTOR_CHAT);

	const { mutate: updateTutorChat } = useMutation(getUpdateTutorChatMutationOptions());

	const handleUpdate = (updateData: TUpdateTutorChatInput) => {
		const changedFields = Object.keys(updateData).reduce(
			(acc, key) => {
				const fieldKey = key as keyof TUpdateTutorChatInput;
				if (updateData[fieldKey] !== state.data[fieldKey]) {
					acc[fieldKey] = updateData[fieldKey];
				}
				return acc;
			},
			{} as Partial<TUpdateTutorChatInput>
		);

		const finalUpdateData = {
			id: updateData.id,
			...changedFields
		} as TUpdateTutorChatInput;

		updateTutorChat(finalUpdateData, {
			onSuccess: () => {
				close();
				toast.success("Tutor chat updated successfully!");
			},
			onError: (error) => {
				if (error instanceof Error) {
					toast.error(error.message);
				}
			}
		});
	};

	if (!state) return null;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
			<DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-2xl">
				<div className="relative border-b px-6 py-4 sm:px-8 sm:py-6">
					<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_80%_at_10%_0%,rgba(56,189,248,0.1),transparent_60%),radial-gradient(60%_60%_at_100%_0%,rgba(16,185,129,0.08),transparent_55%)]" />
					<DialogHeader className="relative text-left">
						<div className="flex items-center gap-4">
							<div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border bg-background/80 shadow-sm">
								<PencilIcon className="size-6 text-foreground" />
							</div>
							<div className="space-y-1">
								<DialogTitle className="text-xl font-bold sm:text-2xl">Update tutor chat</DialogTitle>
								<DialogDescription className="text-sm">
									Modify your tutor's settings to better suit your learning needs.
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>
				</div>

				<div className="relative flex-1 overflow-y-auto px-6 py-6 sm:px-8">
					<TutorChatForm mode={"update"} onSubmit={handleUpdate} defaultValues={state.data} />
				</div>
				<DialogFooter className="border-t bg-muted/30 px-6 py-4 sm:px-8">
					<div className="flex w-full items-center justify-between">
						<Button variant="ghost" type="button" className="h-9 px-4 text-sm font-medium" onClick={close}>
							Cancel
						</Button>
						<Button type="submit" form={tutorChatFormId} className="h-9 px-5 text-sm font-bold">
							Save changes
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
