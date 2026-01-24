import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { TUserWithAvatar } from "@repo/schemas";
import type { Request } from "express";

export const CurrentUser = createParamDecorator(
  (data: keyof TUserWithAvatar, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user;
    return data ? user?.[data] : user;
  },
);
