import type { Request } from "express";
import type { TSession } from "@/shared/types";

export function regenerateSession(session: TSession): Promise<void> {
	return new Promise((resolve, reject) => {
		session.regenerate((err) => {
			if (err) {
				reject(new Error(`Failed to regenerate session: ${err}`));
			} else {
				resolve();
			}
		});
	});
}

export function destroySession(session: TSession): Promise<void> {
	return new Promise((resolve, reject) => {
		session.destroy((err) => {
			if (err) {
				reject(new Error(`Failed to destroy session: ${err}`));
			} else {
				resolve();
			}
		});
	});
}

export async function updateSession(req: Request, updates: Partial<TSession>): Promise<void> {
	const session = req.session as TSession;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { id, cookie, ...oldData } = session;

	await regenerateSession(session);

	Object.assign(req.session, oldData, updates);
}
