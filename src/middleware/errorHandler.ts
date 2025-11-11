/**
 * Global Error Handler Middleware
 * Requirements: 3.3, 4.4, 5.3, 6.2, 8.5
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logError, logInfo } from '../utils/logger';

/**
 * Error response format
 * Provides consistent error structure across all API responses
 */
export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: any;
  };
}

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
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Handle operational errors (AppError and its subclasses)
  if (err instanceof AppError) {
    // Log operational errors at info level with request context
    logInfo('Operational error', {
      type: 'operational_error',
      error: err.constructor.name,
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
      userId: req.user?.userId || null,
    });

    const errorResponse: ErrorResponse = {
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
  logError('Unexpected error', err, {
    type: 'unexpected_error',
    path: req.path,
    method: req.method,
    userId: req.user?.userId || null,
  });

  // Don't expose internal error details to client
  const errorResponse: ErrorResponse = {
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
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
