import {Injectable} from "@nestjs/common";
import {ContextFilesRepository} from "@/context-files/context-files.repository";

@Injectable()
export class ContextFilesService {
	constructor(private readonly contextFilesRepository: ContextFilesRepository) {}
}
