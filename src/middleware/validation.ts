/**
 * Request Validation Schemas
 * Centralized validation schemas for all API endpoints
 * Requirements: 4.4, 6.2
 */

import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

/**
 * Authentication Schemas
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase(),
});

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .toLowerCase()
    .optional(),
});

/**
 * Session Schemas
 */
export const createSessionSchema = z.object({
  assistant_role: z
    .string({ required_error: 'Assistant role is required' })
    .min(1, 'Assistant role is required')
    .max(255, 'Assistant role must be less than 255 characters')
    .trim(),
});

export const sessionIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Session ID must be a positive integer')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'Session ID must be a positive integer'),
});

/**
 * Message Schemas
 */
export const createMessageSchema = z.object({
  session_id: z
    .number({ required_error: 'Session ID is required' })
    .int('Session ID must be an integer')
    .positive('Session ID must be a positive integer'),
  role: z.enum(['user', 'assistant', 'system'], {
    errorMap: () => ({ message: 'Role must be one of: user, assistant, system' }),
  }),
  text: z
    .string({ required_error: 'Message text is required' })
    .min(1, 'Message text is required')
    .max(10000, 'Message text must be less than 10000 characters'),
});

export const sessionIdMessageParamSchema = z.object({
  session_id: z
    .string()
    .regex(/^\d+$/, 'Session ID must be a positive integer')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'Session ID must be a positive integer'),
});

/**
 * Pagination Schema
 */
export const paginationSchema = z.object({
  limit: z
    .string()
    .optional()
    .default('50')
    .transform(val => parseInt(val, 10))
    .refine(val => !isNaN(val) && val >= 1 && val <= 100, {
      message: 'Limit must be between 1 and 100',
    }),
  offset: z
    .string()
    .optional()
    .default('0')
    .transform(val => parseInt(val, 10))
    .refine(val => !isNaN(val) && val >= 0, {
      message: 'Offset must be a non-negative integer',
    }),
});

/**
 * Validation Middleware Factory
 * Creates middleware to validate request data against a schema
 */
type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: z.ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[target];
      const validationResult = schema.safeParse(data);

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        throw new ValidationError(firstError.message);
      }

      // Replace the request data with validated and transformed data
      (req as any)[target] = validationResult.data;

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Validate multiple targets at once
 */
export function validateMultiple(validations: Array<{ schema: z.ZodSchema; target: ValidationTarget }>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      for (const { schema, target } of validations) {
        const data = req[target];
        const validationResult = schema.safeParse(data);

        if (!validationResult.success) {
          const firstError = validationResult.error.errors[0];
          throw new ValidationError(firstError.message);
        }

        // Replace the request data with validated and transformed data
        (req as any)[target] = validationResult.data;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
