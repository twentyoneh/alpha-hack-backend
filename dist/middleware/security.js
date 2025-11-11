"use strict";
/**
 * Security Middleware
 * Implements rate limiting, CORS, and input sanitization
 * Requirements: 4.4, 6.2
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL_ENCODED_LIMIT = exports.REQUEST_SIZE_LIMIT = exports.xssProtection = exports.sanitizeInput = exports.helmetConfig = exports.corsOptions = exports.authRateLimiter = exports.apiRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
/**
 * Rate Limiter Configuration
 * Protects API from abuse by limiting requests per IP
 * Requirement: 4.4 - Prevent abuse through rate limiting
 */
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: {
            message: 'Too many requests from this IP, please try again later',
            code: 'RATE_LIMIT_EXCEEDED',
            statusCode: 429,
        },
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip rate limiting for health check endpoint
    skip: (req) => req.path === '/health',
});
/**
 * Stricter rate limiter for authentication endpoints
 * Prevents brute force attacks on login/register
 * Requirement: 6.2 - Protect authentication endpoints
 */
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    message: {
        error: {
            message: 'Too many authentication attempts, please try again later',
            code: 'AUTH_RATE_LIMIT_EXCEEDED',
            statusCode: 429,
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * CORS Configuration
 * Controls which origins can access the API
 * Requirement: 4.4 - Configure CORS for security
 */
exports.corsOptions = (0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }
        // Get allowed origins from environment variable or use defaults
        const allowedOrigins = process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',')
            : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'];
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // Cache preflight requests for 24 hours
});
/**
 * Helmet Configuration
 * Sets various HTTP headers for security
 * Requirement: 4.4 - Add security headers
 */
exports.helmetConfig = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    },
});
/**
 * Input Sanitization Middleware
 * Removes potentially dangerous characters from user input
 * Requirement: 4.4 - Sanitize user input to prevent XSS
 */
exports.sanitizeInput = (0, express_mongo_sanitize_1.default)({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`Sanitized input detected in ${req.path}: ${key}`);
    },
});
/**
 * XSS Protection Middleware
 * Additional layer to prevent XSS attacks by sanitizing strings
 * Requirement: 4.4 - Prevent XSS attacks
 */
const xssProtection = (req, res, next) => {
    // Sanitize request body
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    // Sanitize query parameters
    if (req.query) {
        req.query = sanitizeObject(req.query);
    }
    // Sanitize URL parameters
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }
    next();
};
exports.xssProtection = xssProtection;
/**
 * Recursively sanitize an object to prevent XSS
 * Removes potentially dangerous HTML/script tags
 */
function sanitizeObject(obj) {
    if (typeof obj === 'string') {
        return sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }
    if (obj !== null && typeof obj === 'object') {
        const sanitized = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                sanitized[key] = sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    }
    return obj;
}
/**
 * Sanitize a string to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 */
function sanitizeString(str) {
    if (typeof str !== 'string')
        return str;
    // Remove HTML tags
    let sanitized = str.replace(/<[^>]*>/g, '');
    // Remove potentially dangerous characters
    sanitized = sanitized
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<script/gi, '')
        .replace(/<\/script>/gi, '');
    return sanitized;
}
/**
 * Request Size Limit Configuration
 * Prevents large payloads from overwhelming the server
 * Requirement: 4.4 - Add request size limits
 */
exports.REQUEST_SIZE_LIMIT = '10mb'; // Maximum request body size
exports.URL_ENCODED_LIMIT = '10mb'; // Maximum URL-encoded data size
