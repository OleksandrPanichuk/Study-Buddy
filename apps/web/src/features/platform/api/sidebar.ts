import {SIDEBAR_COOKIE_NAME} from "@repo/ui";
import {createServerFn} from "@tanstack/react-start";
import {getCookies} from "@tanstack/react-start/server";

export const getSidebarStateFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const cookies = getCookies();
		return cookies[SIDEBAR_COOKIE_NAME] === "true";
	},
);
