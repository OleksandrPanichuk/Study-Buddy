import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from "@repo/ui";
import {Link, useLocation} from "@tanstack/react-router";
import {LibraryIcon} from "lucide-react";
import {librarySidebarItems} from "@/features/platform";

export const LibrarySection = () => {
    const location = useLocation()
	return (
		<AccordionItem value="library" className="border-none">
			<AccordionTrigger className="py-2 px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline rounded-md [&>svg:last-child]:size-4 [&>svg:last-child]:shrink-0 [&>svg:last-child]:text-sidebar-foreground/50">
				<div className="flex items-center gap-2">
					<LibraryIcon className="size-4" />
					<span>Library</span>
				</div>
			</AccordionTrigger>
			<AccordionContent className="pb-0">
				<SidebarMenuSub>
					{librarySidebarItems.map((item) => (
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
