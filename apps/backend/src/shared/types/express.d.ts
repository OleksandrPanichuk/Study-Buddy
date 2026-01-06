import type { User as UserType } from "@prisma/generated/client";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}
