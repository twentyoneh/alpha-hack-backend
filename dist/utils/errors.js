"use strict";
/**
 * Custom Error Classes for Application Error Handling
 * Requirements: 3.3, 4.4, 5.3, 6.2, 8.5
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.ValidationError = exports.UnauthorizedError = exports.NotFoundError = exports.AppError = void 0;
/**
 * Base application error class
 * All custom errors extend from this class
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        // Maintains proper stack trace for where error was thrown
        Error.captureStackTrace(this, this.constructor);
        // Set the prototype explicitly to maintain instanceof checks
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
/**
 * NotFoundError - 404 errors
 * Used when a requested resource doesn't exist
 * Requirement 3.3: Handle invalid session_id with 404
 * Requirement 5.3: Handle invalid session_id with 404
 */
class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
exports.NotFoundError = NotFoundError;
/**
 * UnauthorizedError - 401 errors
 * Used when authentication is missing or invalid
 * Requirement 6.2: Return 401 for requests without valid authentication
 */
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
exports.UnauthorizedError = UnauthorizedError;
/**
 * ValidationError - 400 errors
 * Used when request data fails validation
 * Requirement 4.4: Return 400 for missing required fields
 */
class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
exports.ValidationError = ValidationError;
/**
 * ForbiddenError - 403 errors
 * Used when user doesn't have permission to access a resource
 * Requirement 5.5: Verify user ownership before operations
 */
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}
exports.ForbiddenError = ForbiddenError;
