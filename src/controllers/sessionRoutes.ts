/**
 * Session management routes
 * Defines API endpoints for session operations
 * Requirements: 4.1, 4.4, 5.1, 8.1
 */

import { Router } from 'express';
import { sessionController } from './SessionController';
import {
  authenticate,
  authorizeSessionAccess,
  validate,
  createSessionSchema,
  sessionIdParamSchema,
  paginationSchema,
} from '../middleware';

const router = Router();

/**
 * POST /api/session
 * Create a new session for the authenticated user
 * Requires authentication and input validation
 * Requirements: 4.1, 4.4 - Session creation with validation
 */
router.post(
  '/session',
  authenticate,
  validate(createSessionSchema, 'body'),
  sessionController.createSession
);

/**
 * GET /api/sessions
 * List all sessions for the authenticated user with pagination
 * Requires authentication and query validation
 * Requirements: 8.1, 4.4 - Session listing with pagination validation
 */
router.get(
  '/sessions',
  authenticate,
  validate(paginationSchema, 'query'),
  sessionController.getUserSessions
);

/**
 * DELETE /api/session/{id}
 * Delete a session and all associated messages
 * Requires authentication, param validation, and session ownership verification
 * Requirements: 5.1, 4.4 - Session deletion with validation
 */
router.delete(
  '/session/:id',
  authenticate,
  validate(sessionIdParamSchema, 'params'),
  authorizeSessionAccess,
  sessionController.deleteSession
);

export default router;
