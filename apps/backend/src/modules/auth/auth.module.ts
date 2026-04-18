import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "@/modules/users/users.module";
import { SessionSerializer } from "@/modules/auth/serializers";
import { GithubStrategy, GoogleStrategy, LocalStrategy } from "@/modules/auth/strategies";
import { HashingModule } from "@app/hashing";
@Module({
	controllers: [AuthController],
	providers: [AuthService, SessionSerializer, GithubStrategy, GoogleStrategy, LocalStrategy],
	imports: [PassportModule.register({ session: true }), UsersModule, HashingModule]
})
export class AuthModule {}
