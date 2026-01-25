import type { TUserWithAvatar } from "@repo/schemas";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@repo/ui";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { BadgeCheckIcon, BellIcon, CreditCardIcon, LogOutIcon, SparklesIcon } from "lucide-react";
import type { ReactNode } from "react";
import { getSignOutMutationOptions } from "@/features/auth";
import { useUser } from "@/hooks";

interface IUserMenuProps {
	side?: "right" | "left" | "top" | "bottom";
	align?: "start" | "center" | "end";
	children: (data: TUserWithAvatar | null) => ReactNode;
}

export const UserMenu = ({ side, align, children }: IUserMenuProps) => {
	const navigate = useNavigate();
	const user = useUser();

	const { mutate: signOut } = useMutation({
		...getSignOutMutationOptions(),
		onSuccess: async (...args) => {
			getSignOutMutationOptions().onSuccess?.(...args);
			await navigate({ to: "/sign-in" });
		}
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children(user)}</DropdownMenuTrigger>
			<DropdownMenuContent side={side} align={align} className="w-(--radix-dropdown-menu-trigger-width) min-w-56">
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage src={user?.avatar?.url ?? undefined} alt={user?.username ?? "User"} />
							<AvatarFallback className="rounded-lg">{user?.username?.charAt(0).toUpperCase() ?? "U"}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">{user?.username}</span>
							<span className="truncate text-xs">{user?.email ?? ""}</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<SparklesIcon className="mr-2 size-4" />
						Upgrade to Pro
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				{/*TODO: add links to items*/}
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<BadgeCheckIcon className="mr-2 size-4" />
						Account
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CreditCardIcon className="mr-2 size-4" />
						Billing
					</DropdownMenuItem>
					<DropdownMenuItem>
						<BellIcon className="mr-2 size-4" />
						Notifications
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => signOut()} variant={"destructive"}>
					<LogOutIcon />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
