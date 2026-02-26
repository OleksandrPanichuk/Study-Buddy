import { createFileRoute } from "@tanstack/react-router";
import { getCookies } from "@tanstack/react-start/server";

export const Route = createFileRoute("/api/tutor-chat/$tutorChatId/messages/$messageId/stream")({
	server: {
		handlers: {
			GET: async ({ request: _request, params }) => {
				const { tutorChatId, messageId } = params;

				const apiUrl = process.env.VITE_API_URL;
				if (!apiUrl) {
					return new Response("API URL not configured", { status: 500 });
				}

				const backendUrl = `${apiUrl}/api/tutor-chat/${tutorChatId}/messages/${messageId}/stream`;

				const cookies = getCookies();
				const cookieString = Object.entries(cookies)
					.map(([key, value]) => `${key}=${value}`)
					.join("; ");

				const backendResponse = await fetch(backendUrl, {
					method: "GET",
					headers: {
						accept: "text/event-stream",
						"cache-control": "no-cache",
						cookie: cookieString
					}
				});

				if (!backendResponse.ok) {
					return new Response(backendResponse.body, {
						status: backendResponse.status,
						statusText: backendResponse.statusText
					});
				}

				const headers = new Headers({
					"content-type": "text/event-stream",
					"cache-control": "no-cache",
					connection: "keep-alive",
					"x-accel-buffering": "no"
				});

				const setCookie = backendResponse.headers.get("set-cookie");
				if (setCookie) {
					headers.set("set-cookie", setCookie);
				}

				return new Response(backendResponse.body, {
					status: 200,
					headers
				});
			}
		}
	}
});
