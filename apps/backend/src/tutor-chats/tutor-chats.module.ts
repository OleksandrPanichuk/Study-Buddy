import { Module } from "@nestjs/common";
import { TutorChatsController } from "./tutor-chats.controller";
import { TutorChatsRepository } from "./tutor-chats.repository";
import { TutorChatsService } from "./tutor-chats.service";

@Module({
	providers: [TutorChatsRepository, TutorChatsService],
	controllers: [TutorChatsController],
})
export class TutorChatsModule {}
