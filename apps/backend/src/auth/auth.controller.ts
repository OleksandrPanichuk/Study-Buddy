import { SignInResponse, SignUpInput, SignUpResponse } from "@/auth/auth.dto";
import {
  ApiGithubOAuth,
  ApiGithubOAuthCallback,
  ApiGoogleOAuth,
  ApiGoogleOAuthCallback,
  ApiSignIn,
  ApiSignOut,
  ApiSignUp,
} from "@/auth/auth.swagger";
import type { TOAuthUser } from "@/auth/auth.types";
import {
  GithubOAuthGuard,
  GoogleOAuthGuard,
  LocalAuthGuard,
} from "@/auth/guards";
import type { Env } from "@/shared/config";
import { RATE_LIMITS } from "@/shared/constants";
import { AuthenticatedGuard } from "@/shared/guards";
import type { TSession } from "@/shared/types";
import { destroySession } from "@/shared/utils/session.utils";
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
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import type { Request, Response } from "express";
import { ZodResponse } from "nestjs-zod";
import { AuthService } from "./auth.service";

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
    @Req() req: Request,
  ): Promise<SignUpResponse> {
    const user = await this.authService.signUp(dto);

    await new Promise<void>((resolve, reject) => {
      req.logIn(user, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
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
  async signIn(@Req() req: Request) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

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
    @Res() res: Response,
    @Session() session: TSession
  ) {
    const user = await this.authService.oauthSignIn(req?.user);

    session.passport = {
      user: user.id,
      verified: user.emailVerified
    }

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
    @Res() res: Response,
    @Session() session: TSession
  ) {
    const user = await this.authService.oauthSignIn(req?.user);

    session.passport = {
      user: user.id,
      verified: user.emailVerified
    }
    
    return res.redirect(this.config.get("WEB_URL") as string);
  }
}
