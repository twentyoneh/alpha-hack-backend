"use strict";
/**
 * Request Validation Schemas
 * Centralized validation schemas for all API endpoints
 * Requirements: 4.4, 6.2
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.sessionIdMessageParamSchema = exports.createMessageSchema = exports.sessionIdParamSchema = exports.createSessionSchema = exports.registerSchema = exports.loginSchema = void 0;
exports.validate = validate;
exports.validateMultiple = validateMultiple;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
/**
 * Authentication Schemas
 */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format')
        .min(1, 'Email is required')
        .max(255, 'Email must be less than 255 characters')
        .trim()
        .toLowerCase(),
});
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'Name is required' })
        .min(1, 'Name is required')
        .max(255, 'Name must be less than 255 characters')
        .trim(),
    email: zod_1.z
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
exports.createSessionSchema = zod_1.z.object({
    assistant_role: zod_1.z
        .string({ required_error: 'Assistant role is required' })
        .min(1, 'Assistant role is required')
        .max(255, 'Assistant role must be less than 255 characters')
        .trim(),
});
exports.sessionIdParamSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .regex(/^\d+$/, 'Session ID must be a positive integer')
        .transform(val => parseInt(val, 10))
        .refine(val => val > 0, 'Session ID must be a positive integer'),
});
/**
 * Message Schemas
 */
exports.createMessageSchema = zod_1.z.object({
    session_id: zod_1.z
        .number({ required_error: 'Session ID is required' })
        .int('Session ID must be an integer')
        .positive('Session ID must be a positive integer'),
    role: zod_1.z.enum(['user', 'assistant', 'system'], {
        errorMap: () => ({ message: 'Role must be one of: user, assistant, system' }),
    }),
    text: zod_1.z
        .string({ required_error: 'Message text is required' })
        .min(1, 'Message text is required')
        .max(10000, 'Message text must be less than 10000 characters'),
});
exports.sessionIdMessageParamSchema = zod_1.z.object({
    session_id: zod_1.z
        .string()
        .regex(/^\d+$/, 'Session ID must be a positive integer')
        .transform(val => parseInt(val, 10))
        .refine(val => val > 0, 'Session ID must be a positive integer'),
});
/**
 * Pagination Schema
 */
exports.paginationSchema = zod_1.z.object({
    limit: zod_1.z
        .string()
        .optional()
        .default('50')
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val) && val >= 1 && val <= 100, {
        message: 'Limit must be between 1 and 100',
    }),
    offset: zod_1.z
        .string()
        .optional()
        .default('0')
        .transform(val => parseInt(val, 10))
        .refine(val => !isNaN(val) && val >= 0, {
        message: 'Offset must be a non-negative integer',
    }),
});
function validate(schema, target = 'body') {
    return (req, res, next) => {
        try {
            const data = req[target];
            const validationResult = schema.safeParse(data);
            if (!validationResult.success) {
                const firstError = validationResult.error.errors[0];
                throw new errors_1.ValidationError(firstError.message);
            }
            // Replace the request data with validated and transformed data
            req[target] = validationResult.data;
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
/**
 * Validate multiple targets at once
 */
function validateMultiple(validations) {
    return (req, res, next) => {
        try {
            for (const { schema, target } of validations) {
                const data = req[target];
                const validationResult = schema.safeParse(data);
                if (!validationResult.success) {
                    const firstError = validationResult.error.errors[0];
                    throw new errors_1.ValidationError(firstError.message);
                }
                // Replace the request data with validated and transformed data
                req[target] = validationResult.data;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
