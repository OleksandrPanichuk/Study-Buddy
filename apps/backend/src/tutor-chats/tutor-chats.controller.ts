import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { ZodResponse } from "nestjs-zod";
import { RATE_LIMITS } from "@/shared/constants";
import { CurrentUser } from "@/shared/decorators";
import { AuthenticatedGuard } from "@/shared/guards";
import {
  BulkDeleteTutorChatsInput,
  CreateTutorChatInput,
  CreateTutorChatResponse,
  DeleteTutorChatParams,
  FindAllTutorChatsQuery,
  FindAllTutorChatsResponse,
  UpdateTutorChatInput,
  UpdateTutorChatResponse,
} from "./tutor-chats.dto";
import type { TutorChatsService } from "./tutor-chats.service";
import {
  ApiBulkDeleteTutorChats,
  ApiCreateTutorChat,
  ApiDeleteTutorChat,
  ApiFindAllTutorChats,
} from "./tutor-chats.swagger";

@ApiTags("Tutor Chats")
@UseGuards(AuthenticatedGuard, ThrottlerGuard)
@Throttle({ default: RATE_LIMITS.GLOBAL })
@Controller("tutor-chats")
export class TutorChatsController {
  constructor(private readonly tutorChatsService: TutorChatsService) {}

  @ApiFindAllTutorChats()
  @ZodResponse({
    type: FindAllTutorChatsResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Get("")
  findByUserId(
    @Query() query: FindAllTutorChatsQuery,
    @CurrentUser("id") userId: string,
  ) {
    return this.tutorChatsService.findAll(query, userId);
  }

  @ApiCreateTutorChat()
  @ZodResponse({
    type: CreateTutorChatResponse,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post("")
  create(@Body() dto: CreateTutorChatInput, @CurrentUser("id") userId: string) {
    return this.tutorChatsService.create(dto, userId);
  }

  @ZodResponse({
    type: UpdateTutorChatResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Patch("/")
  update(@Body() dto: UpdateTutorChatInput, @CurrentUser("id") userId: string) {
    return this.tutorChatsService.update(dto, userId);
  }

  @ApiDeleteTutorChat()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/:tutorChatId")
  delete(
    @Param() params: DeleteTutorChatParams,
    @CurrentUser("id") userId: string,
  ) {
    return this.tutorChatsService.delete(params.tutorChatId, userId);
  }

  @ApiBulkDeleteTutorChats()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/bulk")
  deleteBulk(
    @Body() dto: BulkDeleteTutorChatsInput,
    @CurrentUser("id") userId: string,
  ) {
    return this.tutorChatsService.bulkDelete(dto.ids, userId);
  }
}
