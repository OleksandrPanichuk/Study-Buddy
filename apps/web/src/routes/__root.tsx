import appCss from "@repo/ui/globals.css?url";
import {QueryClientProvider} from "@tanstack/react-query";
import {createRootRouteWithContext, HeadContent, Outlet, Scripts, useRouter} from "@tanstack/react-router";
import type {PropsWithChildren} from "react";
import {Toaster} from "sonner";
import {ModalsRoot} from "@/features/shared";
import type {TRouterContext} from "@/router";

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
				title: "Study Buddy"
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
	component: RootLayout
});

function RootLayout() {
	const router = useRouter();

	return (
		<QueryClientProvider client={router.options.context.queryClient}>
			<ModalsRoot />
			<Outlet />
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
				{/*<TanStackDevtools*/}
				{/*	config={{*/}
				{/*		position: "bottom-left"*/}
				{/*	}}*/}
				{/*	plugins={[*/}
				{/*		{*/}
				{/*			name: "Tanstack Router",*/}
				{/*			render: <TanStackRouterDevtoolsPanel />*/}
				{/*		},*/}
				{/*		{*/}
				{/*			name: "Tanstack Query",*/}
				{/*			render: <ReactQueryDevtoolsPanel />*/}
				{/*		}*/}
				{/*	]}*/}
				{/*/>*/}
				<Scripts />
			</body>
		</html>
	);
}
