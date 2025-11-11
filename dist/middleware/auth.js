"use strict";
/**
 * Authentication and Authorization Middleware
 * Requirements: 6.1, 6.2, 6.5, 5.5
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorizeSessionAccess = authorizeSessionAccess;
const AuthService_1 = require("../services/AuthService");
const SessionService_1 = require("../services/SessionService");
const errors_1 = require("../utils/errors");
/**
 * Extract JWT token from Authorization header
 * Supports "Bearer <token>" format
 */
function extractTokenFromHeader(authHeader) {
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
async function authenticate(req, res, next) {
    try {
        // Extract token from Authorization header
        const token = extractTokenFromHeader(req.headers.authorization);
        if (!token) {
            throw new errors_1.UnauthorizedError('No token provided');
        }
        // Verify token and extract payload
        const payload = AuthService_1.authService.verifyToken(token);
        // Add user context to request
        req.user = {
            userId: payload.userId,
            email: payload.email,
        };
        next();
    }
    catch (error) {
        // Handle authentication errors with proper HTTP status codes
        if (error instanceof errors_1.UnauthorizedError) {
            next(error);
        }
        else if (error instanceof Error) {
            // Convert generic errors to UnauthorizedError
            next(new errors_1.UnauthorizedError(error.message));
        }
        else {
            next(new errors_1.UnauthorizedError('Authentication failed'));
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
async function authorizeSessionAccess(req, res, next) {
    try {
        // Ensure user is authenticated
        if (!req.user) {
            throw new errors_1.UnauthorizedError('Authentication required');
        }
        // Extract session ID from request params
        const sessionIdParam = req.params.id || req.params.session_id;
        if (!sessionIdParam) {
            throw new errors_1.ForbiddenError('Session ID is required');
        }
        const sessionId = parseInt(sessionIdParam, 10);
        if (isNaN(sessionId) || sessionId <= 0) {
            throw new errors_1.ForbiddenError('Invalid session ID');
        }
        // Verify session ownership
        const hasAccess = await SessionService_1.sessionService.verifySessionOwnership(sessionId, req.user.userId);
        if (!hasAccess) {
            throw new errors_1.ForbiddenError('Access denied to this session');
        }
        next();
    }
    catch (error) {
        // Handle authorization errors with proper HTTP status codes
        if (error instanceof errors_1.ForbiddenError || error instanceof errors_1.UnauthorizedError) {
            next(error);
        }
        else if (error instanceof Error) {
            next(new errors_1.ForbiddenError(error.message));
        }
        else {
            next(new errors_1.ForbiddenError('Authorization failed'));
        }
    }
}
