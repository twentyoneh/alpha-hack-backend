"use strict";
/**
 * UserRepository - Data access layer for User model
 * Implements CRUD operations for User entity
 * Requirements: 2.1, 8.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const database_1 = require("../utils/database");
class UserRepository {
    /**
     * Create a new user
     * Requirement 2.1: User model with id, name, email fields
     */
    async create(data) {
        return await database_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email || null,
            },
        });
    }
    /**
     * Find user by ID
     * Requirement 8.1: Isolate user data by user_id in all queries
     */
    async findById(id) {
        return await database_1.prisma.user.findUnique({
            where: { id },
        });
    }
    /**
     * Find user by email
     * Requirement 8.1: Isolate user data by user_id in all queries
     */
    async findByEmail(email) {
        if (!email) {
            return null;
        }
        return await database_1.prisma.user.findUnique({
            where: { email },
        });
    }
}
exports.UserRepository = UserRepository;
// Export singleton instance
exports.userRepository = new UserRepository();
