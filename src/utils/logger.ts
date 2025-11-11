/**
 * Logger Utility - Structured logging with JSON format
 * Requirements: 8.5
 */

import winston from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Define colors for console output (development)
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(colors);

// Determine log level from environment variable
const level = process.env.LOG_LEVEL || 'info';

// Create format for structured JSON logging
const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create format for console output (development)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Create transports based on environment
const transports: winston.transport[] = [];

if (process.env.NODE_ENV === 'production') {
  // Production: JSON format to stdout
  transports.push(
    new winston.transports.Console({
      format: jsonFormat,
    })
  );
} else {
  // Development: Human-readable format to console
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Create the logger instance
export const logger = winston.createLogger({
  level,
  levels,
  transports,
  exitOnError: false,
});

/**
 * Log an error with context
 */
export function logError(message: string, error?: Error, context?: Record<string, any>): void {
  logger.error(message, {
    error: error?.name,
    errorMessage: error?.message,
    stack: error?.stack,
    ...context,
  });
}

/**
 * Log a warning with context
 */
export function logWarn(message: string, context?: Record<string, any>): void {
  logger.warn(message, context);
}

/**
 * Log info with context
 */
export function logInfo(message: string, context?: Record<string, any>): void {
  logger.info(message, context);
}

/**
 * Log debug information with context
 */
export function logDebug(message: string, context?: Record<string, any>): void {
  logger.debug(message, context);
}

/**
 * Log API request for audit purposes
 * Requirement 8.5: Log all API requests with user_id
 */
export function logRequest(
  method: string,
  path: string,
  userId: number | null,
  statusCode?: number,
  duration?: number
): void {
  logger.info('API Request', {
    type: 'api_request',
    method,
    path,
    userId,
    statusCode,
    duration,
  });
}

export default logger;
