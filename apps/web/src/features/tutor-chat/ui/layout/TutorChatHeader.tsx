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
import {useNavigate} from "@tanstack/react-router";
import {ChevronLeftIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon} from "lucide-react";
import {toast} from "sonner";
import {MODALS, useConfirm, useModal} from "@/features/shared";
import {getDeleteTutorChatMutationOptions} from "@/features/tutor-chats";

interface ITutorChatHeaderProps {
	tutorChat: TTutorChat;
}

export const TutorChatHeader = ({ tutorChat }: ITutorChatHeaderProps) => {
	const navigate = useNavigate();
	const [ConfirmationModal, confirm] = useConfirm({
		title: "Delete this chat?",
		message: "This action cannot be undone. All messages in this chat will be permanently deleted."
	});
	const { open: openEdit } = useModal(MODALS.UPDATE_TUTOR_CHAT);
	const { mutate: deleteTutorChat } = useMutation(getDeleteTutorChatMutationOptions());

	const handleDelete = async () => {
		const ok = await confirm();
		if (!ok) return;

		deleteTutorChat(
			{ tutorChatId: tutorChat.id },
			{
				onSuccess: () => {
					toast.success("Chat deleted");
					navigate({ to: "/p/tutor-chats" });
				},
				onError: (error) => {
					if (error instanceof Error) toast.error(error.message);
				}
			}
		);
	};

	return (
		<>
			<ConfirmationModal />

			<div className="mx-1 h-5 w-px bg-border shrink-0" />

			<div className="flex min-w-0 flex-1 items-center justify-between gap-2">
				<div className="flex min-w-0 items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						className="size-8 shrink-0"
						onClick={() => navigate({ to: "/p/tutor-chats" })}>
						<ChevronLeftIcon className="size-4" />
						<span className="sr-only">Back to chats</span>
					</Button>

					<div className="min-w-0">
						<p className="truncate text-sm font-semibold leading-tight">{tutorChat.name}</p>
						{tutorChat.topic && <p className="truncate text-xs text-muted-foreground">{tutorChat.topic}</p>}
					</div>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="size-8 shrink-0">
							<MoreHorizontalIcon className="size-4" />
							<span className="sr-only">Chat options</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-40">
						<DropdownMenuItem onClick={() => openEdit({ data: tutorChat })}>
							<PencilIcon className="mr-2 size-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive" onClick={handleDelete}>
							<Trash2Icon className="mr-2 size-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
};
