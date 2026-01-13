import {SessionOptions} from "express-session";
import {ConfigService} from "@nestjs/config";
import {Env} from "./env.config";
import {RedisStore} from "connect-redis";
import Redis from "ioredis";
import {SESSION_COOKIE_NAME, SESSION_MAX_AGE, SESSION_REDIS_PREFIX,} from "@/shared/constants";

export const getSessionConfig = (config: ConfigService<Env>): SessionOptions => {
	const redis = new Redis(config.get("REDIS_URL")!);

	return {
		secret: config.get("SESSION_SECRET")!,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: config.get("NODE_ENV") === "production",
			maxAge: SESSION_MAX_AGE
		},
		name: SESSION_COOKIE_NAME,
		store: new RedisStore({
			client: redis,
			ttl: SESSION_MAX_AGE / 1000,
			prefix: SESSION_REDIS_PREFIX
		}),
		rolling: true
	};
};
