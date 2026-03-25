import {Avatar, AvatarFallback, AvatarImage, Button, SidebarTrigger} from "@repo/ui";
import {useMatches} from "@tanstack/react-router";
import {UserMenu} from "@/features/platform";

export const Header = () => {
	const matches = useMatches();

	const match = [...matches].reverse().find((m) => m.staticData?.headerComponent);

	const HeaderComponent = match?.staticData?.headerComponent ?? null;
	const showUserMenu = match?.staticData?.headerShowUserMenu ?? true;

	return (
		<header className="flex items-center justify-between border-b px-4 py-3.25">
			<div className="flex min-w-0 items-center gap-2 w-full">
				<SidebarTrigger className="shrink-0" />
				{HeaderComponent && <HeaderComponent />}
			</div>

			{showUserMenu && (
				<UserMenu align="end">
					{(data) => (
						<Button variant="ghost" size="icon-lg">
							<Avatar className="size-8">
								<AvatarImage src={data?.avatar?.url} alt={data?.username ?? "avatar"} />
								<AvatarFallback>{data?.username?.at(0)?.toUpperCase()}</AvatarFallback>
							</Avatar>
						</Button>
					)}
				</UserMenu>
			)}
		</header>
	);
};
