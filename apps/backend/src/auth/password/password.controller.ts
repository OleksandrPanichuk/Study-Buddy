import type {
  ResetPasswordInput,
  SendResetPasswordTokenInput,
  VerifyResetPasswordTokenInput,
} from "@/auth/password/password.dto";
import { PasswordService } from "@/auth/password/password.service";
import {
  ApiResetPassword,
  ApiSendResetPasswordToken,
  ApiVerifyResetPasswordToken,
} from "@/auth/password/password.swagger";
import { RATE_LIMITS } from "@/shared/constants";
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";

@ApiTags("Password reset")
@UseGuards(ThrottlerGuard)
@Controller("/auth/password")
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @ApiSendResetPasswordToken()
  @Throttle({
    default: RATE_LIMITS.PASSWORD.SEND_TOKEN,
  })
  @Post("send")
  @HttpCode(HttpStatus.CREATED)
  sendResetPasswordToken(@Body() dto: SendResetPasswordTokenInput) {
    return this.passwordService.sendResetPasswordToken(dto);
  }

  @ApiResetPassword()
  @Throttle({
    default: RATE_LIMITS.PASSWORD.RESET,
  })
  @Patch("reset")
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordInput) {
    return this.passwordService.resetPassword(dto);
  }

  @ApiVerifyResetPasswordToken()
  @Throttle({ default: RATE_LIMITS.PASSWORD.VERIFY_TOKEN })
  @Post("verify")
  @HttpCode(HttpStatus.OK)
  verifyToken(@Body() dto: VerifyResetPasswordTokenInput) {
    return this.passwordService.verifyToken(dto);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  cleanupExpiredTokens() {
    return this.passwordService.cleanupExpiredTokens();
  }
}
