import {AIService} from "@app/ai/ai.service";
import {Module} from "@nestjs/common";

@Module({
	providers: [AIService],
	exports: [AIService]
})
export class AIModule {}
