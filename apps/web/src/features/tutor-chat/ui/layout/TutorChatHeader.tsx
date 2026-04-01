import type {TTutorChat} from "@repo/schemas";
import {Button} from "@repo/ui";
import {useNavigate} from "@tanstack/react-router";
import {ChevronLeftIcon} from "lucide-react";
import {TutorChatActions} from "@/features/tutor-chat";

interface ITutorChatHeaderProps {
	tutorChat: TTutorChat;
}

export const TutorChatHeader = ({ tutorChat }: ITutorChatHeaderProps) => {
	const navigate = useNavigate();

	return (
		<>
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

				<TutorChatActions data={tutorChat} />
			</div>
		</>
	);
};
