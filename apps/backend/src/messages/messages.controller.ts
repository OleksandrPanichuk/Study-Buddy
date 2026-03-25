import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Sse, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { ZodResponse } from "nestjs-zod";
import { filter, fromEvent, map, Observable, Subject, takeUntil } from "rxjs";
import { MessagesSSEEvents } from "@/messages/messages.constants";
import type { IMessageStreamEventData } from "@/messages/messages.interfaces";
import { MessagesService } from "@/messages/messages.service";
import { RATE_LIMITS } from "@/shared/constants";
import { CurrentUser } from "@/shared/decorators";
import { AuthenticatedGuard } from "@/shared/guards";
import {
	CreateMessageInput,
	CreateMessageResponse,
	FindAllMessagesQuery,
	FindAllMessagesResponse
} from "./messages.dto";
import { ApiCreateMessage, ApiFindAllMessages, ApiStreamMessage } from "./messages.swagger";

@ApiTags("Messages")
@UseGuards(AuthenticatedGuard, ThrottlerGuard)
@Throttle({ default: RATE_LIMITS.MESSAGES })
@Controller("tutor-chat/:tutorChatId/messages")
export class MessagesController {
	constructor(
		private readonly messagesService: MessagesService,
		private readonly eventEmitter: EventEmitter2
	) {}

	@ApiFindAllMessages()
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

	@ApiCreateMessage()
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

	@ApiStreamMessage()
	@Sse(":messageId/stream")
	stream(
		@Param("tutorChatId") tutorChatId: string,
		@Param("messageId") messageId: string,
		@CurrentUser("id") userId: string
	): Observable<MessageEvent> {
		const destroy$ = new Subject<void>();

		return fromEvent(this.eventEmitter, MessagesSSEEvents.STREAM).pipe(
			map((payload) => payload as IMessageStreamEventData),
			filter(
				(payload) =>
					payload.assistantMessageId === messageId && payload.tutorChatId === tutorChatId && payload.userId === userId
			),
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
