import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private context?: string;

  constructor(private readonly winstonLogger: Logger) {}

  public setContext(context: string): void {
    this.context = context;
  }

  public log(message: string, context?: string): void {
    this.winstonLogger.info(message, {
      context: context || this.context,
    });
  }

  public error(message: string, trace?: string, context?: string): void {
    this.winstonLogger.error(message, {
      context: context || this.context,
      trace,
    });
  }

  public warn(message: string, context?: string): void {
    this.winstonLogger.warn(message, {
      context: context || this.context,
    });
  }

  public debug(message: string, context?: string): void {
    this.winstonLogger.debug(message, {
      context: context || this.context,
    });
  }

  public verbose(message: string, context?: string): void {
    this.winstonLogger.http(message, {
      context: context || this.context,
    });
  }

  public logWithMetadata(
    level: 'info' | 'error' | 'warn' | 'debug' | 'http',
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.winstonLogger.log(level, message, {
      context: this.context,
      ...metadata,
    });
  }

  public logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
  ): void {
    this.winstonLogger.http('HTTP Request', {
      context: this.context,
      method,
      url,
      statusCode,
      duration,
    });
  }

  public logAuthEvent(
    event: string,
    userId?: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.winstonLogger.info(`Auth Event: ${event}`, {
      context: this.context || 'Auth',
      userId,
      event,
      ...metadata,
    });
  }

  public logDatabaseQuery(
    query: string,
    duration: number,
    metadata?: Record<string, unknown>,
  ): void {
    this.winstonLogger.debug('Database Query', {
      context: this.context || 'Database',
      query,
      duration,
      ...metadata,
    });
  }
}
