import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { User } from "@prisma/generated/client";
import type { Request } from "express";

export const CurrentUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user;
    return data ? user?.[data] : user;
  },
);
