import { ConfigService } from "@nestjs/config";
import type { Env } from "@/shared/config";

export function getCallbackUrl(
  type: "google" | "github",
  config: ConfigService<Env>,
) {
  return `${config.get("BASE_URL")}/api/auth/callback/${type}`;
}
