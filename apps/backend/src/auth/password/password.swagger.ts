import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
} from "@nestjs/swagger";
import {
  ResetPasswordInput,
  SendResetPasswordTokenInput,
  VerifyResetPasswordTokenInput,
} from "@/auth/password/password.dto";

export const ApiSendResetPasswordToken = () => {
  return applyDecorators(
    ApiOperation({ summary: "Send password reset token to user email" }),
    ApiBody({ type: SendResetPasswordTokenInput }),
    ApiCreatedResponse({
      description: "Reset password token sent successfully",
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "If the email exists, a reset link has been sent",
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Invalid email address or too many requests",
    }),
    ApiTooManyRequestsResponse({ description: "Too many requests" }),
  );
};

export const ApiResetPassword = () => {
  return applyDecorators(
    ApiOperation({ summary: "Reset user password using a valid token" }),
    ApiBody({ type: ResetPasswordInput }),
    ApiOkResponse({
      description: "Password reset successfully",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Password reset successfully" },
        },
      },
    }),
    ApiBadRequestResponse({
      description: "Invalid or expired token, or weak password",
    }),
    ApiTooManyRequestsResponse({ description: "Too many requests" }),
  );
};

export const ApiVerifyResetPasswordToken = () => {
  return applyDecorators(
    ApiOperation({ summary: "Verify if a reset password token is valid" }),
    ApiBody({ type: VerifyResetPasswordTokenInput }),
    ApiOkResponse({
      description: "Token is valid",
      schema: {
        type: "object",
        properties: {
          valid: { type: "boolean", example: true },
        },
      },
    }),
    ApiBadRequestResponse({ description: "Invalid or expired token" }),
    ApiTooManyRequestsResponse({ description: "Too many requests" }),
  );
};
