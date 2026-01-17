import { type ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { STRATEGIES } from "@/auth/auth.constants";
import type { Request } from "express";

@Injectable()
export class GoogleOAuthGuard extends AuthGuard(STRATEGIES.GOOGLE) {
  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const result = (await super.canActivate(context)) as boolean;
  //   const request = context.switchToHttp().getRequest<Request>();
  //   console.log({request})
  //   await super.logIn(request);
  //   return result;
  // }
}
