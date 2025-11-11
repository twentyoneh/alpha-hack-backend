/**
 * UserService - Business logic layer for User management
 * Handles user creation, retrieval, and validation
 * Requirements: 2.1, 6.4
 */

import { User } from '@prisma/client';
import { CreateUserDTO } from '../models/types';
import { IUserRepository, userRepository } from '../repositories/UserRepository';
import { ValidationError, NotFoundError } from '../utils/errors';

export interface IUserService {
  createUser(data: CreateUserDTO): Promise<User>;
  findUserById(id: number): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
}

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Create a new user with validation
   * Requirement 2.1: User model with id, name, email fields
   * Requirement 6.4: User validation logic
   */
  async createUser(data: CreateUserDTO): Promise<User> {
    // Validate user data
    this.validateUserData(data);

    // Check if email already exists (if provided)
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ValidationError('User with this email already exists');
      }
    }

    // Create user
    return await this.userRepository.create(data);
  }

  /**
   * Find user by ID
   * Requirement 2.1: User retrieval operations
   */
  async findUserById(id: number): Promise<User | null> {
    if (!id || id <= 0) {
      throw new ValidationError('Invalid user ID');
    }

    return await this.userRepository.findById(id);
  }

  /**
   * Find user by email
   * Requirement 6.4: User authentication support
   */
  async findUserByEmail(email: string): Promise<User | null> {
    if (!email || email.trim() === '') {
      throw new ValidationError('Email is required');
    }

    return await this.userRepository.findByEmail(email);
  }

  /**
   * Validate user data
   * Requirement 6.4: User validation logic
   */
  private validateUserData(data: CreateUserDTO): void {
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('Name is required');
    }

    if (data.name.length > 255) {
      throw new ValidationError('Name must be less than 255 characters');
    }

    if (data.email) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new ValidationError('Invalid email format');
      }

      if (data.email.length > 255) {
        throw new ValidationError('Email must be less than 255 characters');
      }
    }
  }
}

// Export singleton instance
export const userService = new UserService(userRepository);
