const Sentry = require("@sentry/nestjs");
const dotenv = require("dotenv");

dotenv.config();

if (process.env.SENTRY_DSN) {
	const isBunRuntime = "Bun" in globalThis;
	const profilingEnabled = process.env.SENTRY_ENABLE_PROFILING === "true";

	if (!isBunRuntime && profilingEnabled) {
		const { nodeProfilingIntegration } = require("@sentry/profiling-node");

		Sentry.init({
			dsn: process.env.SENTRY_DSN,
			integrations: [nodeProfilingIntegration()],
			tracesSampleRate: 1.0,
			profilesSampleRate: 1.0
		});
	} else {
		Sentry.init({
			dsn: process.env.SENTRY_DSN,
			tracesSampleRate: 1.0
		});
	}
}
