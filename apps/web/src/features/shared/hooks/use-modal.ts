import {useCallback} from "react";
import {useShallow} from "zustand/react/shallow";
import type {MODALS} from "@/features/shared";
import {type ModalRegistry, type ModalState, useModalStore} from "@/features/shared";

type ModalKey = (typeof MODALS)[keyof typeof MODALS];

export const useModal = <K extends ModalKey>(key: K) => {
	const { isOpen, state } = useModalStore(
		useShallow((store) => ({
			isOpen: Object.hasOwn(store.activeModals, key),
			state: store.activeModals[key] as ModalState<K>
		}))
	);

	const openModal = useModalStore((s) => s.openModal);
	const closeModal = useModalStore((s) => s.closeModal);

	const open = useCallback(
		(...args: K extends keyof ModalRegistry ? [state: ModalRegistry[K]] : []) => {
			openModal(key, ...args);
		},
		[key, openModal]
	);

	const close = useCallback(() => {
		closeModal(key);
	}, [key, closeModal]);

	return {
		isOpen,
		open,
		close,
		state
	};
};
