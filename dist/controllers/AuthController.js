"use strict";
/**
 * AuthController - HTTP request handlers for authentication endpoints
 * Handles login and registration API endpoints
 * Requirements: 6.3, 6.4, 2.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const UserService_1 = require("../services/UserService");
class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
        /**
         * POST /api/auth/login
         * Authenticate user and return JWT token
         * Requirements: 6.3, 6.4
         * Note: Validation is handled by middleware
         */
        this.login = async (req, res, next) => {
            try {
                const { email } = req.body;
                // Authenticate user
                const authResponse = await this.authService.authenticate(email);
                // Return token and user object
                res.status(200).json(authResponse);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * POST /api/auth/register
         * Register new user and return JWT token
         * Requirements: 2.1, 6.4
         * Note: Validation is handled by middleware
         */
        this.register = async (req, res, next) => {
            try {
                const { name, email } = req.body;
                // Create new user
                const user = await this.userService.createUser({ name, email });
                // Generate JWT token for the new user
                const token = this.authService.generateToken(user);
                // Return token and user object
                res.status(201).json({
                    token,
                    user,
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.AuthController = AuthController;
// Export singleton instance
exports.authController = new AuthController(AuthService_1.authService, UserService_1.userService);
