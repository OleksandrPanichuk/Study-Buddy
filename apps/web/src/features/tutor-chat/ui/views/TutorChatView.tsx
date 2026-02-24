import {PromptInput} from "@/features/tutor-chat";

interface ITutorChatViewProps {
	tutorChatId: string;
}

export const TutorChatView = ({ tutorChatId }: ITutorChatViewProps) => {
	return (
		<div className={"max-w-4xl mx-auto h-full w-full"}>
			<div className={"flex flex-col justify-end h-full p-4"}>
			
					<PromptInput tutorChatId={tutorChatId} />
			</div>
		</div>
	);
};
