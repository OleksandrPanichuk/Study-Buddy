import {SidebarInset, SidebarProvider} from "@repo/ui";
import {Outlet} from "@tanstack/react-router";
import {Header, PlatformSidebar} from "@/features/platform";

interface IPlatformLayoutProps {
	defaultSidebarOpen?: boolean;
}

export const PlatformLayout = ({ defaultSidebarOpen }: IPlatformLayoutProps) => {
	return (
		<SidebarProvider defaultOpen={defaultSidebarOpen}>
			<PlatformSidebar />
			<SidebarInset>
				<Header />
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
};
