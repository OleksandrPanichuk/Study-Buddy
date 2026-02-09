import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { type Profile, Strategy } from "passport-github2";
import { STRATEGIES } from "@/auth/auth.constants";
import { getCallbackUrl } from "@/auth/auth.helpers";
import type { TOAuthUser } from "@/auth/auth.types";
import type { Env } from "@/shared/config";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, STRATEGIES.GITHUB) {
	private readonly logger = new Logger(GithubStrategy.name);

	constructor(readonly config: ConfigService<Env>) {
		super({
			clientID: config.get("GITHUB_CLIENT_ID") as string,
			clientSecret: config.get("GITHUB_CLIENT_SECRET") as string,
			callbackURL: getCallbackUrl("github", config),
			scope: ["user:email"]
		});
	}

	validate(_at: string, _rt: string, profile: Profile, done: (err: unknown, user: TOAuthUser | null) => void) {
		this.logger.debug(`Authenticating Github user: ${profile.id}`);

		const { emails, photos, displayName, username } = profile;

		const email = emails?.[0]?.value;
		const photo = photos?.[0]?.value;

		if (!(email && photo)) {
			this.logger.warn(`Github user ${profile.id} has no email or photo`);
			return done(new UnauthorizedException("Incomplete Github profile"), null);
		}

		const user: TOAuthUser = {
			email,
			avatar: {
				url: photo
			},
			username: username || displayName
		};

		return done(null, user);
	}
}
