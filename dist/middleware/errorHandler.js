"use strict";
/**
 * Global Error Handler Middleware
 * Requirements: 3.3, 4.4, 5.3, 6.2, 8.5
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.asyncHandler = asyncHandler;
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
/**
 * Global error handler middleware
 * Catches all errors thrown in the application and formats them consistently
 *
 * Requirement 3.3: Proper error handling for invalid requests
 * Requirement 4.4: Return 400 for missing required fields
 * Requirement 5.3: Return 404 for invalid session_id
 * Requirement 6.2: Return 401 for invalid authentication
 * Requirement 8.5: Log all errors for audit purposes
 */
function errorHandler(err, req, res, next) {
    // Handle operational errors (AppError and its subclasses)
    if (err instanceof errors_1.AppError) {
        // Log operational errors at info level with request context
        (0, logger_1.logInfo)('Operational error', {
            type: 'operational_error',
            error: err.constructor.name,
            message: err.message,
            statusCode: err.statusCode,
            path: req.path,
            method: req.method,
            userId: req.user?.userId || null,
        });
        const errorResponse = {
            error: {
                message: err.message,
                code: err.constructor.name,
                statusCode: err.statusCode,
            },
        };
        res.status(err.statusCode).json(errorResponse);
        return;
    }
    // Handle unexpected errors (programming errors, system errors)
    // Requirement 8.5: Log unexpected errors for debugging
    (0, logger_1.logError)('Unexpected error', err, {
        type: 'unexpected_error',
        path: req.path,
        method: req.method,
        userId: req.user?.userId || null,
    });
    // Don't expose internal error details to client
    const errorResponse = {
        error: {
            message: 'Internal server error',
            code: 'InternalServerError',
            statusCode: 500,
        },
    };
    res.status(500).json(errorResponse);
}
/**
 * Async error wrapper utility
 * Wraps async route handlers to catch errors and pass them to error handler
 *
 * Usage:
 * router.get('/path', asyncHandler(async (req, res) => {
 *   // async code that might throw
 * }))
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
