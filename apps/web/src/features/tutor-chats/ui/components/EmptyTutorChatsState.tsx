import {Button} from "@repo/ui";
import {MessageSquarePlusIcon, MessagesSquareIcon} from "lucide-react";
import {MODALS, useModal} from "@/features/shared";

export const EmptyChatsState = () => {
	const { open } = useModal(MODALS.CREATE_TUTOR_CHAT);
	return (
		<div className=" m-4 flex flex-col items-center justify-center rounded-lg border bg-card p-12 text-center">
			<div className="flex size-20 items-center justify-center rounded-full bg-primary/10 mb-6">
				<MessagesSquareIcon className="size-10 text-primary" />
			</div>
			<h3 className="text-xl font-semibold mb-2">No chats yet</h3>
			<p className="text-sm text-muted-foreground mb-6 max-w-sm">
				Start a new conversation with an AI tutor to get help with your studies. Ask questions, get explanations, and
				learn at your own pace.
			</p>
			<Button onClick={open} className="gap-2">
				<MessageSquarePlusIcon className="size-4" />
				Start Your First Chat
			</Button>
		</div>
	);
};
