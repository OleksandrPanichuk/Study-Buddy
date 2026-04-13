import type { Session } from "express-session";

export type TSession = Session & {
  passport?: {
    user?: string;
    verified?: boolean;
  };
};
