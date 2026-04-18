import type {Env} from "@/config";

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}
