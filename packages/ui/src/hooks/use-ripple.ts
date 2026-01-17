import {useEffect, useEffectEvent, useRef} from "react";

export const useRipple = <T extends HTMLElement = HTMLButtonElement>(
	background = "rgba(255,255,255,0.6)",
) => {
	const ref = useRef<T>(null);

	const handleClick = useEffectEvent((event: PointerEvent) => {
		const target = event.currentTarget as T;

		const rect = target.getBoundingClientRect();

		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		const ripple = document.createElement("span");

		ripple.style.position = "absolute";
		ripple.style.left = `${x}px`;
		ripple.style.top = `${y}px`;
		ripple.style.transform = "translate(-50%, -50%)";
		ripple.style.width = "0";
		ripple.style.height = "0";
		ripple.style.borderRadius = "50%";
		ripple.style.backgroundColor = background;
		ripple.style.pointerEvents = "none";
		ripple.style.animation = "ripple-effect 1s ease-out";

		target.style.position = "relative";
		target.style.overflow = "hidden";
		target.appendChild(ripple);

		ripple.addEventListener("animationend", () => {
			ripple.remove();
		});
	});

	useEffect(() => {
		const el = ref.current;

		if (!el) {
			return;
		}

		el.addEventListener("click", handleClick);

		return () => {
			el.removeEventListener("click", handleClick);
		};
	}, []);

	return ref;
};
