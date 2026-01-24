import {
	Accordion,
	Avatar,
	AvatarFallback,
	AvatarImage,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@repo/ui";
import {Link} from "@tanstack/react-router";
import {BotIcon, ChevronsUpDownIcon} from "lucide-react";
import {
	generalSidebarItems,
	LibrarySection,
	StudySessionsSection,
	TutorChatsSection,
	UserMenu,
} from "@/features/platform";

export const PlatformSidebar = () => {
	return (
		<Sidebar collapsible={"offcanvas"}>
			<SidebarHeader className="p-4">
				<div className="flex items-center gap-2 px-1">
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<BotIcon className="size-5" />
					</div>
					<div className="flex flex-col gap-0.5 leading-none">
						<span className="font-semibold">Study Buddy</span>
						<span className="text-xs text-muted-foreground">
							AI Learning Platform
						</span>
					</div>
				</div>
			</SidebarHeader>
			<SidebarSeparator className="mx-0" />
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>General</SidebarGroupLabel>
					<SidebarMenu>
						{generalSidebarItems.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									className="h-auto"
									isActive={location.pathname === item.href}
									tooltip={item.title}
									asChild
								>
									<Link to={item.href}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>

				{/*	Learning Group*/}
				<SidebarGroup>
					<SidebarGroupLabel>Learning</SidebarGroupLabel>
					<SidebarMenu>
						<Accordion type="multiple" className="w-full">
							{/* Tutor Chats */}
							<TutorChatsSection />

							{/* Study Sessions */}
							<StudySessionsSection />

							{/* Library */}
							<LibrarySection />
						</Accordion>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<UserMenu>
					{(data) => (
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="size-8 rounded-lg">
								<AvatarImage
									src={data?.avatar?.url ?? undefined}
									alt={data?.username ?? "User"}
								/>
								<AvatarFallback className="rounded-lg">
									{data?.username?.charAt(0).toUpperCase() ?? "U"}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{data?.username ?? "Guest"}
								</span>
								<span className="truncate text-xs">{data?.email ?? ""}</span>
							</div>
							<ChevronsUpDownIcon className="ml-auto size-4" />
						</SidebarMenuButton>
					)}
				</UserMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
};
