import {create} from "zustand";
import type {MODALS} from "@/features/shared";
import type {ITutorChatContextFilesModalData, IUpdateTutorChatModalData} from "@/features/tutor-chat";

export type ModalRegistry = {
	[MODALS.UPDATE_TUTOR_CHAT]: IUpdateTutorChatModalData;
	[MODALS.TUTOR_CHAT_CONTEXT_FILES]: ITutorChatContextFilesModalData;
};

type ModalKey = (typeof MODALS)[keyof typeof MODALS];

export type ModalState<K extends ModalKey> = K extends keyof ModalRegistry ? ModalRegistry[K] : never;
export type ModalOpenArgs<K extends ModalKey> = K extends keyof ModalRegistry ? [state: ModalRegistry[K]] : [];

interface ModalStore {
	activeModals: Partial<Record<ModalKey, unknown>>;
	openModal: <K extends ModalKey>(key: K, ...args: ModalOpenArgs<K>) => void;
	closeModal: (key: ModalKey) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
	activeModals: {},
	openModal: (key, ...args) =>
		set((store) => ({
			activeModals: { ...store.activeModals, [key]: args[0] }
		})),
	closeModal: (key) =>
		set((store) => {
			const newModals = { ...store.activeModals };
			delete newModals[key];
			return { activeModals: newModals };
		})
}));
