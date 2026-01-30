import { ConfigService } from "@nestjs/config";
import { DocumentBuilder } from "@nestjs/swagger";
import type { Env } from "@/shared/config";

export const getSwaggerConfig = (config: ConfigService<Env>) => {
  return new DocumentBuilder()
    .setTitle(config.get<string>("APP_NAME")!)
    .setVersion("1.0")
    .addGlobalResponse({
      status: 500,
      description: "Internal Server Error",
    })
    .build();
};
