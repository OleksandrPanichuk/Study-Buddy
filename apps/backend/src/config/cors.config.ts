import {CorsOptions} from "@nestjs/common/interfaces/external/cors-options.interface";
import {ConfigService} from "@nestjs/config";
import {Env} from "@/config/index";

export const getCorsConfig = (config: ConfigService<Env>): CorsOptions => {
	return {
		credentials: true,
		origin: config.get("WEB_URL")
	};
};
