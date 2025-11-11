"use strict";
/**
 * Main Application Entry Point
 * Requirements: 1.3, 1.4, 8.5
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const middleware_1 = require("./middleware");
const controllers_1 = require("./controllers");
const logger_1 = require("./utils/logger");
const database_1 = __importDefault(require("./utils/database"));
// Load environment variables
dotenv_1.default.config();
// Create Express application
const app = (0, express_1.default)();
// Get port from environment or use default
const PORT = process.env.PORT || 3000;
// Middleware - Order is important!
// 1. Security headers (helmet) - should be first
// Requirement: 4.4 - Add security headers
app.use(middleware_1.helmetConfig);
// 2. CORS configuration
// Requirement: 4.4 - Configure CORS
app.use(middleware_1.corsOptions);
// 3. Request logging (before all other middleware)
app.use(middleware_1.requestLogger);
// 4. Body parsing with size limits
// Requirement: 4.4 - Add request size limits
app.use(express_1.default.json({ limit: middleware_1.REQUEST_SIZE_LIMIT }));
app.use(express_1.default.urlencoded({ extended: true, limit: middleware_1.URL_ENCODED_LIMIT }));
// 5. Input sanitization and XSS protection
// Requirement: 4.4 - Sanitize user input to prevent XSS
app.use(middleware_1.sanitizeInput);
app.use(middleware_1.xssProtection);
// 6. Rate limiting for all API routes
// Requirement: 4.4 - Implement rate limiting
app.use('/api', middleware_1.apiRateLimiter);
// 3. Routes
app.use(controllers_1.healthRoutes);
app.use('/api/auth', controllers_1.authRoutes);
app.use('/api', controllers_1.sessionRoutes);
app.use('/api', controllers_1.messageRoutes);
// 4. Error handling (must be last)
app.use(middleware_1.errorHandler);
// Graceful shutdown handler
// Implements graceful shutdown for database connections
async function gracefulShutdown(signal) {
    (0, logger_1.logInfo)(`${signal} received, starting graceful shutdown`);
    try {
        // Close database connections gracefully
        await database_1.default.disconnect();
        (0, logger_1.logInfo)('Database connections closed');
        // Exit process
        process.exit(0);
    }
    catch (error) {
        (0, logger_1.logError)('Error during graceful shutdown', error);
        process.exit(1);
    }
}
// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Unhandled rejection handler
process.on('unhandledRejection', (reason) => {
    (0, logger_1.logError)('Unhandled Promise Rejection', new Error(reason));
    gracefulShutdown('UNHANDLED_REJECTION');
});
// Start server
async function startServer() {
    try {
        // Connect to database with retry logic
        // Requirements: 1.3, 1.4 - Establish connection and handle failures
        await database_1.default.connect();
        // Perform database health check on startup
        // Requirements: 8.2, 8.3 - Database health check in startup
        const isHealthy = await database_1.default.healthCheck();
        if (!isHealthy) {
            throw new Error('Database health check failed');
        }
        (0, logger_1.logInfo)('Database health check passed');
        // Log connection statistics
        const stats = database_1.default.getConnectionStats();
        (0, logger_1.logInfo)('Database connection pool configured', stats);
        // Start listening
        app.listen(PORT, () => {
            (0, logger_1.logInfo)('Server started', {
                port: PORT,
                environment: process.env.NODE_ENV || 'development',
                nodeVersion: process.version,
            });
        });
    }
    catch (error) {
        (0, logger_1.logError)('Failed to start server', error);
        process.exit(1);
    }
}
// Start the server
startServer();
exports.default = app;
