import {google} from "@ai-sdk/google";
import {IGenerateOptions} from "@app/ai/ai.interfaces";
import {HttpException, Injectable, InternalServerErrorException, Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {embedMany, generateText, streamText} from "ai";
import type {Env} from "@/shared/config";

@Injectable()
export class AIService {
	private readonly logger = new Logger(AIService.name);

	constructor(private readonly config: ConfigService<Env>) {}

	public async createEmbeddings(inputs: string[], model?: string) {
		const modelSpec = model ?? this.config.get("AI_EMBEDDING_MODEL");

		if (!modelSpec) {
			throw new InternalServerErrorException(
				"AI embedding model not configured. Set AI_EMBEDDING_MODEL in environment variables."
			);
		}

		try {
			const result = await embedMany({
				model: google.embeddingModel(modelSpec),
				values: inputs,
				maxRetries: 3,
				maxParallelCalls: 4
			});

			if (!result.embeddings) {
				this.logger.error("embedMany returned unexpected result", result);

				throw new InternalServerErrorException("Embedding provider returned no embeddigns");
			}
			return result.embeddings as number[][];
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}

			this.logger.error("Failed to create embeddings", error);
			throw new InternalServerErrorException(
				"Failed to create embeddings",
				error instanceof Error ? error.message : undefined
			);
		}
	}

	public streamText(options: IGenerateOptions): ReturnType<typeof streamText> {
		const { maxOutputTokens = 4096, temperature = 0.7, model, ...rest } = options;

		const modelSpec = model ?? this.config.get("AI_DEFAULT_MODEL");

		return streamText({
			model: google(modelSpec),
			maxOutputTokens,
			temperature,
			...rest
		});
	}

	public generateText(options: IGenerateOptions): ReturnType<typeof generateText> {
		const { maxOutputTokens = 4096, temperature = 0.7, model, ...rest } = options;

		const modelSpec = model ?? this.config.get("AI_DEFAULT_MODEL");

		return generateText({
			model: google(modelSpec),
			maxOutputTokens,
			temperature,
			...rest
		});
	}
}
