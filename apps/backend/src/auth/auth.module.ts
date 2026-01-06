import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "@/users/users.module";
import { SessionSerializer } from "@/auth/serializers";
import {
  GithubStrategy,
  GoogleStrategy,
  LocalStrategy,
} from "@/auth/strategies";
import { HashingModule } from "@app/hashing";
import { PasswordModule } from "@/auth/password/password.module";
import { EmailVerificationModule } from "@/auth/email-verification/email-verification.module";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionSerializer,
    GithubStrategy,
    GoogleStrategy,
    LocalStrategy,
  ],
  imports: [
    UsersModule,
    HashingModule,
    PasswordModule,
    EmailVerificationModule,
  ],
})
export class AuthModule {}
