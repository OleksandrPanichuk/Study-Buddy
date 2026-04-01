export type TFileProcessingJobState =
	| "active"
	| "completed"
	| "delayed"
	| "failed"
	| "paused"
	| "prioritized"
	| "waiting"
	| "waiting-children"
	| "missing";

export interface IFileProcessingJobData {
	fileAssetId: string;
	storageKey: string;
}

export interface IWaitForFileJobsOptions {
	timeoutMs?: number;
	pollMs?: number;
	throwOnFailed?: boolean;
}

export interface IWaitForFileJobsResult {
	timedOut: boolean;
	states: Record<string, TFileProcessingJobState>;
	failedJobIds: string[];
	missingJobIds: string[];
}
