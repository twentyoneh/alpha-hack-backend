/**
 * UserRepository - Data access layer for User model
 * Implements CRUD operations for User entity
 * Requirements: 2.1, 8.1
 */

import { prisma } from '../utils/database';
import { User } from '@prisma/client';
import { CreateUserDTO } from '../models/types';

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
  /**
   * Create a new user
   * Requirement 2.1: User model with id, name, email fields
   */
  async create(data: CreateUserDTO): Promise<User> {
    return await prisma.user.create({
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
  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find user by email
   * Requirement 8.1: Isolate user data by user_id in all queries
   */
  async findByEmail(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }
    
    return await prisma.user.findUnique({
      where: { email },
    });
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
