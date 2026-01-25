import { LoggerModule } from "@app/logger";
import { PrismaModule } from "@app/prisma";
import { RedisModule } from "@app/redis";
import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerModule } from "@nestjs/throttler";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";
import { CsrfFilter } from "ncsrf";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";
import { AuthModule } from "@/auth/auth.module";
import { envSchema } from "@/shared/config";
import { RATE_LIMITS } from "@/shared/constants";
import { ThrottlerExceptionFilter } from "@/shared/filters";
import { LoggingInterceptor } from "@/shared/interceptors";
import { SecurityHeadersMiddleware } from "@/shared/middlewares";
import { SanitizationPipe } from "@/shared/pipes";
import { UsersModule } from "@/users/users.module";
import { TutorChatsModule } from './tutor-chats/tutor-chats.module';

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
		ScheduleModule.forRoot(),
		SentryModule.forRoot(),
		LoggerModule,
		PrismaModule,
		RedisModule,
		AuthModule,
		UsersModule,
		TutorChatsModule
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
