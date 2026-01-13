import {cn} from "@repo/ui";
import {Link} from "@tanstack/react-router";

export const MarketingView = () => {
	return (
		<div>
			Marketing View
			<br />
			<Link to="/about" className={cn()}>
				Link to about
			</Link>
			<Link to="/dashboard">Link to dashboard</Link>
		</div>
	);
};
