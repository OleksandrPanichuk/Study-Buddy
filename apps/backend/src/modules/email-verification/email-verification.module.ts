import { Module } from "@nestjs/common";
import { VerificationCodeRepository } from "@/modules/email-verification/verification-code.repository";
import { EmailVerificationController } from "@/modules/email-verification/email-verification.controller";
import { EmailVerificationService } from "@/modules/email-verification/email-verification.service";
import { MailerModule } from "@app/mailer";
import { UsersModule } from "@/modules/users/users.module";
import { HashingModule } from "@app/hashing";

@Module({
	imports: [MailerModule, UsersModule, HashingModule],
	controllers: [EmailVerificationController],
	providers: [VerificationCodeRepository, EmailVerificationService]
})
export class EmailVerificationModule {}
