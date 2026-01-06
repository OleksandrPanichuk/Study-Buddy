import { z } from "zod";

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
});

export type Env = z.infer<typeof envSchema>;
