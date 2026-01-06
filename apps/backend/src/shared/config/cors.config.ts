import { ConfigService } from "@nestjs/config";
import { Env } from "./env.config";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const getCorsConfig = (config: ConfigService<Env>): CorsOptions => {
	return {
		credentials: true,
		origin: config.get("WEB_URL"),
	};
};
