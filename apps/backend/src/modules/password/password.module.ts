import { Module } from "@nestjs/common";
import { MailerModule } from "@app/mailer";
import { UsersModule } from "@/modules/users/users.module";
import { HashingModule } from "@app/hashing";
import { ResetPasswordTokenRepository } from "@/modules/password/reset-password-token.repository";
import { PasswordService } from "@/modules/password/password.service";
import { PasswordController } from "@/modules/password/password.controller";

@Module({
	imports: [MailerModule, UsersModule, HashingModule],
	controllers: [PasswordController],
	providers: [ResetPasswordTokenRepository, PasswordService]
})
export class PasswordModule {}
