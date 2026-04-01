import {create} from "zustand";
import type {ModalKey, ModalOpenArgs} from "@/features/shared";

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
