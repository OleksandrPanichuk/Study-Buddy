import {useCallback} from "react";
import {useShallow} from "zustand/react/shallow";
import type {MODALS} from "@/features/shared";
import {type ModalOpenArgs, type ModalState, useModalStore} from "@/features/shared";

type ModalKey = (typeof MODALS)[keyof typeof MODALS];

export const useModal = <K extends ModalKey>(key: K) => {
	const { isOpen, state } = useModalStore(
		useShallow((store) => ({
			isOpen: Object.hasOwn(store.activeModals, key),
			state: store.activeModals[key] as ModalState<K> | undefined
		}))
	);

	const open = useCallback(
		(...args: ModalOpenArgs<K>) => {
			useModalStore.getState().openModal(key, ...args);
		},
		[key]
	);

	const close = useCallback(() => {
		useModalStore.getState().closeModal(key);
	}, [key]);

	return {
		isOpen,
		open,
		close,
		state
	};
};
