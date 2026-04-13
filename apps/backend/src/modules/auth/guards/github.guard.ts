import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { STRATEGIES } from "@/modules/auth/auth.constants";

@Injectable()
export class GithubOAuthGuard extends AuthGuard(STRATEGIES.GITHUB) {}
