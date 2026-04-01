import {Controller} from "@nestjs/common";
import {ContextFilesService} from "@/context-files/context-files.service";

@Controller("/context-files/:tutorChatId/upload")
export class ContextFilesController {
	constructor(private readonly contextFilesService: ContextFilesService) {}
}
