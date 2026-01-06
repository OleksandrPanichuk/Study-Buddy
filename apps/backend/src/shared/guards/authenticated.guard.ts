import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import type { Request } from "express";

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    return req.isAuthenticated();
  }
}
