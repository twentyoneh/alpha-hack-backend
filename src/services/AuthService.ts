/**
 * AuthService - Business logic layer for Authentication
 * Handles JWT token generation, verification, and user authentication
 * Requirements: 6.1, 6.3, 6.4, 6.5
 */

import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { IUserRepository, userRepository } from '../repositories/UserRepository';
import { ValidationError, UnauthorizedError } from '../utils/errors';

export interface JWTPayload {
  userId: number;
  email: string | null;
  iat: number;
  exp: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface IAuthService {
  authenticate(email: string): Promise<AuthResponse>;
  generateToken(user: User): string;
  verifyToken(token: string): JWTPayload;
}

export class AuthService implements IAuthService {
  private jwtSecret: string;
  private jwtExpiration: string | number;

  constructor(private userRepository: IUserRepository) {
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
  async authenticate(email: string): Promise<AuthResponse> {
    // Validate email
    if (!email || email.trim() === '') {
      throw new ValidationError('Email is required');
    }

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
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
  generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration,
    } as jwt.SignOptions);
  }

  /**
   * Verify and decode JWT token
   * Requirement 6.5: Validate authentication token on API requests
   * Requirement 6.1: Token verification support
   */
  verifyToken(token: string): JWTPayload {
    if (!token || token.trim() === '') {
      throw new UnauthorizedError('Token is required');
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid token');
      } else {
        throw new UnauthorizedError('Token verification failed');
      }
    }
  }
}

// Export singleton instance
export const authService = new AuthService(userRepository);
