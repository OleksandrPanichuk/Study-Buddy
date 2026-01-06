import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import  { VerificationCodeRepository } from "@/auth/email-verification/verification-code.repository";
import  { UsersRepository } from "@/users/users.repository";
import  { MailerService } from "@app/mailer";
import  { HashingService } from "@app/hashing";
import type { User } from "@prisma/generated/client";
import { randomInt } from "node:crypto";
import { VerifyEmailInput } from "@/auth/email-verification/email-verification.dto";

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);

  private readonly CODE_LENGTH = 6;
  private readonly CODE_EXPIRATION_MS = 15 * 60 * 1000;
  private readonly RESEND_COOLDOWN_MS = 60 * 1000;
  private readonly MAX_RESEND_ATTEMPTS = 5;

  constructor(
    private readonly codeRepository: VerificationCodeRepository,
    private readonly usersRepository: UsersRepository,
    private readonly mailerService: MailerService,
    private readonly hashingService: HashingService,
  ) {}

  public async sendVerificationCode(user: User) {
    if (user.emailVerified) {
      throw new BadRequestException("Email already verified");
    }

    const existingCode = await this.codeRepository.findByUserId(user.id);

    if (existingCode) {
      if (existingCode.resendCount >= this.MAX_RESEND_ATTEMPTS) {
        this.logger.warn(`User ${user.id} has exceeded max resend attempts`);
        throw new BadRequestException(
          "Maximum resend attempts reached. Please try again later",
        );
      }

      const timeSinceCreation = Date.now() - existingCode.createdAt.getTime();

      if (timeSinceCreation < this.RESEND_COOLDOWN_MS) {
        const remainingSeconds = Math.ceil(
          (this.RESEND_COOLDOWN_MS - timeSinceCreation) / 1000,
        );
        this.logger.warn(`Resend cooldown active for user ${user.id}`);
        throw new BadRequestException(
          `Please wait ${remainingSeconds} seconds before requesting a new code.`,
        );
      }
    }

    const plainCode = this.generateVerificationCode();
    const hashedCode = await this.hashingService.hash(plainCode);
    const expiresAt = new Date(Date.now() + this.CODE_EXPIRATION_MS);

    if (existingCode) {
      await this.codeRepository.update(user.id, {
        code: hashedCode,
        expiresAt,
        resendCount: existingCode.resendCount + 1,
      });
    } else {
      await this.codeRepository.create({
        code: hashedCode,
        userId: user.id,
        expiresAt,
        resendCount: 0,
      });
    }

    try {
      await this.mailerService.sendEmailVerification(
        user.email,
        user.username,
        plainCode,
        Math.floor(this.CODE_EXPIRATION_MS / 60000),
      );
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to user ${user.id}`,
        error,
      );
      await this.codeRepository.deleteByUserId(user.id);
      throw new BadRequestException("Failed to send email verification");
    }

    this.logger.log(`Verification code sent to user ${user.id}`);
  }

  public async verifyEmail(dto: VerifyEmailInput, user: User) {
    if (user.emailVerified) {
      throw new BadRequestException("Email already verified");
    }

    const verificationCode = await this.codeRepository.findByUserId(user.id);

    if (!verificationCode) {
      throw new BadRequestException(
        "No valid verification code found. Please request a new code.",
      );
    }

    if (verificationCode.expiresAt < new Date()) {
      await this.codeRepository.deleteByUserId(user.id);
      throw new BadRequestException(
        "Verification code expired. Please request a new code.",
      );
    }

    const isValid = await this.hashingService.verify(
      verificationCode.code,
      dto.code,
    );

    if (!isValid) {
      throw new BadRequestException("Invalid verification code.");
    }

    await this.usersRepository.updateVerificationStatus(user.id);
    await this.codeRepository.deleteByUserId(user.id);

    this.logger.log(`Email verified for user ${user.id}`);
  }

  public async cleanupExpiredCodes(): Promise<number> {
    const result = await this.codeRepository.deleteExpired();
    this.logger.log(`Cleaned up ${result.count} expired verification codes`);
    return result.count;
  }

  private generateVerificationCode(): string {
    const min = 10 ** (this.CODE_LENGTH - 1);
    const max = 10 ** this.CODE_LENGTH - 1;
    return randomInt(min, max).toString();
  }
}
