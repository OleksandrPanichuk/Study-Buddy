import {Injectable} from "@nestjs/common";
import {MessagesRepository} from "@/messages/messages.repository";

@Injectable()
export class MessagesService {
	constructor(private readonly messagesRepository: MessagesRepository) {}
}
