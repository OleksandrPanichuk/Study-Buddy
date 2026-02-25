import { MessagesList, PromptInput } from "@/features/tutor-chat";

interface ITutorChatViewProps {
	tutorChatId: string;
}

export const TutorChatView = ({ tutorChatId }: ITutorChatViewProps) => {
	return (
		<div className={"relative h-full w-full flex flex-col overflow-hidden"}>
			<div className="flex-1 min-h-0">
				<MessagesList tutorChatId={tutorChatId} />
			</div>
			<div
				className={"shrink-0 px-4 pb-4 pt-2 bg-background/80 backdrop-blur-sm"}
			>
				<div className="mx-auto max-w-4xl">
					<PromptInput tutorChatId={tutorChatId} />
				</div>
			</div>
		</div>
	);
};
