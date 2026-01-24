import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Button,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@repo/ui";
import {Link, useLocation} from "@tanstack/react-router";
import {GraduationCapIcon, ListIcon, PlusIcon} from "lucide-react";
import {studySessionsSidebarItems} from "@/features/platform";

export const StudySessionsSection = () => {
	const location = useLocation();
	return (
		<AccordionItem value="sessions" className="border-none">
			<AccordionTrigger className="py-2 px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline rounded-md [&>svg:last-child]:size-4 [&>svg:last-child]:shrink-0 [&>svg:last-child]:text-sidebar-foreground/50">
				<div className="flex items-center gap-2">
					<GraduationCapIcon className="size-4" />
					<span>Study Sessions</span>
				</div>
			</AccordionTrigger>
			<AccordionContent className="pb-0 pl-2">
				<SidebarMenuSubButton className="mb-1" asChild>
					<Button variant={"ghost"} className="justify-start w-full px-2!">
						<PlusIcon className="size-4 mr-0.5" />
						<span>New Session</span>
					</Button>
				</SidebarMenuSubButton>
				<SidebarMenuSubButton
					className="mb-1"
					asChild
					isActive={location.pathname === "/d/sessions"}
				>
					<Button
						variant={"ghost"}
						className="w-full justify-start px-2!"
						asChild
					>
						{/*TODO: replace with proper url*/}
						<Link to="/">
							<ListIcon className="size-4 mr-0.5" />
							<span>View All</span>
						</Link>
					</Button>
				</SidebarMenuSubButton>
				<SidebarMenuSub>
					{studySessionsSidebarItems.map((item) => (
						<SidebarMenuSubItem key={item.title}>
							<SidebarMenuSubButton
								asChild
								isActive={location.pathname === item.href}
							>
								<Link to={item.href}>
									<span>{item.title}</span>
								</Link>
							</SidebarMenuSubButton>
						</SidebarMenuSubItem>
					))}
				</SidebarMenuSub>
			</AccordionContent>
		</AccordionItem>
	);
};
