import { type ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import { STRATEGIES } from "@/auth/auth.constants";

@Injectable()
export class LocalAuthGuard extends AuthGuard(STRATEGIES.LOCAL) {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const result = (await super.canActivate(context)) as boolean;
		const request = context.switchToHttp().getRequest<Request>();
		await super.logIn(request);
		return result;
	}
}
