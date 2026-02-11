import { IMessageStreamEventData } from "@/messages/messages.interfaces";
import { MessagesService } from "@/messages/messages.service";
import { RATE_LIMITS } from "@/shared/constants";
import { CurrentUser } from "@/shared/decorators";
import { AuthenticatedGuard } from "@/shared/guards";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Sse, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { ZodResponse } from "nestjs-zod";
import { filter, fromEvent, map, Observable, Subject, takeUntil } from "rxjs";
import {
	CreateMessageInput,
	CreateMessageResponse,
	FindAllMessagesQuery,
	FindAllMessagesResponse
} from "./messages.dto";

@ApiTags("Messages")
@UseGuards(AuthenticatedGuard, ThrottlerGuard)
@Throttle({ default: RATE_LIMITS.MESSAGES })
@Controller("tutor-char/:tutorChatId/messages")
export class MessagesController {
	constructor(
		private readonly messagesService: MessagesService,
		private readonly eventEmitter: EventEmitter2
	) {}

	@ZodResponse({
		type: FindAllMessagesResponse
	})
	@HttpCode(HttpStatus.OK)
	@Get("/")
	findAll(
		@Param("tutorChatId") tutorChatId: string,
		@Query() query: FindAllMessagesQuery,
		@CurrentUser("id") userId: string
	) {
		return this.messagesService.findAll(query, tutorChatId, userId);
	}

	@ZodResponse({
		type: CreateMessageResponse
	})
	@HttpCode(HttpStatus.CREATED)
	@Post("/")
	create(
		@Param("tutorChatId") tutorChatId: string,
		@Body() dto: CreateMessageInput,
		@CurrentUser("id") userId: string
	) {
		return this.messagesService.create(dto, tutorChatId, userId);
	}

	@Sse(":messageId/stream")
	stream(@Param("tutorChatId") tutorChatId: string, @Param("messageId") messageId: string): Observable<MessageEvent> {
		const destroy$ = new Subject<void>();

		return fromEvent(this.eventEmitter, "message.stream").pipe(
			map((payload) => payload as IMessageStreamEventData),
			filter((payload) => payload.assistantMessageId === messageId && payload.tutorChatId === tutorChatId),
			map((payload) => {
				if (payload.status === "COMPLETE" || payload.status === "FAILED") {
					setTimeout(() => destroy$.next(), 100);
				}

				return {
					data: {
						messageId: payload.assistantMessageId,
						content: payload.content ?? "",
						status: payload.status,
						error: payload.error
					}
				} as MessageEvent;
			}),
			takeUntil(destroy$)
		);
	}
}
