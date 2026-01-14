import { RATE_LIMITS } from "@/shared/constants";
import { AuthenticatedGuard } from "@/shared/guards";
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { ZodResponse } from "nestjs-zod";
import { CurrentUserResponse } from "./users.dto";
import { CurrentUser } from "@/shared/decorators";
import { User } from "@app/prisma";
import { ApiCurrentUser } from "./users.swagger";

@ApiTags("Users")
@UseGuards(ThrottlerGuard, AuthenticatedGuard)
@Throttle({ default: RATE_LIMITS.GLOBAL })
@Controller("/users")
export class UsersController {
	@ApiCurrentUser()
	@ZodResponse({
		type: CurrentUserResponse
	})
	@HttpCode(HttpStatus.OK)
	@Get("/current")
	getCurrent(@CurrentUser() user: User) {
		return user;
	}
}
