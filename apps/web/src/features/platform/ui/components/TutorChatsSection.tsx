import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Button,
	SidebarMenuSkeleton,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from "@repo/ui";
import {useQuery} from "@tanstack/react-query";
import {Link, useLocation} from "@tanstack/react-router";
import {ListIcon, MessageSquareIcon, PlusIcon} from "lucide-react";
import {MODALS, useModal} from "@/features/shared";
import {getTutorChatsQueryOptions} from "@/features/tutor-chats";

export const TutorChatsSection = () => {
	const location = useLocation();

	const { data, isFetching } = useQuery(getTutorChatsQueryOptions({ limit: 10 }));

	const { open } = useModal(MODALS.CREATE_TUTOR_CHAT);

	return (
		<AccordionItem value="chats" className="border-none">
			<AccordionTrigger className="py-2 px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline rounded-md [&>svg:last-child]:size-4 [&>svg:last-child]:shrink-0 [&>svg:last-child]:text-sidebar-foreground/50">
				<div className="flex items-center gap-2">
					<MessageSquareIcon className="size-4" />
					<span>Tutor Chats</span>
				</div>
			</AccordionTrigger>
			<AccordionContent className="pb-0 pl-2">
				<SidebarMenuSubButton className="mb-1" asChild>
					<Button
						variant={"ghost"}
						className="w-full justify-start px-2!"
						onClick={() => {
							// 	TODO:
							open();
						}}>
						<PlusIcon className="size-4 mr-0.5" />
						<span>New Chat</span>
					</Button>
				</SidebarMenuSubButton>
				<SidebarMenuSubButton className="mb-1" asChild isActive={location.pathname === "/d/chats"}>
					<Button variant={"ghost"} className="w-full justify-start px-2!" asChild>
						{/*TODO: change with proper url*/}
						<Link to="/">
							<ListIcon className="size-4 mr-0.5" />
							<span>View All</span>
						</Link>
					</Button>
				</SidebarMenuSubButton>
				<SidebarMenuSub>
					{data?.slice(0, 10).map((item) => (
						<SidebarMenuSubItem key={item.id}>
							<SidebarMenuSubButton isActive={location.pathname === `/p/tutor-chats/${item.id}`} asChild>
								<Link to={"/p/tutor-chats/$tutorChatId"} params={{ tutorChatId: item.id }}>
									<span className={"truncate"}>{item.name.trim()}</span>
								</Link>
							</SidebarMenuSubButton>
						</SidebarMenuSubItem>
					))}
					{isFetching &&
						Array.from({ length: 10 }).map((_, index) => (
							<SidebarMenuSubItem key={index}>
								<SidebarMenuSkeleton />
							</SidebarMenuSubItem>
						))}
					{!(data?.length || isFetching) && (
						<SidebarMenuSubItem>
							<span className="text-sm text-sidebar-foreground/50 italic">No chats found</span>
						</SidebarMenuSubItem>
					)}
				</SidebarMenuSub>
			</AccordionContent>
		</AccordionItem>
	);
};
