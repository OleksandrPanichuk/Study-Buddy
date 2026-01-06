import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
} from "@nestjs/swagger";
import { VerifyEmailInput } from "@/auth/email-verification/email-verification.dto";

export const ApiSendVerificationCode = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Send verification code to user email",
      description:
        "Sends a 6-digit verification code to the authenticated user's email address. " +
        "The code is valid for 15 minutes. Maximum 5 resend attempts are allowed per code. " +
        "A cooldown period of 1 minute is enforced between resend requests.",
    }),
    ApiOkResponse({
      description: "Verification code sent successfully",
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Verification code sent successfully",
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description:
        "Email already verified | Too many resend attempts | Please wait before requesting a new code | Failed to send email",
    }),
    ApiTooManyRequestsResponse({
      description: "Too many requests - Rate limit exceeded",
    }),
  );
};

export const ApiVerifyEmail = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Verify user email with verification code",
      description:
        "Verifies the authenticated user's email address using the 6-digit code sent to their email. " +
        "The code must be valid and not expired (valid for 15 minutes). " +
        "Once verified, the code is marked as consumed and cannot be reused.",
    }),
    ApiBody({ type: VerifyEmailInput }),
    ApiOkResponse({
      description: "Email verified successfully",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Email verified successfully" },
        },
      },
    }),
    ApiBadRequestResponse({
      description:
        "Email already verified | Invalid or expired verification code | Code already used",
    }),
    ApiTooManyRequestsResponse({
      description: "Too many requests - Rate limit exceeded",
    }),
  );
};
