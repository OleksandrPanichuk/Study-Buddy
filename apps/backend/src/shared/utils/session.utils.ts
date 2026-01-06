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

export async function updateSession(
  session: TSession,
  updates: Partial<TSession>,
): Promise<void> {
  const oldData = { ...session };
  await regenerateSession(session);
  Object.assign(session, oldData, updates);
}
