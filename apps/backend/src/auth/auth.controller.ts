import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { RATE_LIMITS } from "@/shared/constants";
import { SignInResponse, SignUpInput, SignUpResponse } from "@/auth/auth.dto";
import type { TSession } from "@/shared/types";
import { destroySession, updateSession } from "@/shared/utils/session.utils";
import { ZodResponse } from "nestjs-zod";
import type { Request, Response } from "express";
import {
  GithubOAuthGuard,
  GoogleOAuthGuard,
  LocalAuthGuard,
} from "@/auth/guards";
import { AuthenticatedGuard } from "@/shared/guards";
import type { TOAuthUser } from "@/auth/auth.types";
import { ConfigService } from "@nestjs/config";
import type { Env } from "@/shared/config";
import {
  ApiGithubOAuth,
  ApiGithubOAuthCallback,
  ApiGoogleOAuth,
  ApiGoogleOAuthCallback,
  ApiSignIn,
  ApiSignOut,
  ApiSignUp,
} from "@/auth/auth.swagger";

@ApiTags("Auth")
@UseGuards(ThrottlerGuard)
@Throttle({ default: RATE_LIMITS.AUTH.CONTROLLER })
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<Env>,
  ) {}

  @ApiSignUp()
  @ZodResponse({
    type: SignUpResponse,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post("/sign-up")
  async signUp(
    @Body() dto: SignUpInput,
    @Session() session: TSession,
  ): Promise<SignUpResponse> {
    const user = await this.authService.signUp(dto);
    await updateSession(session, {
      passport: {
        user: user.id,
        verified: user.emailVerified,
      },
    });

    return user;
  }

  @ApiSignIn()
  @ZodResponse({
    type: SignInResponse,
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post("/sign-in")
  async signIn(@Req() req: Request, @Session() session: TSession) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    await updateSession(session, {
      passport: {
        user: user.id,
        verified: user.emailVerified,
      },
    });

    return user;
  }

  @ApiSignOut()
  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  @Get("sign-out")
  async signOut(@Session() session: TSession) {
    await destroySession(session);
  }

  @ApiGoogleOAuth()
  @UseGuards(GoogleOAuthGuard)
  @Get("sign-in/google")
  signInGoogle() {
    return;
  }

  @ApiGithubOAuth()
  @UseGuards(GithubOAuthGuard)
  @Get("sign-in/github")
  signInGithub() {
    return;
  }

  @ApiGoogleOAuthCallback()
  @UseGuards(GoogleOAuthGuard)
  @Get("callback/google")
  async googleCallback(
    @Req()
    req: Request & {
      user?: TOAuthUser;
    },
    @Session() session: TSession,
    @Res() res: Response,
  ) {
    const user = await this.authService.oauthSignIn(req?.user);
    await updateSession(session, {
      passport: {
        user: user.id,
        verified: user.emailVerified,
      },
    });

    return res.redirect(this.config.get("WEB_URL") as string);
  }

  @ApiGithubOAuthCallback()
  @Get("callback/github")
  @UseGuards(GithubOAuthGuard)
  async githubCallback(
    @Req()
    req: Request & {
      user?: TOAuthUser;
    },
    @Session() session: TSession,
    @Res() res: Response,
  ) {
    const user = await this.authService.oauthSignIn(req?.user);
    await updateSession(session, {
      passport: { user: user.id, verified: user.emailVerified },
    });
    return res.redirect(this.config.get("WEB_URL") as string);
  }
}
