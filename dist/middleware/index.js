"use strict";
/**
 * Middleware exports
 * Central export point for all middleware functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.sessionIdMessageParamSchema = exports.createMessageSchema = exports.sessionIdParamSchema = exports.createSessionSchema = exports.registerSchema = exports.loginSchema = exports.validateMultiple = exports.validate = exports.URL_ENCODED_LIMIT = exports.REQUEST_SIZE_LIMIT = exports.xssProtection = exports.sanitizeInput = exports.helmetConfig = exports.corsOptions = exports.authRateLimiter = exports.apiRateLimiter = exports.requestLogger = exports.asyncHandler = exports.errorHandler = exports.authorizeSessionAccess = exports.authenticate = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return auth_1.authenticate; } });
Object.defineProperty(exports, "authorizeSessionAccess", { enumerable: true, get: function () { return auth_1.authorizeSessionAccess; } });
var errorHandler_1 = require("./errorHandler");
Object.defineProperty(exports, "errorHandler", { enumerable: true, get: function () { return errorHandler_1.errorHandler; } });
Object.defineProperty(exports, "asyncHandler", { enumerable: true, get: function () { return errorHandler_1.asyncHandler; } });
var requestLogger_1 = require("./requestLogger");
Object.defineProperty(exports, "requestLogger", { enumerable: true, get: function () { return requestLogger_1.requestLogger; } });
var security_1 = require("./security");
Object.defineProperty(exports, "apiRateLimiter", { enumerable: true, get: function () { return security_1.apiRateLimiter; } });
Object.defineProperty(exports, "authRateLimiter", { enumerable: true, get: function () { return security_1.authRateLimiter; } });
Object.defineProperty(exports, "corsOptions", { enumerable: true, get: function () { return security_1.corsOptions; } });
Object.defineProperty(exports, "helmetConfig", { enumerable: true, get: function () { return security_1.helmetConfig; } });
Object.defineProperty(exports, "sanitizeInput", { enumerable: true, get: function () { return security_1.sanitizeInput; } });
Object.defineProperty(exports, "xssProtection", { enumerable: true, get: function () { return security_1.xssProtection; } });
Object.defineProperty(exports, "REQUEST_SIZE_LIMIT", { enumerable: true, get: function () { return security_1.REQUEST_SIZE_LIMIT; } });
Object.defineProperty(exports, "URL_ENCODED_LIMIT", { enumerable: true, get: function () { return security_1.URL_ENCODED_LIMIT; } });
var validation_1 = require("./validation");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return validation_1.validate; } });
Object.defineProperty(exports, "validateMultiple", { enumerable: true, get: function () { return validation_1.validateMultiple; } });
Object.defineProperty(exports, "loginSchema", { enumerable: true, get: function () { return validation_1.loginSchema; } });
Object.defineProperty(exports, "registerSchema", { enumerable: true, get: function () { return validation_1.registerSchema; } });
Object.defineProperty(exports, "createSessionSchema", { enumerable: true, get: function () { return validation_1.createSessionSchema; } });
Object.defineProperty(exports, "sessionIdParamSchema", { enumerable: true, get: function () { return validation_1.sessionIdParamSchema; } });
Object.defineProperty(exports, "createMessageSchema", { enumerable: true, get: function () { return validation_1.createMessageSchema; } });
Object.defineProperty(exports, "sessionIdMessageParamSchema", { enumerable: true, get: function () { return validation_1.sessionIdMessageParamSchema; } });
Object.defineProperty(exports, "paginationSchema", { enumerable: true, get: function () { return validation_1.paginationSchema; } });
