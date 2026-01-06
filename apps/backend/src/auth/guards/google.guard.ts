import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { STRATEGIES } from "@/auth/auth.constants";

@Injectable()
export class GoogleOAuthGuard extends AuthGuard(STRATEGIES.GOOGLE) {}
