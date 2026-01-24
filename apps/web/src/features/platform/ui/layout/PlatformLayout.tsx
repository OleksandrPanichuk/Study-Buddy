import {SidebarInset, SidebarProvider, SidebarTrigger} from "@repo/ui";
import {Outlet} from "@tanstack/react-router";
import {PlatformSidebar} from "@/features/platform";

export const PlatformLayout = () => {
	return (
		<SidebarProvider>
			<PlatformSidebar />
			<SidebarInset>
				{/*TODO: remove*/}
				<SidebarTrigger />

				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
};
