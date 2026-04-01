import {InjectQueue} from "@nestjs/bullmq";
import {ConflictException, Injectable, Logger} from "@nestjs/common";
import {Job, type JobsOptions, Queue} from "bullmq";
import {FILE_PROCESSING_QUEUE, PROCESS_FILE_JOB} from "@/file-processing/file-processing.constants";
import {
	IFileProcessingJobData,
	IWaitForFileJobsOptions,
	IWaitForFileJobsResult,
	TFileProcessingJobState
} from "@/file-processing/file-processing.interfaces";

@Injectable()
export class FileProcessingQueueService {
	private readonly logger = new Logger(FileProcessingQueueService.name);

	constructor(@InjectQueue(FILE_PROCESSING_QUEUE) private readonly fileProcessingQueue: Queue) {}

	public enqueue(data: IFileProcessingJobData, options?: JobsOptions): Promise<Job<IFileProcessingJobData>> {
		return this.fileProcessingQueue.add(PROCESS_FILE_JOB, data, {
			attempts: 3,
			backoff: {
				type: "exponential",
				delay: 2000
			},
			removeOnComplete: true,
			removeOnFail: false,
			...options
		});
	}

	public async enqueueMany(
		items: IFileProcessingJobData[],
		options?: JobsOptions
	): Promise<Job<IFileProcessingJobData>[]> {
		return Promise.all(items.map((item) => this.enqueue(item, options)));
	}

	public async cancel(jobId: string, maxAttempts = 3, backoffMs = 150): Promise<void> {
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			const removed = await this.fileProcessingQueue.remove(jobId);

			if (removed === 1) return;

			if (removed !== 0) {
				throw new ConflictException("Unable to safely cancel file processing job");
			}

			if (attempt < maxAttempts) {
				await this.sleep(backoffMs * attempt);
			}
		}

		throw new ConflictException("File is currently being processed. Try again in a moment.");
	}

	public async waitForJobs(jobIds: string[], opts?: IWaitForFileJobsOptions): Promise<IWaitForFileJobsResult> {
		const timeoutMs = opts?.timeoutMs ?? 10 * 60 * 1000;
		const pollMs = opts?.pollMs ?? 1000;
		const startedAt = Date.now();
		const uniqueJobIds = Array.from(new Set(jobIds.filter(Boolean)));

		if (!uniqueJobIds.length) {
			return {
				timedOut: false,
				states: {},
				failedJobIds: [],
				missingJobIds: []
			};
		}

		while (true) {
			const snapshots = await Promise.all(
				uniqueJobIds.map(async (jobId) => {
					const job = await this.fileProcessingQueue.getJob(jobId);
					if (!job) return {jobId, state: "missing" as TFileProcessingJobState};

					const state = (await job.getState()) as TFileProcessingJobState;
					return {jobId, state};
				})
			);

			const states = Object.fromEntries(snapshots.map((s) => [s.jobId, s.state])) as Record<
				string,
				TFileProcessingJobState
			>;
			const failedJobIds = snapshots.filter((s) => s.state === "failed").map((s) => s.jobId);
			const missingJobIds = snapshots.filter((s) => s.state === "missing").map((s) => s.jobId);

			const pending = snapshots.filter((s) => s.state !== "completed" && s.state !== "failed" && s.state !== "missing");

			if (opts?.throwOnFailed && failedJobIds.length > 0) {
				throw new ConflictException(`One or more file-processing jobs failed: ${failedJobIds.join(", ")}`);
			}

			if (pending.length === 0) {
				return {
					timedOut: false,
					states,
					failedJobIds,
					missingJobIds
				};
			}

			if (Date.now() - startedAt > timeoutMs) {
				this.logger.warn(
					`Timed out waiting for file-processing jobs: ${uniqueJobIds.join(", ")} (states: ${Object.values(states).join(", ")})`
				);

				return {
					timedOut: true,
					states,
					failedJobIds,
					missingJobIds
				};
			}

			await this.sleep(pollMs);
		}
	}

	private async sleep(ms: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, ms));
	}
}
