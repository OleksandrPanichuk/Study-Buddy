import type {IContextFilesModalData} from "@/features/files";
import type {MODALS} from "@/features/shared/constants.ts";
import type {IUpdateTutorChatModalData} from "@/features/tutor-chat";

export type ModalRegistry = {
	[MODALS.UPDATE_TUTOR_CHAT]: IUpdateTutorChatModalData;
	[MODALS.CONTEXT_FILES]: IContextFilesModalData;
};

export type ModalKey = (typeof MODALS)[keyof typeof MODALS];

export type ModalState<K extends ModalKey> = K extends keyof ModalRegistry ? ModalRegistry[K] : never;
export type ModalOpenArgs<K extends ModalKey> = K extends keyof ModalRegistry ? [state: ModalRegistry[K]] : [];
