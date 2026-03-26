import {UpdateTutorChatModal} from "@/features/tutor-chats";
import {CreateTutorChatModal, TutorChatContextFilesModal} from "@/features/tutor-chat";

export const ModalsRoot = () => {
	return (
		<>
			<CreateTutorChatModal />
			<UpdateTutorChatModal />
			<TutorChatContextFilesModal />
		</>
	);
};
