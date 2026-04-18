import {ContextFilesModal} from "@/features/files";
import {CreateTutorChatModal, UpdateTutorChatModal} from "@/features/tutor-chat";

export const ModalsRoot = () => {
	return (
		<>
			<CreateTutorChatModal />
			<UpdateTutorChatModal />
			<ContextFilesModal />
		</>
	);
};
