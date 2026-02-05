import {PrismaService} from "@app/prisma";
import {Injectable} from "@nestjs/common";

@Injectable()
export class MessagesRepository {
	constructor(private readonly db: PrismaService) {}
}
