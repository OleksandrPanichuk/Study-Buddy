import {SidebarInset, SidebarProvider, SidebarTrigger} from "@repo/ui";
import {Outlet} from "@tanstack/react-router";
import {PlatformSidebar} from "@/features/platform";

interface IPlatformLayoutProps {
	defaultSidebarOpen?: boolean;
}

export const PlatformLayout = ({
	defaultSidebarOpen,
}: IPlatformLayoutProps) => {
	return (
		<SidebarProvider defaultOpen={defaultSidebarOpen}>
			<PlatformSidebar />
			<SidebarInset>
				{/*TODO: remove*/}
				<SidebarTrigger />

				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
};
