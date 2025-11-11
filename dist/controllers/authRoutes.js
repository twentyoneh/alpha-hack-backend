"use strict";
/**
 * Authentication routes
 * Defines API endpoints for authentication
 * Requirements: 6.2, 6.3, 6.4
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("./AuthController");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
/**
 * POST /api/auth/login
 * Authenticate user with email and return JWT token
 * Requirements: 6.2 - Rate limiting for auth endpoints
 * Requirements: 6.3, 6.4 - Authentication with validation
 */
router.post('/login', middleware_1.authRateLimiter, (0, middleware_1.validate)(middleware_1.loginSchema, 'body'), AuthController_1.authController.login);
/**
 * POST /api/auth/register
 * Register new user and return JWT token
 * Requirements: 6.2 - Rate limiting for auth endpoints
 * Requirements: 6.4 - User registration with validation
 */
router.post('/register', middleware_1.authRateLimiter, (0, middleware_1.validate)(middleware_1.registerSchema, 'body'), AuthController_1.authController.register);
exports.default = router;
