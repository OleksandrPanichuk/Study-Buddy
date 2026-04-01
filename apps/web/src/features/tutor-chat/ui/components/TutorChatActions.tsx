import type {TTutorChat} from "@repo/schemas";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@repo/ui";
import {useMutation} from "@tanstack/react-query";
import {FilesIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon} from "lucide-react";
import {toast} from "sonner";
import {MODALS, useConfirm, useModal} from "@/features/shared";
import {getDeleteTutorChatMutationOptions} from "@/features/tutor-chat";

interface ITutorChatActionsProps {
	data: TTutorChat;
}

export const TutorChatActions = ({ data }: ITutorChatActionsProps) => {
	const [ConfirmationModal, confirm] = useConfirm();
	const { open: openEdit } = useModal(MODALS.UPDATE_TUTOR_CHAT);
	const { open: openFiles } = useModal(MODALS.CONTEXT_FILES);

	const { mutate: deleteTutorChat } = useMutation(getDeleteTutorChatMutationOptions());

	const handleDelete = async () => {
		const ok = await confirm();

		if (!ok) return;

		deleteTutorChat(
			{ tutorChatId: data.id },
			{
				onSuccess: () => toast.success("Tutor chat deleted successfully"),
				onError: (error) => {
					if (error instanceof Error) toast.error(error.message);
				}
			}
		);
	};

	return (
		<>
			<ConfirmationModal />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="size-8  shrink-0 transition-opacity">
						<MoreHorizontalIcon className="size-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuItem onClick={() => openEdit({ data })}>
						<PencilIcon className="size-4 mr-2" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => openFiles({ data })}>
						<FilesIcon className={"size-4 mr-2"} />
						Files
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleDelete} variant={"destructive"}>
						<Trash2Icon className="size-4 mr-2" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
