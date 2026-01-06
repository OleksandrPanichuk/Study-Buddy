import { Global, Module } from '@nestjs/common';
import { WinstonModule as NestWinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import { getLoggerConfig } from './logger.config';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [
    NestWinstonModule.forRoot({
      instance: createLogger(getLoggerConfig()),
    }),
  ],
  providers: [
    {
      provide: LoggerService,
      useFactory: () => {
        const logger = createLogger(getLoggerConfig());
        return new LoggerService(logger);
      },
    },
  ],
  exports: [LoggerService, NestWinstonModule],
})
export class LoggerModule {}
