import ky from "ky";
import {getCookies, setCookie} from "@tanstack/react-start/server";

type CookieOptions = Parameters<typeof setCookie>[2];

function parseCookieAttributes(attributes: string[]): CookieOptions {
	const options: CookieOptions = {};

	for (const attr of attributes) {
		const [attrName, attrValue] = attr.split("=").map((s) => s?.trim());
		const lowerAttrName = attrName?.toLowerCase();

		if (lowerAttrName === "path") options.path = attrValue;
		else if (lowerAttrName === "max-age" && attrValue) options.maxAge = Number.parseInt(attrValue, 10);
		else if (lowerAttrName === "httponly") options.httpOnly = true;
		else if (lowerAttrName === "secure") options.secure = true;
		else if (lowerAttrName === "samesite") options.sameSite = attrValue?.toLowerCase() as "strict" | "lax" | "none";
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

		const [name, value] = nameValue.split("=");

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

			console.log("Sending cookies:", cookieString);
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

	console.log("Received Set-Cookie:", setCookieHeader);

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
