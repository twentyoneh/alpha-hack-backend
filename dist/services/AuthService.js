"use strict";
/**
 * AuthService - Business logic layer for Authentication
 * Handles JWT token generation, verification, and user authentication
 * Requirements: 6.1, 6.3, 6.4, 6.5
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../repositories/UserRepository");
const errors_1 = require("../utils/errors");
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        // Load JWT configuration from environment variables
        this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
        this.jwtExpiration = process.env.JWT_EXPIRATION || '1h';
        if (this.jwtSecret === 'default-secret-key' && process.env.NODE_ENV === 'production') {
            console.warn('WARNING: Using default JWT secret in production. Please set JWT_SECRET environment variable.');
        }
    }
    /**
     * Authenticate user and return JWT token
     * Requirement 6.3: POST /api/auth/login endpoint support
     * Requirement 6.4: Return authentication token on valid credentials
     */
    async authenticate(email) {
        // Validate email
        if (!email || email.trim() === '') {
            throw new errors_1.ValidationError('Email is required');
        }
        // Find user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        // Generate JWT token
        const token = this.generateToken(user);
        return {
            token,
            user,
        };
    }
    /**
     * Generate JWT token for a user
     * Requirement 6.1: Token-based authentication support
     * Requirement 6.4: Generate authentication token
     */
    generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
        };
        return jsonwebtoken_1.default.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiration,
        });
    }
    /**
     * Verify and decode JWT token
     * Requirement 6.5: Validate authentication token on API requests
     * Requirement 6.1: Token verification support
     */
    verifyToken(token) {
        if (!token || token.trim() === '') {
            throw new errors_1.UnauthorizedError('Token is required');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            return decoded;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errors_1.UnauthorizedError('Token has expired');
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errors_1.UnauthorizedError('Invalid token');
            }
            else {
                throw new errors_1.UnauthorizedError('Token verification failed');
            }
        }
    }
}
exports.AuthService = AuthService;
// Export singleton instance
exports.authService = new AuthService(UserRepository_1.userRepository);
