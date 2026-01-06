export const RATE_LIMITS = {
	GLOBAL: {
		ttl: 60_000,
		limit: 10
	},
	AUTH: {
		CONTROLLER: {
			ttl: 60_000,
			limit: 5
		}
	},
	PASSWORD: {
		SEND_TOKEN: { ttl: 60_000, limit: 3 },
		RESET: { ttl: 60_000, limit: 5 },
		VERIFY_TOKEN: { ttl: 60_000, limit: 10 }
	},
	EMAIL_VERIFICATION: {
		SEND_CODE: { ttl: 60_000, limit: 3 },
		VERIFY: { ttl: 60_000, limit: 5 }
	}
} as const;
