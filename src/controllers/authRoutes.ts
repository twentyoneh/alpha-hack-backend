/**
 * Authentication routes
 * Defines API endpoints for authentication
 * Requirements: 6.2, 6.3, 6.4
 */

import { Router } from 'express';
import { authController } from './AuthController';
import { authRateLimiter, validate, loginSchema, registerSchema } from '../middleware';

const router = Router();

/**
 * POST /api/auth/login
 * Authenticate user with email and return JWT token
 * Requirements: 6.2 - Rate limiting for auth endpoints
 * Requirements: 6.3, 6.4 - Authentication with validation
 */
router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema, 'body'),
  authController.login
);

/**
 * POST /api/auth/register
 * Register new user and return JWT token
 * Requirements: 6.2 - Rate limiting for auth endpoints
 * Requirements: 6.4 - User registration with validation
 */
router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema, 'body'),
  authController.register
);

export default router;
