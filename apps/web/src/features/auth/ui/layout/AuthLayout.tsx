import { Outlet } from "@tanstack/react-router";
import { motion, useMotionTemplate, useSpring } from "motion/react";
import type { MouseEvent } from "react";

export const AuthLayout = () => {
	const mouseX = useSpring(0, { stiffness: 150, damping: 25 });
	const mouseY = useSpring(0, { stiffness: 150, damping: 25 });

	const backgroundGradient = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.25), transparent 60%)`;

	function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
		const { left, top } = currentTarget.getBoundingClientRect();

		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}

	return (
		<div
			className="relative overflow-hidden bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950"
			onMouseMove={handleMouseMove}>
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob" />
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000" />
				<div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000" />
				<div className="absolute top-2/3 left-2/3   w-80 h-80 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000" />

				<motion.div
					className="absolute inset-0 "
					style={{
						background: backgroundGradient
					}}
				/>
			</div>

			<div
				className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.08]"
				style={{
					backgroundImage: `
						linear-gradient(to right, rgb(148 163 184) 1px, transparent 1px),
						linear-gradient(to bottom, rgb(148 163 184) 1px, transparent 1px)
					`,
					backgroundSize: "40px 40px"
				}}
			/>

			<div className="relative z-10 w-full px-4 flex justify-center items-center  min-h-screen">
				<Outlet />
			</div>
		</div>
	);
};
