import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import type {Ref} from "react";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function mergeRefs<T>(...refs: (Ref<unknown> | undefined)[]) {
	return (node: T) => {
		for (const ref of refs) {
			if (ref && typeof ref === "object") {
				ref.current = node;
			}
		}
	};
}
