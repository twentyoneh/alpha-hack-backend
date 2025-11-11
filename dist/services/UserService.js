"use strict";
/**
 * UserService - Business logic layer for User management
 * Handles user creation, retrieval, and validation
 * Requirements: 2.1, 6.4
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const errors_1 = require("../utils/errors");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Create a new user with validation
     * Requirement 2.1: User model with id, name, email fields
     * Requirement 6.4: User validation logic
     */
    async createUser(data) {
        // Validate user data
        this.validateUserData(data);
        // Check if email already exists (if provided)
        if (data.email) {
            const existingUser = await this.userRepository.findByEmail(data.email);
            if (existingUser) {
                throw new errors_1.ValidationError('User with this email already exists');
            }
        }
        // Create user
        return await this.userRepository.create(data);
    }
    /**
     * Find user by ID
     * Requirement 2.1: User retrieval operations
     */
    async findUserById(id) {
        if (!id || id <= 0) {
            throw new errors_1.ValidationError('Invalid user ID');
        }
        return await this.userRepository.findById(id);
    }
    /**
     * Find user by email
     * Requirement 6.4: User authentication support
     */
    async findUserByEmail(email) {
        if (!email || email.trim() === '') {
            throw new errors_1.ValidationError('Email is required');
        }
        return await this.userRepository.findByEmail(email);
    }
    /**
     * Validate user data
     * Requirement 6.4: User validation logic
     */
    validateUserData(data) {
        if (!data.name || data.name.trim() === '') {
            throw new errors_1.ValidationError('Name is required');
        }
        if (data.name.length > 255) {
            throw new errors_1.ValidationError('Name must be less than 255 characters');
        }
        if (data.email) {
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new errors_1.ValidationError('Invalid email format');
            }
            if (data.email.length > 255) {
                throw new errors_1.ValidationError('Email must be less than 255 characters');
            }
        }
    }
}
exports.UserService = UserService;
// Export singleton instance
exports.userService = new UserService(UserRepository_1.userRepository);
