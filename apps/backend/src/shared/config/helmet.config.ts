import { ConfigService } from "@nestjs/config";
import { HelmetOptions } from "helmet";
import { Env } from "./env.config";



export const getHelmetConfig = (config: ConfigService<Env>): HelmetOptions => {
	const baseUrl = config.get("BASE_URL") as string;
	return {
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
				fontSrc: ["'self'", "https://fonts.gstatic.com"],
				imgSrc: ["'self'", "data:", "https:"],
				scriptSrc: ["'self'"],
				connectSrc: ["'self'", "wss:", "ws:", baseUrl]
			}
		},
		crossOriginEmbedderPolicy: false
	};
};
