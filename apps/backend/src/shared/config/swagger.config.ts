import { ConfigService } from "@nestjs/config";
import { Env } from "@/shared/config/env.config";
import { DocumentBuilder } from "@nestjs/swagger";


export const getSwaggerConfig = (config: ConfigService<Env>) => {
  return new DocumentBuilder()
    .setTitle(config.get<string>("APP_NAME")!)
    .setVersion("1.0")
    .addGlobalResponse({
      status: 500,
      description: "Internal Server Error",
    })
    .build();
}