import type {TRouterContext} from "@/router";
import appCss from "@repo/ui/globals.css?url";
import {TanStackDevtools} from "@tanstack/react-devtools";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtoolsPanel} from "@tanstack/react-query-devtools";
import {createRootRouteWithContext, HeadContent, Outlet, Scripts, useRouter} from "@tanstack/react-router";
import {TanStackRouterDevtoolsPanel} from "@tanstack/react-router-devtools";
import type {PropsWithChildren} from "react";
import {Toaster} from "sonner";
import {AuthProvider} from "@/features/auth/providers";

export const Route = createRootRouteWithContext<TRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8"
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				title: "TanStack Start Starter"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss
			}
		]
	}),

	shellComponent: RootDocument,
	component: RootLayout,
	loader: async () => {
		// 	TODO: fetch current user info
	}
});

function RootLayout() {
	// TODO: get initialUser from Route loader
	const router = useRouter();
	return (
		<QueryClientProvider client={router.options.context.queryClient}>
			<AuthProvider initialUser={null}>
				<Outlet />
			</AuthProvider>
		</QueryClientProvider>
	);
}

function RootDocument({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Toaster richColors />
				<TanStackDevtools
					config={{
						position: "bottom-left"
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />
						},
						{
							name: "Tanstack Query",
							render: <ReactQueryDevtoolsPanel />
						}
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
