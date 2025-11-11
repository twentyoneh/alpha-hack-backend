/**
 * Authentication and Authorization Middleware
 * Requirements: 6.1, 6.2, 6.5, 5.5
 */

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService';
import { sessionService } from '../services/SessionService';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

// Extend Express Request type to include user context
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string | null;
      };
    }
  }
}

/**
 * Extract JWT token from Authorization header
 * Supports "Bearer <token>" format
 */
function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  // Check for Bearer token format
  const parts = authHeader.split(' ');
  
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }

  // If no Bearer prefix, treat entire header as token
  return authHeader;
}

/**
 * Authentication middleware - verifies JWT tokens
 * Requirement 6.1: Token-based authentication
 * Requirement 6.2: Return 401 for invalid/missing authentication
 * Requirement 6.5: Validate authentication token on protected API requests
 * 
 * Extracts and verifies JWT token from Authorization header,
 * adds user context to request object
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Verify token and extract payload
    const payload = authService.verifyToken(token);

    // Add user context to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    // Handle authentication errors with proper HTTP status codes
    if (error instanceof UnauthorizedError) {
      next(error);
    } else if (error instanceof Error) {
      // Convert generic errors to UnauthorizedError
      next(new UnauthorizedError(error.message));
    } else {
      next(new UnauthorizedError('Authentication failed'));
    }
  }
}

/**
 * Authorization middleware - verifies session ownership
 * Requirement 5.5: Verify user ownership before allowing session operations
 * 
 * Checks if the authenticated user owns the session specified in the request.
 * Must be used after authenticate middleware.
 */
export async function authorizeSessionAccess(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // Extract session ID from request params
    const sessionIdParam = req.params.id || req.params.session_id;
    
    if (!sessionIdParam) {
      throw new ForbiddenError('Session ID is required');
    }

    const sessionId = parseInt(sessionIdParam, 10);

    if (isNaN(sessionId) || sessionId <= 0) {
      throw new ForbiddenError('Invalid session ID');
    }

    // Verify session ownership
    const hasAccess = await sessionService.verifySessionOwnership(
      sessionId,
      req.user.userId
    );

    if (!hasAccess) {
      throw new ForbiddenError('Access denied to this session');
    }

    next();
  } catch (error) {
    // Handle authorization errors with proper HTTP status codes
    if (error instanceof ForbiddenError || error instanceof UnauthorizedError) {
      next(error);
    } else if (error instanceof Error) {
      next(new ForbiddenError(error.message));
    } else {
      next(new ForbiddenError('Authorization failed'));
    }
  }
}
