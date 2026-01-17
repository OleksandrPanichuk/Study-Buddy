import { filterXSS, type IFilterXSSOptions } from "xss";

export class SanitizationUtil {
	private static readonly xssOptions: IFilterXSSOptions = {
		whiteList: {
			a: ["href", "title", "target"],
			p: [],
			br: [],
			strong: [],
			em: [],
			ul: [],
			ol: [],
			li: []
		},
		stripIgnoreTag: true,
		stripIgnoreTagBody: ["script", "style"]
	};

	static sanitizeInput(input: string): string {
		if (!input || typeof input !== "string") {
			return input;
		}

		return filterXSS(input, SanitizationUtil.xssOptions);
	}

	static sanitizeArray<T = unknown>(arr: T[]): T[] {
		return arr.map((item) => {
			if (typeof item === "string") {
				return SanitizationUtil.sanitizeInput(item) as T;
			}
			if (item instanceof Date) {
				return item;
			}
			if (Array.isArray(item)) {
				return SanitizationUtil.sanitizeArray(item) as T;
			}
			if (item && typeof item === "object") {
				return SanitizationUtil.sanitizeObject(item as Record<string, unknown>) as T;
			}
			return item;
		});
	}

	static sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
		const sanitized: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(obj)) {
			if (value instanceof Date) {
				sanitized[key] = value;
			} else if (typeof value === "string") {
				sanitized[key] = SanitizationUtil.sanitizeInput(value);
			} else if (Array.isArray(value)) {
				sanitized[key] = SanitizationUtil.sanitizeArray(value);
			} else if (value && typeof value === "object") {
				sanitized[key] = SanitizationUtil.sanitizeObject(value as Record<string, unknown>);
			} else {
				sanitized[key] = value;
			}
		}

		return sanitized as T;
	}
}
