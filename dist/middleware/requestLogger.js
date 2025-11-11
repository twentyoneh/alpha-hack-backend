"use strict";
/**
 * Request Logger Middleware
 * Logs all API requests with user_id for audit purposes
 * Requirements: 8.5
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const logger_1 = require("../utils/logger");
/**
 * Request logging middleware
 * Logs all incoming API requests with method, path, user_id, status code, and duration
 *
 * Requirement 8.5: Log all API requests with user_id for audit purposes
 */
function requestLogger(req, res, next) {
    const startTime = Date.now();
    // Capture the original end function
    const originalEnd = res.end.bind(res);
    // Override res.end to log after response is sent
    res.end = function (chunk, encoding, callback) {
        // Calculate request duration
        const duration = Date.now() - startTime;
        // Get user_id from authenticated request (if available)
        const userId = req.user?.userId || null;
        // Log the request
        (0, logger_1.logRequest)(req.method, req.path, userId, res.statusCode, duration);
        // Call the original end function
        return originalEnd(chunk, encoding, callback);
    };
    next();
}
