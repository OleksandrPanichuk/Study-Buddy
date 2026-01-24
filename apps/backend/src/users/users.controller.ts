import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { TUserWithAvatar } from "@repo/schemas";
import { ZodResponse } from "nestjs-zod";
import { RATE_LIMITS } from "@/shared/constants";
import { CurrentUser } from "@/shared/decorators";
import { AuthenticatedGuard } from "@/shared/guards";
import { CurrentUserResponse } from "./users.dto";
import { ApiCurrentUser } from "./users.swagger";

@ApiTags("Users")
@UseGuards(ThrottlerGuard, AuthenticatedGuard)
@Throttle({ default: RATE_LIMITS.GLOBAL })
@Controller("/users")
export class UsersController {
  @ApiCurrentUser()
  @ZodResponse({
    type: CurrentUserResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Get("/current")
  getCurrent(@CurrentUser() user: TUserWithAvatar) {
    return user;
  }
}
