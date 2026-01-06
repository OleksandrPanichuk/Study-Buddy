import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { SignInInput, SignUpInput } from "@/auth/auth.dto";

export const ApiSignUp = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Register a new user account",
      description:
        "Creates a new user account with email, password, and username. " +
        "Password must contain at least 8 characters including uppercase, lowercase, numbers, and symbols. " +
        "Username must be 3-255 characters and can only contain letters, numbers, and underscores. " +
        "Email must be unique and valid. After registration, the user is automatically signed in.",
    }),
    ApiBody({
      type: SignUpInput,
    }),
    ApiConflictResponse({
      description: "Username or email already exists in the system",
    }),
    ApiBadRequestResponse({
      description:
        "Invalid input data - check email format, password strength, or username format",
    }),
    ApiTooManyRequestsResponse({
      description:
        "Too many requests - Rate limit exceeded (5 requests per minute)",
    }),
  );
};

export const ApiSignIn = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Sign in with email and password",
      description:
        "Authenticates a user using email and password credentials. " +
        "If 2FA is enabled, returns requires2FA flag and does not create session yet. " +
        "Account will be locked after 5 failed login attempts for 15 minutes.",
    }),
    ApiBody({
      type: SignInInput,
    }),
    ApiUnauthorizedResponse({
      description: "Invalid email or password",
    }),
    ApiBadRequestResponse({
      description: "Invalid email or password",
    }),
    ApiForbiddenResponse({
      description: "Account locked due to too many failed login attempts",
    }),
    ApiTooManyRequestsResponse({
      description:
        "Too many requests - Rate limit exceeded (5 requests per minute)",
    }),
  );
};

export const ApiSignOut = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Sign out current user",
      description:
        "Destroys the current user session and signs out the authenticated user. " +
        "Requires an active authenticated session.",
    }),
    ApiOkResponse({
      description: "User signed out successfully and session destroyed",
    }),
    ApiUnauthorizedResponse({
      description: "User not authenticated - No active session found",
    }),
  );
};

export const ApiGoogleOAuth = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Initiate Google OAuth2 authentication",
      description:
        "Starts the Google OAuth2 authentication flow. " +
        "Redirects the user to Google's sign-in page. " +
        "After successful authentication, Google redirects to the callback endpoint.",
    }),
    ApiOkResponse({
      description: "Redirects to Google OAuth2 sign-in page",
    }),
    ApiTooManyRequestsResponse({
      description: "Too many requests - Rate limit exceeded",
    }),
  );
};

export const ApiGithubOAuth = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Initiate GitHub OAuth2 authentication",
      description:
        "Starts the GitHub OAuth2 authentication flow. " +
        "Redirects the user to GitHub's sign-in page. " +
        "After successful authentication, GitHub redirects to the callback endpoint.",
    }),
    ApiOkResponse({
      description: "Redirects to GitHub OAuth2 sign-in page",
    }),
    ApiTooManyRequestsResponse({
      description: "Too many requests - Rate limit exceeded",
    }),
  );
};

export const ApiGoogleOAuthCallback = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Google OAuth2 callback handler",
      description:
        "Handles the callback from Google OAuth2 authentication. " +
        "Creates or updates user account based on Google profile data. " +
        "Creates a session and redirects to the frontend application.",
    }),
    ApiOkResponse({
      description:
        "Authentication successful - Redirects to frontend application",
    }),
    ApiBadRequestResponse({
      description: "Invalid OAuth2 data received from Google",
    }),
  );
};

export const ApiGithubOAuthCallback = () => {
  return applyDecorators(
    ApiOperation({
      summary: "GitHub OAuth2 callback handler",
      description:
        "Handles the callback from GitHub OAuth2 authentication. " +
        "Creates or updates user account based on GitHub profile data. " +
        "Creates a session and redirects to the frontend application.",
    }),
    ApiOkResponse({
      description:
        "Authentication successful - Redirects to frontend application",
    }),
    ApiBadRequestResponse({
      description: "Invalid OAuth2 data received from GitHub",
    }),
  );
};
