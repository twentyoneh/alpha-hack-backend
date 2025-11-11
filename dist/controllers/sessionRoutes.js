"use strict";
/**
 * Session management routes
 * Defines API endpoints for session operations
 * Requirements: 4.1, 4.4, 5.1, 8.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SessionController_1 = require("./SessionController");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
/**
 * POST /api/session
 * Create a new session for the authenticated user
 * Requires authentication and input validation
 * Requirements: 4.1, 4.4 - Session creation with validation
 */
router.post('/session', middleware_1.authenticate, (0, middleware_1.validate)(middleware_1.createSessionSchema, 'body'), SessionController_1.sessionController.createSession);
/**
 * GET /api/sessions
 * List all sessions for the authenticated user with pagination
 * Requires authentication and query validation
 * Requirements: 8.1, 4.4 - Session listing with pagination validation
 */
router.get('/sessions', middleware_1.authenticate, (0, middleware_1.validate)(middleware_1.paginationSchema, 'query'), SessionController_1.sessionController.getUserSessions);
/**
 * DELETE /api/session/{id}
 * Delete a session and all associated messages
 * Requires authentication, param validation, and session ownership verification
 * Requirements: 5.1, 4.4 - Session deletion with validation
 */
router.delete('/session/:id', middleware_1.authenticate, (0, middleware_1.validate)(middleware_1.sessionIdParamSchema, 'params'), middleware_1.authorizeSessionAccess, SessionController_1.sessionController.deleteSession);
exports.default = router;
