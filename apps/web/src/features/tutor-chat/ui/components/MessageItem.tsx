import type { TMessage } from "@repo/schemas";
import { cn, Message, MessageContent, MessageResponse } from "@repo/ui";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";

interface IMessageItemProps {
	message: TMessage;
}

export const MessageItem = ({ message }: IMessageItemProps) => {
	const isAssistant = message.role === "ASSISTANT";
	const isProcessing = isAssistant && message.status === "PROCESSING";
	const isFailed = isAssistant && message.status === "FAILED";

	return (
		<Message from={isAssistant ? "assistant" : "user"}>
			<MessageContent>
				{isAssistant ? <MessageResponse>{message.content}</MessageResponse> : message.content}

				{isProcessing && (
					<div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
						<Loader2Icon className="size-3 animate-spin" />
						<span>Generating response...</span>
					</div>
				)}

				{isFailed && (
					<div className={cn("mt-1 inline-flex items-center gap-1 text-xs text-destructive")}>
						<AlertCircleIcon className="size-3" />
						<span>Failed to generate response.</span>
					</div>
				)}
			</MessageContent>
		</Message>
	);
};
