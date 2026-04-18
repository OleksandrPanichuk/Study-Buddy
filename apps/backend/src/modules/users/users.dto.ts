import { createZodDto } from "nestjs-zod";
import { currentUserResponseSchema} from "@repo/schemas"


export class CurrentUserResponse extends createZodDto(currentUserResponseSchema) {}
