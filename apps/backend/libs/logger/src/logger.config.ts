import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as path from 'path';
import * as winston from 'winston';

// Define log levels with priorities
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Determine log level based on NODE_ENV
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Format for development - colorized console output
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, context, trace, ...meta } = info;

    const contextStr = typeof context === 'string' ? `[${context}]` : '';
    let log = `${String(timestamp)} [${String(level)}] ${contextStr} ${String(message)}`;

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }

    // Add stack trace for errors
    if (trace && typeof trace === 'string') {
      log += `\n${trace}`;
    }

    return log;
  }),
);

// Format for production - JSON for log aggregation services
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Function to get transports (lazy initialization)
const getTransports = (): winston.transport[] => {
  const transports: winston.transport[] = [];

  // Console transport (always enabled)
  transports.push(
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'production'
          ? productionFormat
          : developmentFormat,
    }),
  );

  // File transports (only in production or if explicitly enabled)
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.ENABLE_FILE_LOGGING === 'true'
  ) {
    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');

    // Error logs
    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        format: productionFormat,
        maxsize: 10485760, // 10MB
        maxFiles: 5,
        tailable: true,
      }),
    );

    // Combined logs
    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        format: productionFormat,
        maxsize: 10485760, // 10MB
        maxFiles: 5,
        tailable: true,
      }),
    );

    // HTTP logs (for request/response tracking)
    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, 'http.log'),
        level: 'http',
        format: productionFormat,
        maxsize: 10485760, // 10MB
        maxFiles: 3,
        tailable: true,
      }),
    );
  }

  return transports;
};

let colorsInitialized = false;
const initializeColors = () => {
  if (!colorsInitialized && winston.addColors) {
    winston.addColors(colors);
    colorsInitialized = true;
  }
};

export const getLoggerConfig = (): winston.LoggerOptions => {
  initializeColors();

  return {
    level: level(),
    levels,
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.metadata(),
      nestWinstonModuleUtilities.format.nestLike(process.env.APP_NAME, {
        colors: true,
        prettyPrint: true,
        processId: true,
        appName: true,
      }),
    ),
    transports: getTransports(),
    exitOnError: false,
    exceptionHandlers: [
      new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
        format: productionFormat,
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'rejections.log'),
        format: productionFormat,
      }),
    ],
  };
};
