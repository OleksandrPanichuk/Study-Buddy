import { Module } from "@nestjs/common";
import { VerificationCodeRepository } from "@/auth/email-verification/verification-code.repository";
import { EmailVerificationController } from "@/auth/email-verification/email-verification.controller";
import { EmailVerificationService } from "@/auth/email-verification/email-verification.service";
import { MailerModule } from "@app/mailer";
import { UsersModule } from "@/users/users.module";
import { HashingModule } from "@app/hashing";

@Module({
  imports: [MailerModule, UsersModule, HashingModule],
  controllers: [EmailVerificationController],
  providers: [VerificationCodeRepository, EmailVerificationService],
})
export class EmailVerificationModule {}
