"use strict";
/**
 * SessionRepository - Data access layer for Session model
 * Implements CRUD operations for Session entity with cascade delete support
 * Requirements: 2.2, 2.4, 2.5, 8.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRepository = exports.SessionRepository = void 0;
const database_1 = require("../utils/database");
class SessionRepository {
    /**
     * Create a new session
     * Requirement 2.2: Session model with id, user_id, assistant_role, timestamp
     */
    async create(data) {
        return await database_1.prisma.session.create({
            data: {
                userId: data.userId,
                assistantRole: data.assistantRole,
                timestamp: new Date(),
            },
        });
    }
    /**
     * Find session by ID
     * Requirement 8.1: Isolate user data by user_id in all queries
     */
    async findById(id) {
        return await database_1.prisma.session.findUnique({
            where: { id },
        });
    }
    /**
     * Find all sessions for a specific user with pagination
     * Requirement 8.1: Isolate user data by user_id in all queries
     */
    async findByUserId(userId, options = {}) {
        const { limit = 50, offset = 0, orderBy = 'desc' } = options;
        return await database_1.prisma.session.findMany({
            where: { userId },
            orderBy: { timestamp: orderBy },
            take: limit,
            skip: offset,
        });
    }
    /**
     * Delete a session by ID
     * Requirement 2.5: Cascade delete all associated messages
     * Requirement 2.4: Enforce referential integrity
     *
     * Note: Cascade delete is handled by Prisma schema (onDelete: Cascade)
     * All associated messages will be automatically deleted
     */
    async delete(id) {
        await database_1.prisma.session.delete({
            where: { id },
        });
    }
    /**
     * Count total sessions for a user
     * Used for pagination metadata
     */
    async count(userId) {
        return await database_1.prisma.session.count({
            where: { userId },
        });
    }
}
exports.SessionRepository = SessionRepository;
// Export singleton instance
exports.sessionRepository = new SessionRepository();
