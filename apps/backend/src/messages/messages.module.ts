import {Module} from '@nestjs/common';
import {MessagesController} from "@/messages/messages.controller";
import {MessagesRepository} from "@/messages/messages.repository";
import {MessagesService} from "@/messages/messages.service";

@Module({
	providers: [MessagesService, MessagesRepository],
	controllers: [MessagesController]
})
export class MessagesModule {}
