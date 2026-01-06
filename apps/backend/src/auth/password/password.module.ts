import { Module } from "@nestjs/common";
import { MailerModule } from "@app/mailer";
import { UsersModule } from "@/users/users.module";
import { HashingModule } from "@app/hashing";
import { ResetPasswordTokenRepository } from "@/auth/password/reset-password-token.repository";
import { PasswordService } from "@/auth/password/password.service";
import { PasswordController } from "@/auth/password/password.controller";

@Module({
  imports: [MailerModule, UsersModule, HashingModule],
  controllers: [PasswordController],
  providers: [ResetPasswordTokenRepository, PasswordService],
})
export class PasswordModule {}
