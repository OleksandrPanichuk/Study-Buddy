import { Body, Controller, HttpCode, HttpStatus, Post, Req, Session, UseGuards } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import type { User } from "@prisma/generated/client";
import type { Request } from "express";
import { VerifyEmailInput } from "@/auth/email-verification/email-verification.dto";
import { EmailVerificationService } from "@/auth/email-verification/email-verification.service";
import { ApiSendVerificationCode, ApiVerifyEmail } from "@/auth/email-verification/email-verification.swagger";
import { RATE_LIMITS } from "@/shared/constants";
import { CurrentUser } from "@/shared/decorators";
import { AuthenticatedGuard } from "@/shared/guards";
import type { TSession } from "@/shared/types";
import { updateSession } from "@/shared/utils/session.utils";

@ApiTags("Email Verification")
@ApiUnauthorizedResponse({
	description: "Unauthorized"
})
@UseGuards(ThrottlerGuard, AuthenticatedGuard)
@Controller("/auth/email-verification")
export class EmailVerificationController {
	constructor(private readonly emailVerificationService: EmailVerificationService) {}

	@ApiSendVerificationCode()
	@Throttle({ default: RATE_LIMITS.EMAIL_VERIFICATION.SEND_CODE })
	@Post("/code")
	@HttpCode(HttpStatus.OK)
	async sendVerificationCode(@CurrentUser() user: User) {
		await this.emailVerificationService.sendVerificationCode(user);
		return { message: "Verification code sent successfully" };
	}

	@ApiVerifyEmail()
	@Throttle({ default: RATE_LIMITS.EMAIL_VERIFICATION.VERIFY })
	@Post("/verify")
	@HttpCode(HttpStatus.OK)
	async verifyEmail(
		@Body() dto: VerifyEmailInput,
		@CurrentUser() user: User,
		@Session() session: TSession,
		@Req() req: Request
	): Promise<{ message: string }> {
		await this.emailVerificationService.verifyEmail(dto, user);
		await updateSession(req, { passport: { ...session.passport, verified: true } });
		return { message: "Email verified successfully" };
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	cleanupExpiredCodes() {
		return this.emailVerificationService.cleanupExpiredCodes();
	}
}
