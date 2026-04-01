export enum MessagesSSEEvents {
	STREAM = "message.stream"
}

export enum MessageStreamStatus {
	FAILED = "FAILED",
	STREAMING = "STREAMING",
	COMPLETE = "COMPLETE"
}

export const MESSAGE_GENERATING_QUEUE = "messages";
export const GENERATE_RESPONSE_JOB = "generate-response";
