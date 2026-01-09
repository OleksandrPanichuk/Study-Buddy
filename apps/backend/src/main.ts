import {
  type Env,
  getCorsConfig,
  getSessionConfig,
  getSwaggerConfig,
  helmetConfig,
} from "@/shared/config";
import { getLoggerConfig } from "@app/logger";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import compression from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";
import { nestCsrf } from "ncsrf/dist";
import { WinstonModule } from "nest-winston";
import { cleanupOpenApiDoc } from "nestjs-zod";
import passport from "passport";
import { createLogger } from "winston";
import { AppModule } from "./app.module";
import "./instrument";

async function bootstrap() {
  const logger = createLogger(getLoggerConfig());
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });

  const config = app.get(ConfigService<Env>);
  const PORT = config.get("PORT", 8080);

  // Swagger
  const openApiDoc = SwaggerModule.createDocument(
    app,
    getSwaggerConfig(config),
  );

  SwaggerModule.setup("api/swagger", app, cleanupOpenApiDoc(openApiDoc));

  // Compression and Cookies
  app.use(compression());
  app.use(cookieParser());

  // Session
  app.use(session(getSessionConfig(config)));
  app.use(passport.initialize());
  app.use(passport.session());

  // Security
  app.enableCors(getCorsConfig(config));
  app.use(helmet(helmetConfig));
  app.use(nestCsrf());

  app.setGlobalPrefix("api");

  await app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
bootstrap();
