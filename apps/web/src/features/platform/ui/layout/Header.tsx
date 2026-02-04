import {Avatar, AvatarFallback, AvatarImage, Button, SidebarTrigger} from "@repo/ui";
import {UserMenu} from "@/features/platform";

export const Header = () => {
	return (
		<header className={"px-4 py-3.25 items-center flex justify-between border-b"}>
			<SidebarTrigger />
			<UserMenu align={"end"}>
				{(data) => (
					<Button variant={"ghost"} size={"icon-lg"}>
						<Avatar className={"size"}>
							<AvatarImage src={data?.avatar?.url} alt={data?.username ?? "avatar"} />
							<AvatarFallback>{data?.username?.at(0)?.toUpperCase()}</AvatarFallback>
						</Avatar>
					</Button>
				)}
			</UserMenu>
		</header>
	);
};
