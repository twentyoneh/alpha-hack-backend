"use strict";
/**
 * SessionController - HTTP request handlers for session management endpoints
 * Handles session creation, listing, and deletion API endpoints
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 8.1, 8.4
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionController = exports.SessionController = void 0;
const SessionService_1 = require("../services/SessionService");
const errors_1 = require("../utils/errors");
class SessionController {
    constructor(sessionService) {
        this.sessionService = sessionService;
        /**
         * POST /api/session
         * Create a new session for the authenticated user
         * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
         * Note: Validation is handled by middleware
         */
        this.createSession = async (req, res, next) => {
            try {
                // Ensure user is authenticated
                if (!req.user) {
                    throw new errors_1.ValidationError('Authentication required');
                }
                const { assistant_role } = req.body;
                // Create session
                const session = await this.sessionService.createSession(req.user.userId, assistant_role);
                // Return created session with id and timestamp
                res.status(201).json({
                    id: session.id,
                    user_id: session.userId,
                    assistant_role: session.assistantRole,
                    timestamp: session.timestamp,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * GET /api/sessions
         * List all sessions for the authenticated user with pagination
         * Requirements: 8.1, 8.4
         * Note: Validation is handled by middleware
         */
        this.getUserSessions = async (req, res, next) => {
            try {
                // Ensure user is authenticated
                if (!req.user) {
                    throw new errors_1.ValidationError('Authentication required');
                }
                const { limit, offset } = req.query;
                // Get user sessions with pagination
                const result = await this.sessionService.getUserSessions(req.user.userId, { limit: Number(limit), offset: Number(offset) });
                // Return sessions array with total count
                res.status(200).json({
                    sessions: result.data.map(session => ({
                        id: session.id,
                        user_id: session.userId,
                        assistant_role: session.assistantRole,
                        timestamp: session.timestamp,
                        created_at: session.createdAt,
                    })),
                    total: result.total,
                    limit: result.limit,
                    offset: result.offset,
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * DELETE /api/session/{id}
         * Delete a session and all associated messages
         * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
         * Note: Validation is handled by middleware
         */
        this.deleteSession = async (req, res, next) => {
            try {
                // Ensure user is authenticated
                if (!req.user) {
                    throw new errors_1.ValidationError('Authentication required');
                }
                // Extract session ID (already validated by middleware)
                const sessionId = Number(req.params.id);
                // Delete session (ownership verification is done in service layer)
                await this.sessionService.deleteSession(sessionId, req.user.userId);
                // Return 204 status on success
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.SessionController = SessionController;
// Export singleton instance
exports.sessionController = new SessionController(SessionService_1.sessionService);
