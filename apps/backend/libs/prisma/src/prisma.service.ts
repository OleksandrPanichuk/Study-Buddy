import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "./generated/client";
import {PrismaPg} from "@prisma/adapter-pg";
import { ConfigService } from "@nestjs/config";
import { Env } from "@/shared/config";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(readonly config: ConfigService<Env>) {
    super({
      adapter: new PrismaPg({
        connectionString: config.get("DATABASE_URL")
      }),

    });
  }

  async onModuleInit() {
    this.logger.log("Connecting to database");
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
