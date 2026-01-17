import { getCookies, setCookie } from "@tanstack/react-start/server";
import ky from "ky";

type CookieOptions = Parameters<typeof setCookie>[2];

function parseCookieAttributes(attributes: string[]): CookieOptions {
	const options: CookieOptions = {};

	const attributeHandlers: Record<string, (value: string | undefined) => void> = {
		path: (value) => {
			options.path = value;
		},
		"max-age": (value) => {
			if (value) options.maxAge = Number.parseInt(value, 10);
		},
		httponly: () => {
			options.httpOnly = true;
		},
		secure: () => {
			options.secure = true;
		},
		expires: (value) => {
			if (value) {
				const expires = new Date(value);
				if (!Number.isNaN(expires.getTime())) options.expires = expires;
			}
		},
		samesite: (value) => {
			options.sameSite = value?.toLowerCase() as "strict" | "lax" | "none";
		}
	};

	for (const attr of attributes) {
		const [attrName, attrValue] = attr.split("=").map((s) => s?.trim());
		const lowerAttrName = attrName?.toLowerCase();

		if (!lowerAttrName) continue;

    const handler = attributeHandlers[lowerAttrName];
		
		if (handler) handler(attrValue);
	}

	return options;
}

function forwardSetCookieHeader(setCookieHeader: string): void {
	const cookieStrings = setCookieHeader.split(/,(?=\s*\w+=)/);

	for (const cookieStr of cookieStrings) {
		const parts = cookieStr.split(";").map((s) => s.trim());
		const nameValue = parts[0];
		const attributes = parts.slice(1);

		if (!nameValue) continue;

		const separatorIndex = nameValue.indexOf("=");

		if (separatorIndex === -1) continue;

		const name = nameValue.slice(0, separatorIndex);
		const value = nameValue.slice(separatorIndex + 1);

		if (name && value) {
			const options = parseCookieAttributes(attributes);
			setCookie(name, value, options);
		}
	}
}

async function forwardCookiesToBackend(request: Request): Promise<void> {
	if (typeof window !== "undefined") return;

	try {
		const cookies = getCookies();
		if (cookies && Object.keys(cookies).length) {
			const cookieString = Object.entries(cookies)
				.map(([key, value]) => `${key}=${value}`)
				.join("; ");

			request.headers.set("cookie", cookieString);
		}
	} catch (error) {
		console.warn("Failed to get headers:", error);
	}
}

async function forwardCookiesToBrowser(response: Response): Promise<void> {
	if (typeof window !== "undefined") return;

	const setCookieHeader = response.headers.get("set-cookie");
	if (!setCookieHeader) return;

	try {
		forwardSetCookieHeader(setCookieHeader);
	} catch (error) {
		console.warn("Failed to forward Set-Cookie:", error);
	}
}

async function handleErrorResponse(response: Response): Promise<void> {
	if (response.ok) return;

	// biome-ignore lint/suspicious/noExplicitAny: true
	let errorData: any;

	try {
		errorData = await response.json();
	} catch {
		errorData = await response.text();
	}

	let message: string;

	if (errorData?.message === "Validation failed" && errorData?.errors?.length) {
		message = errorData.errors[0].message;
	} else {
		message =
			errorData?.message ||
			errorData?.error ||
			errorData?.errors?.[0]?.message ||
			`Request failed with status ${response.status}`;
	}

	throw new Error(message);
}

export const fetcher = ky.create({
	prefixUrl: `${import.meta.env.VITE_API_URL}/api`,
	credentials: "include",
	hooks: {
		beforeRequest: [
			async (request) => {
				await forwardCookiesToBackend(request);
			}
		],
		afterResponse: [
			async (_request, _options, response) => {
				await forwardCookiesToBrowser(response);
				await handleErrorResponse(response);
				return response;
			}
		]
	}
});
