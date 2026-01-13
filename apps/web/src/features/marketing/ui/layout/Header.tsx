import {Button} from "@repo/ui";
import {Link} from "@tanstack/react-router";
import {useAuth} from "@/features/auth";

export const Header = () => {
	const user = useAuth((state) => state.user);
	return (
		<header className="p-4 flex items-center gap-2 justify-between border-b">
			<h1>Header</h1>

			<nav>Navigation</nav>
			<div>
				{!user ? (
					<Button variant={"ghost"} withRipple={false} asChild>
						<Link to="/sign-in">Sign In</Link>
					</Button>
				) : (
					<Button variant={"ghost"} withRipple={false} asChild>
						<Link to={"/dashboard"}>Dashboard</Link>
					</Button>
				)}
			</div>
		</header>
	);
};
