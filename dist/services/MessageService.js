"use strict";
/**
 * MessageService - Business logic layer for Message management
 * Handles message creation, retrieval, and deletion
 * Requirements: 2.3, 3.1, 3.2, 3.4, 3.5
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = exports.MessageService = void 0;
const MessageRepository_1 = require("../repositories/MessageRepository");
const SessionRepository_1 = require("../repositories/SessionRepository");
const errors_1 = require("../utils/errors");
class MessageService {
    constructor(messageRepository, sessionRepository) {
        this.messageRepository = messageRepository;
        this.sessionRepository = sessionRepository;
    }
    /**
     * Create a new message with timestamp generation
     * Requirement 2.3: Message model with id, session_id, role, text, timestamp
     * Requirement 3.1: Support message creation
     */
    async createMessage(data) {
        // Validate inputs
        if (!data.sessionId || data.sessionId <= 0) {
            throw new errors_1.ValidationError('Invalid session ID');
        }
        if (!data.role || data.role.trim() === '') {
            throw new errors_1.ValidationError('Role is required');
        }
        // Validate role is one of the allowed values
        const validRoles = ['user', 'assistant', 'system'];
        if (!validRoles.includes(data.role)) {
            throw new errors_1.ValidationError('Role must be one of: user, assistant, system');
        }
        if (!data.text || data.text.trim() === '') {
            throw new errors_1.ValidationError('Message text is required');
        }
        if (data.text.length > 10000) {
            throw new errors_1.ValidationError('Message text must be less than 10000 characters');
        }
        // Verify session exists
        const session = await this.sessionRepository.findById(data.sessionId);
        if (!session) {
            throw new errors_1.NotFoundError('Session');
        }
        // Create message with timestamp (handled by repository)
        return await this.messageRepository.create({
            sessionId: data.sessionId,
            role: data.role,
            text: data.text.trim(),
        });
    }
    /**
     * Get all messages for a session with pagination
     * Requirement 3.2: Retrieve message history
     * Requirement 3.4: Pagination support with limit and offset
     * Requirement 3.5: Return messages in chronological order
     */
    async getSessionMessages(sessionId, pagination) {
        // Validate inputs
        if (!sessionId || sessionId <= 0) {
            throw new errors_1.ValidationError('Invalid session ID');
        }
        const limit = pagination.limit || 50;
        const offset = pagination.offset || 0;
        if (limit <= 0 || limit > 100) {
            throw new errors_1.ValidationError('Limit must be between 1 and 100');
        }
        if (offset < 0) {
            throw new errors_1.ValidationError('Offset must be non-negative');
        }
        // Verify session exists
        const session = await this.sessionRepository.findById(sessionId);
        if (!session) {
            throw new errors_1.NotFoundError('Session');
        }
        // Get messages and total count
        const [messages, total] = await Promise.all([
            this.messageRepository.findBySessionId(sessionId, { limit, offset, orderBy: 'asc' }),
            this.messageRepository.count(sessionId),
        ]);
        return {
            data: messages,
            total,
            limit,
            offset,
        };
    }
    /**
     * Delete all messages for a session (cascade delete)
     * Requirement 2.5: Support cascade delete operations
     *
     * Note: This is typically handled automatically by Prisma cascade delete
     * when a session is deleted, but provided for explicit service layer use
     */
    async deleteSessionMessages(sessionId) {
        if (!sessionId || sessionId <= 0) {
            throw new errors_1.ValidationError('Invalid session ID');
        }
        await this.messageRepository.deleteBySessionId(sessionId);
    }
}
exports.MessageService = MessageService;
// Export singleton instance
exports.messageService = new MessageService(MessageRepository_1.messageRepository, SessionRepository_1.sessionRepository);
