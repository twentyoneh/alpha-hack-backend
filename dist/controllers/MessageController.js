"use strict";
/**
 * MessageController - HTTP request handlers for message history endpoints
 * Handles message retrieval and creation API endpoints
 * Requirements: 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 4.5
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = exports.MessageController = void 0;
const MessageService_1 = require("../services/MessageService");
const SessionService_1 = require("../services/SessionService");
const errors_1 = require("../utils/errors");
class MessageController {
    constructor(messageService, sessionService) {
        this.messageService = messageService;
        this.sessionService = sessionService;
        /**
         * GET /api/history/{session_id}
         * Retrieve message history for a session with pagination
         * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
         * Note: Validation is handled by middleware
         */
        this.getMessageHistory = async (req, res, next) => {
            try {
                // Ensure user is authenticated
                if (!req.user) {
                    throw new errors_1.ValidationError('Authentication required');
                }
                // Extract session ID (already validated by middleware)
                const sessionId = Number(req.params.session_id);
                // Verify session ownership
                const hasAccess = await this.sessionService.verifySessionOwnership(sessionId, req.user.userId);
                if (!hasAccess) {
                    throw new errors_1.ForbiddenError('Access denied to this session');
                }
                const { limit, offset } = req.query;
                // Get message history with pagination
                const result = await this.messageService.getSessionMessages(sessionId, { limit: Number(limit), offset: Number(offset) });
                // Return messages in chronological order with JSON format
                res.status(200).json({
                    messages: result.data.map(message => ({
                        id: message.id,
                        role: message.role,
                        text: message.text,
                        timestamp: message.timestamp,
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
         * POST /api/message
         * Create a new message in a session
         * Requirements: 2.3, 4.5
         * Note: Validation is handled by middleware
         */
        this.createMessage = async (req, res, next) => {
            try {
                // Ensure user is authenticated
                if (!req.user) {
                    throw new errors_1.ValidationError('Authentication required');
                }
                const { session_id, role, text } = req.body;
                // Verify session ownership before creating message
                const hasAccess = await this.sessionService.verifySessionOwnership(session_id, req.user.userId);
                if (!hasAccess) {
                    throw new errors_1.ForbiddenError('Access denied to this session');
                }
                // Create message (timestamp is set to current server time by service)
                const message = await this.messageService.createMessage({
                    sessionId: session_id,
                    role,
                    text,
                });
                // Return created message object
                res.status(201).json({
                    id: message.id,
                    session_id: message.sessionId,
                    role: message.role,
                    text: message.text,
                    timestamp: message.timestamp,
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.MessageController = MessageController;
// Export singleton instance
exports.messageController = new MessageController(MessageService_1.messageService, SessionService_1.sessionService);
