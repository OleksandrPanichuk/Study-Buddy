import { Button } from "@repo/ui";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getSignOutMutationOptions, useAuth } from "@/features/auth";

export const Header = () => {
	const user = useAuth((state) => state.user);
	const setUser = useAuth((state) => state.setUser);
	const { mutate: signOut } = useMutation(getSignOutMutationOptions(setUser));
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
					<div>
						<Button variant={"ghost"} withRipple={false} asChild>
							<Link to={"/dashboard"}>Dashboard</Link>
						</Button>
						<Button variant={"default"} onClick={() => signOut()}>
							Sign Out
						</Button>
					</div>
				)}
			</div>
		</header>
	);
};
