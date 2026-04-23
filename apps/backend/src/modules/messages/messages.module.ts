import {AIModule} from "@app/ai";
import {BullModule} from "@nestjs/bullmq";
import {Module} from "@nestjs/common";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {MessagesController} from "@/modules/messages/messages.controller";
import {MessagesProcessor} from "@/modules/messages/messages.processor";
import {MessagesRepository} from "@/modules/messages/messages.repository";
import {MessagesService} from "@/modules/messages/messages.service";
import {TutorChatsModule} from "@/modules/tutor-chats/tutor-chats.module";
import {FileProcessingModule} from "@/modules/file-processing/file-processing.module";
import {FilesModule} from "@/modules/files/files.module";
import {MESSAGE_GENERATING_QUEUE} from "@/modules/messages/messages.constants";

@Module({
	imports: [
		TutorChatsModule,
		AIModule,
		FilesModule,
		BullModule.registerQueue({ name: MESSAGE_GENERATING_QUEUE }),
		EventEmitterModule.forRoot(),
		FileProcessingModule
	],
	providers: [MessagesService, MessagesRepository, MessagesProcessor],
	controllers: [MessagesController]
})
export class MessagesModule {}
