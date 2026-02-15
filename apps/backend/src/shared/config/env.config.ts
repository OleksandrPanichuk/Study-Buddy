import {z} from "zod";

export const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]),
	PORT: z.coerce.number(),
	BASE_URL: z.url(),
	WEB_URL: z.url(),
	APP_NAME: z.string(),
	SESSION_SECRET: z.string(),
	REDIS_URL: z.url(),

	GITHUB_CLIENT_ID: z.string(),
	GITHUB_CLIENT_SECRET: z.string(),

	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),

	MAIL_HOST: z.string(),
	MAIL_PORT: z.coerce.number(),
	MAIL_USER: z.string(),
	MAIL_PASSWORD: z.string(),
	MAIL_FROM: z.email(),
	SUPPORT_EMAIL: z.email(),

	DATABASE_URL: z.url(),

	AWS_S3_ENDPOINT: z.string(),
	AWS_S3_REGION: z.string(),
	AWS_S3_ACCESS_KEY_ID: z.string(),
	AWS_S3_SECRET_ACCESS_KEY: z.string(),
	AWS_S3_BUCKET_NAME: z.string(),
	AWS_S3_FORCE_PATH_STYLE: z.union([z.literal("true"), z.literal("false")]).transform((v) => v === "true"),

	GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
	AI_EMBEDDING_MODEL: z.string(),
	AI_DEFAULT_MODEL: z.string()
});

export type Env = z.infer<typeof envSchema>;
