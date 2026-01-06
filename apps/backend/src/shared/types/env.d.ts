import type { Env } from "@/shared/config";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
