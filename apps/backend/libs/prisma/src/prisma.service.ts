import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import type { Env } from "@/shared/config";
import { PrismaClient } from "./generated/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(readonly config: ConfigService<Env>) {
    super({
      adapter: new PrismaPg({
        connectionString: config.get("DATABASE_URL"),
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
