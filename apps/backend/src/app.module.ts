import { LoggerModule } from "@app/logger";
import { PrismaModule } from "@app/prisma";
import { RedisModule } from "@app/redis";
import KeyvRedis from "@keyv/redis";
import { BullModule } from "@nestjs/bullmq";
import { CacheModule } from "@nestjs/cache-manager";
import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";
import { CsrfFilter } from "ncsrf";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";
import { type Env, envSchema } from "@/config";
import { RATE_LIMITS } from "@/constants";
import { AuthModule } from "@/modules/auth/auth.module";
import { ContextFilesModule } from "@/modules/context-files/context-files.module";
import { EmailVerificationModule } from "@/modules/email-verification/email-verification.module";
import { FilesModule } from "@/modules/files/files.module";
import { MessagesModule } from "@/modules/messages/messages.module";
import { PasswordModule } from "@/modules/password/password.module";
import { TutorChatsModule } from "@/modules/tutor-chats/tutor-chats.module";
import { UsersModule } from "@/modules/users/users.module";
import { ThrottlerExceptionFilter } from "@/shared/filters";
import { LoggingInterceptor } from "@/shared/interceptors";
import { SecurityHeadersMiddleware } from "@/shared/middlewares";
import { SanitizationPipe } from "./shared/pipes";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ".env",
			isGlobal: true,
			validate: (config) => envSchema.parse(config)
		}),
		ThrottlerModule.forRoot([
			{
				ttl: RATE_LIMITS.GLOBAL.ttl,
				limit: RATE_LIMITS.GLOBAL.limit
			}
		]),
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService<Env>) => ({
				connection: {
					url: config.get("REDIS_URL")
				}
			})
		}),
		CacheModule.registerAsync({
			isGlobal: true,
			inject: [ConfigService],
			useFactory: (config: ConfigService<Env>) => ({
				stores: [new KeyvRedis(config.get("REDIS_URL")!)],
				ttl: 30 * 60 * 1000
			})
		}),
		ScheduleModule.forRoot(),
		SentryModule.forRoot(),
		LoggerModule,
		PrismaModule,
		RedisModule,
		AuthModule,
		PasswordModule,
		EmailVerificationModule,
		UsersModule,
		TutorChatsModule,
		MessagesModule,
		FilesModule,
		ContextFilesModule
	],
	providers: [
		{ provide: APP_PIPE, useClass: SanitizationPipe },
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor
		},
		{
			provide: APP_FILTER,
			useClass: CsrfFilter
		},
		{
			provide: APP_FILTER,
			useClass: SentryGlobalFilter
		},
		{
			provide: APP_FILTER,
			useClass: ThrottlerExceptionFilter
		}
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(SecurityHeadersMiddleware).forRoutes("*path");
	}
}
