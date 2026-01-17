import { randomBytes } from "node:crypto";
import { HashingService } from "@app/hashing";
import { MailerService } from "@app/mailer";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type {
	ResetPasswordInput,
	SendResetPasswordTokenInput,
	VerifyResetPasswordTokenInput
} from "@/auth/password/password.dto";
import { ResetPasswordTokenRepository } from "@/auth/password/reset-password-token.repository";
import type { Env } from "@/shared/config";
import { UsersRepository } from "@/users/users.repository";

@Injectable()
export class PasswordService {
	private readonly logger = new Logger(PasswordService.name);
	private readonly TOKEN_LENGTH = 32;
	private readonly TOKEN_EXPIRATION_MS = 15 * 60 * 1000;
	private readonly RESEND_COOLDOWN_MS = 2 * 60 * 1000;
	private readonly MAX_RESEND_ATTEMPTS = 5;

	constructor(
		private readonly tokenRepository: ResetPasswordTokenRepository,
		private readonly usersRepository: UsersRepository,
		private readonly mailerService: MailerService,
		private readonly hashingService: HashingService,
		private readonly config: ConfigService<Env>
	) {}

	public async sendResetPasswordToken(dto: SendResetPasswordTokenInput) {
		const user = await this.usersRepository.findByEmail(dto.email);

		if (!user) {
			this.logger.warn(`Password reset attempted for non-existing email: ${dto.email}`);
			await this.simulateDelay();
			return {
				message: "If an account with that email exists, a reset password link has been sent."
			};
		}

		const existingToken = await this.tokenRepository.findByUserEmail(user.email);

		if (existingToken) {
			const now = Date.now();
			const timeSinceCreation = now - existingToken.createdAt.getTime();

			if (timeSinceCreation < this.RESEND_COOLDOWN_MS) {
				const remainingSeconds = Math.ceil((this.RESEND_COOLDOWN_MS - timeSinceCreation) / 1000);

				throw new BadRequestException(`Please wait ${remainingSeconds} seconds before requesting a new token.`);
			}

			if (existingToken.resendCount >= this.MAX_RESEND_ATTEMPTS) {
				throw new BadRequestException("Maximum resend attempts reached. Please try again later");
			}

			const token = this.generateToken();
			const hashedToken = await this.hashingService.hash(token);

			await this.tokenRepository.updateTokenAndIncrementResendCount(existingToken.id, hashedToken);

			const link = `${dto.resetPageUrl}?token=${token}&email=${encodeURIComponent(user.email)}`;

			const expiresInMinutes = Math.ceil((existingToken.expiresAt.getTime() - now) / 60000);

			await this.mailerService.sendPasswordResetEmail(user.email, link, user.username, expiresInMinutes);

			return { message: "If the email exists, a reset link has been sent" };
		}
		await this.tokenRepository.deleteByUserId(user.id);

		const token = this.generateToken();

		const tokenHash = await this.hashingService.hash(token);

		const expiresAt = new Date(Date.now() + this.TOKEN_EXPIRATION_MS);
		const expiresInMinutes = Math.floor(this.TOKEN_EXPIRATION_MS / 60000);

		await this.tokenRepository.create({
			userId: user.id,
			expiresAt,
			token: tokenHash
		});

		const clientUrl = this.config.get("WEB_URL");
		const link = `${clientUrl}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

		await this.mailerService.sendPasswordResetEmail(user.email, link, user.username, expiresInMinutes);

		return { message: "If the email exists, a reset link has been sent" };
	}

	public async verifyToken(dto: VerifyResetPasswordTokenInput) {
		const result = await this.tokenRepository.findByUserEmail(dto.email);

		if (!result || Date.now() > result.expiresAt.getTime()) {
			return { valid: false };
		}

		const isValid = await this.hashingService.verify(result.token, dto.token);
		return { valid: isValid };
	}

	public async resetPassword(dto: ResetPasswordInput) {
		const result = await this.tokenRepository.findByUserEmail(dto.email);

		if (!result || Date.now() > result.expiresAt.getTime()) {
			throw new BadRequestException("Invalid or expired token");
		}

		const isValid = await this.hashingService.verify(result.token, dto.token);

		if (!isValid) {
			throw new BadRequestException("Invalid or expired token");
		}

		const passwordHash = await this.hashingService.hash(dto.password);

		await this.usersRepository.updatePassword(result.userId, passwordHash);

		await this.tokenRepository.deleteByUserId(result.userId);

		this.logger.log(`Password reset successful for user: ${result.userId}`);

		return { message: "Password reset successfully" };
	}

	public async cleanupExpiredTokens() {
		const result = await this.tokenRepository.deleteExpired();
		this.logger.log(`Cleaned up ${result.count} expired reset tokens`);
		return result.count;
	}

	private generateToken(): string {
		return randomBytes(this.TOKEN_LENGTH).toString("hex");
	}

	private async simulateDelay() {
		const delay = Math.random() * 200;
		return new Promise((resolve) => setTimeout(resolve, delay));
	}
}
