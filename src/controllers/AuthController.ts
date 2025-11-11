/**
 * AuthController - HTTP request handlers for authentication endpoints
 * Handles login and registration API endpoints
 * Requirements: 6.3, 6.4, 2.1
 */

import { Request, Response, NextFunction } from 'express';
import { authService, IAuthService } from '../services/AuthService';
import { userService, IUserService } from '../services/UserService';

export class AuthController {
  constructor(
    private authService: IAuthService,
    private userService: IUserService
  ) {}

  /**
   * POST /api/auth/login
   * Authenticate user and return JWT token
   * Requirements: 6.3, 6.4
   * Note: Validation is handled by middleware
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      // Authenticate user
      const authResponse = await this.authService.authenticate(email);

      // Return token and user object
      res.status(200).json(authResponse);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/register
   * Register new user and return JWT token
   * Requirements: 2.1, 6.4
   * Note: Validation is handled by middleware
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    } catch (error) {
      next(error);
    }
  };
}

// Export singleton instance
export const authController = new AuthController(authService, userService);
