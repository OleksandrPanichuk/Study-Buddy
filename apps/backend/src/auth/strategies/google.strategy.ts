import { PassportStrategy } from "@nestjs/passport";
import { type Profile, Strategy } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import type { Env } from "@/shared/config";
import { getCallbackUrl } from "@/auth/auth.helpers";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import type { TOAuthUser } from "../auth.types";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(readonly config: ConfigService<Env>) {
    super({
      clientID: config.get("GOOGLE_CLIENT_ID") as string,
      clientSecret: config.get("GOOGLE_CLIENT_SECRET") as string,
      scope: ["email", "profile"],
      callbackURL: getCallbackUrl("google", config),
    });
  }

  validate(
    _at: string,
    _rt: string,
    profile: Profile,
    done: (err: unknown, user: TOAuthUser | null) => void,
  ) {
    this.logger.debug(`Authenticating GitHub user: ${profile.id}`);

    const { emails, photos, username, displayName } = profile;

    const email = emails?.[0]?.value;
    const photo = photos?.[0]?.value;

    if (!(email && photo)) {
      this.logger.warn("Missing email or photo in Google profile");
      return done(new UnauthorizedException("Incomplete Google profile"), null);
    }

    const user = {
      email,
      avatar: {
        url: photo,
      },
      username: username || displayName,
    };

    done(null, user);
  }
}
