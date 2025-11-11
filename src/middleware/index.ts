/**
 * Middleware exports
 * Central export point for all middleware functions
 */

export { authenticate, authorizeSessionAccess } from './auth';
export { errorHandler, asyncHandler } from './errorHandler';
export { requestLogger } from './requestLogger';
export {
  apiRateLimiter,
  authRateLimiter,
  corsOptions,
  helmetConfig,
  sanitizeInput,
  xssProtection,
  REQUEST_SIZE_LIMIT,
  URL_ENCODED_LIMIT,
} from './security';
export {
  validate,
  validateMultiple,
  loginSchema,
  registerSchema,
  createSessionSchema,
  sessionIdParamSchema,
  createMessageSchema,
  sessionIdMessageParamSchema,
  paginationSchema,
} from './validation';
