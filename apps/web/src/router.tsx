import {QueryClient} from "@tanstack/react-query";
import {createRouter} from "@tanstack/react-router";
import {setupRouterSsrQueryIntegration} from "@tanstack/react-router-ssr-query";
import {routeTree} from "./routeTree.gen";


import "@repo/ui/globals.css"

export type TRouterContext = {
	queryClient: QueryClient;
};

export const getRouter = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000
			}
		}
	});

	const router = createRouter({
		routeTree,
		context: {
			queryClient
		} satisfies TRouterContext,
		defaultPreload: "intent",
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient
	});

	return router;
};
