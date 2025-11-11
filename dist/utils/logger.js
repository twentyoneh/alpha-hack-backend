"use strict";
/**
 * Logger Utility - Structured logging with JSON format
 * Requirements: 8.5
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logError = logError;
exports.logWarn = logWarn;
exports.logInfo = logInfo;
exports.logDebug = logDebug;
exports.logRequest = logRequest;
const winston_1 = __importDefault(require("winston"));
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
winston_1.default.addColors(colors);
// Determine log level from environment variable
const level = process.env.LOG_LEVEL || 'info';
// Create format for structured JSON logging
const jsonFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
// Create format for console output (development)
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
}));
// Create transports based on environment
const transports = [];
if (process.env.NODE_ENV === 'production') {
    // Production: JSON format to stdout
    transports.push(new winston_1.default.transports.Console({
        format: jsonFormat,
    }));
}
else {
    // Development: Human-readable format to console
    transports.push(new winston_1.default.transports.Console({
        format: consoleFormat,
    }));
}
// Create the logger instance
exports.logger = winston_1.default.createLogger({
    level,
    levels,
    transports,
    exitOnError: false,
});
/**
 * Log an error with context
 */
function logError(message, error, context) {
    exports.logger.error(message, {
        error: error?.name,
        errorMessage: error?.message,
        stack: error?.stack,
        ...context,
    });
}
/**
 * Log a warning with context
 */
function logWarn(message, context) {
    exports.logger.warn(message, context);
}
/**
 * Log info with context
 */
function logInfo(message, context) {
    exports.logger.info(message, context);
}
/**
 * Log debug information with context
 */
function logDebug(message, context) {
    exports.logger.debug(message, context);
}
/**
 * Log API request for audit purposes
 * Requirement 8.5: Log all API requests with user_id
 */
function logRequest(method, path, userId, statusCode, duration) {
    exports.logger.info('API Request', {
        type: 'api_request',
        method,
        path,
        userId,
        statusCode,
        duration,
    });
}
exports.default = exports.logger;
