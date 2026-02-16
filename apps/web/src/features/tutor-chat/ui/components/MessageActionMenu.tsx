import {
    PromptInputActionMenu,
    PromptInputActionMenuContent,
    PromptInputActionMenuItem,
    PromptInputActionMenuTrigger
} from "@repo/ui";

export const MessageActionMenu = () => {
	return (
		<PromptInputActionMenu>
			<PromptInputActionMenuTrigger />
			<PromptInputActionMenuContent>
				<PromptInputActionMenuItem>Item</PromptInputActionMenuItem>
			</PromptInputActionMenuContent>
		</PromptInputActionMenu>
	);
};
