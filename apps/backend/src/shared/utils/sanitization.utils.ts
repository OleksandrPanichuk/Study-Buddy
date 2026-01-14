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

		return filterXSS(input, this.xssOptions);
	}

	static sanitizeArray<T = unknown>(arr: T[]): T[] {
		return arr.map((item) => {
			if (typeof item === "string") {
				return this.sanitizeInput(item) as T;
			} else if (Array.isArray(item)) {
				return this.sanitizeArray(item) as T;
			} else if (item && typeof item === "object") {
				return this.sanitizeObject(item as Record<string, unknown>) as T;
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
				sanitized[key] = this.sanitizeInput(value);
			} else if (Array.isArray(value)) {
				sanitized[key] = this.sanitizeArray(value);
			} else if (value && typeof value === "object") {
				sanitized[key] = this.sanitizeObject(value as Record<string, unknown>);
			} else {
				sanitized[key] = value;
			}
		}

		return sanitized as T;
	}
}
