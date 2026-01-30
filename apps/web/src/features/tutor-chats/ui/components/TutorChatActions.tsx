import type {TTutorChat} from "@repo/schemas";
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@repo/ui";
import {MoreHorizontalIcon, PencilIcon, Trash2Icon} from "lucide-react";

interface ITutorChatActionsProps {
	data: TTutorChat;
}

// TODO: implement edit and delete functionality
export const TutorChatActions = ({ data }: ITutorChatActionsProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity">
					<MoreHorizontalIcon className="size-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuItem>
					<PencilIcon className="size-4 mr-2" />
					Edit
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-destructive focus:text-destructive">
					<Trash2Icon className="size-4 mr-2" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
