import {create} from "zustand";
import type {MODALS} from "@/features/shared";
import type {IUpdateTutorChatModalData} from "@/features/tutor-chats";

export type ModalRegistry = {
	[MODALS.UPDATE_TUTOR_CHAT]: IUpdateTutorChatModalData;
};

type ModalKey = (typeof MODALS)[keyof typeof MODALS];

export type ModalState<K extends ModalKey> = K extends keyof ModalRegistry ? ModalRegistry[K] : never;

interface ModalStore {
	activeModals: Partial<Record<ModalKey, unknown>>;
	openModal: <K extends ModalKey>(key: K, state?: ModalState<K>) => void;
	closeModal: (key: ModalKey) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
	activeModals: {},
	openModal: (key, state) =>
		set((store) => ({
			activeModals: { ...store.activeModals, [key]: state }
		})),
	closeModal: (key) =>
		set((store) => {
			const newModals = { ...store.activeModals };
			delete newModals[key];
			return { activeModals: newModals };
		})
}));
