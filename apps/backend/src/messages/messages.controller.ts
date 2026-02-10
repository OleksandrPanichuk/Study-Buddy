import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { MessagesService } from "@/messages/messages.service";
import { RATE_LIMITS } from "@/shared/constants";
import { AuthenticatedGuard } from "@/shared/guards";

@ApiTags("Messages")
@UseGuards(AuthenticatedGuard, ThrottlerGuard)
@Throttle({ default: RATE_LIMITS.MESSAGES })
@Controller("messages")
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}
}
