import {Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@repo/ui";
import {Link} from "@tanstack/react-router";
import {AlertCircleIcon} from "lucide-react";

export const InvalidResetTokenView = () => {
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<div className="flex items-center gap-2">
					<AlertCircleIcon className="h-6 w-6 text-destructive" />
					<CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
				</div>
				<CardDescription>The password reset link you used is either invalid or has expired.</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground">
					Password reset links are only valid for a limited time. If you still need to reset your password, please
					request a new reset link from the forgot password page.
				</p>
			</CardContent>
			<CardFooter className="flex flex-col gap-2">
				<Button asChild className="w-full">
					<Link to="/sign-in">Go to Sign In</Link>
				</Button>
				<Button variant="outline" asChild className="w-full">
					<Link to="/forgot-password">Request New Reset Link</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};
