import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { signInInputSchema } from "@repo/schemas";
import { Strategy } from "passport-local";
import { STRATEGIES } from "@/auth/auth.constants";
import { AuthService } from "@/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, STRATEGIES.LOCAL) {
	private readonly logger = new Logger(LocalStrategy.name);
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: "email"
		});
	}

	async validate(email: string, password: string) {
		this.logger.debug(`Authenticating local user: ${email}`);

		try {
			signInInputSchema.parse({ email, password });
		} catch {
			this.logger.warn(`Validation failed for local user: ${email}`);
			throw new UnauthorizedException("Invalid credentials");
		}

		try {
			const user = await this.authService.singIn({ email, password });
			this.logger.debug(`Successfully authenticated user: ${email}`);
			return user;
		} catch (error) {
			this.logger.warn(`Authentication failed for user: ${email}`);
			throw error;
		}
	}
}
