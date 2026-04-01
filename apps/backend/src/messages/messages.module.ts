import {AIModule} from "@app/ai";
import {BullModule} from "@nestjs/bullmq";
import {Module} from "@nestjs/common";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {MessagesController} from "@/messages/messages.controller";
import {MessagesProcessor} from "@/messages/messages.processor";
import {MessagesRepository} from "@/messages/messages.repository";
import {MessagesService} from "@/messages/messages.service";
import {TutorChatsModule} from "@/tutor-chats/tutor-chats.module";
import {FileProcessingModule} from "@/file-processing/file-processing.module";
import {MESSAGE_GENERATING_QUEUE} from "@/messages/messages.constants";

@Module({
	imports: [
		TutorChatsModule,
		AIModule,
		BullModule.registerQueue({ name: MESSAGE_GENERATING_QUEUE }),
		EventEmitterModule.forRoot(),
		FileProcessingModule
	],
	providers: [MessagesService, MessagesRepository, MessagesProcessor],
	controllers: [MessagesController]
})
export class MessagesModule {}
