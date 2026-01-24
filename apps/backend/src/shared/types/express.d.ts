import type { TUserWithAvatar } from "@repo/schemas";

declare global {
  namespace Express {
    interface User extends TUserWithAvatar {}
  }
}
