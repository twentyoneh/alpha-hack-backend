/**
 * Main Application Entry Point
 * Requirements: 1.3, 1.4, 8.5
 */

import express, { Application } from 'express';
import dotenv from 'dotenv';
import {
  requestLogger,
  errorHandler,
  apiRateLimiter,
  authRateLimiter,
  corsOptions,
  helmetConfig,
  sanitizeInput,
  xssProtection,
  REQUEST_SIZE_LIMIT,
  URL_ENCODED_LIMIT,
} from './middleware';
import { authRoutes, sessionRoutes, messageRoutes, healthRoutes } from './controllers';
import { logInfo, logError } from './utils/logger';
import DatabaseConnection from './utils/database';

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();

// Get port from environment or use default
const PORT = process.env.PORT || 3000;

// Middleware - Order is important!
// 1. Security headers (helmet) - should be first
// Requirement: 4.4 - Add security headers
app.use(helmetConfig);

// 2. CORS configuration
// Requirement: 4.4 - Configure CORS
app.use(corsOptions);

// 3. Request logging (before all other middleware)
app.use(requestLogger);

// 4. Body parsing with size limits
// Requirement: 4.4 - Add request size limits
app.use(express.json({ limit: REQUEST_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: URL_ENCODED_LIMIT }));

// 5. Input sanitization and XSS protection
// Requirement: 4.4 - Sanitize user input to prevent XSS
app.use(sanitizeInput);
app.use(xssProtection);

// 6. Rate limiting for all API routes
// Requirement: 4.4 - Implement rate limiting
app.use('/api', apiRateLimiter);

// 3. Routes
app.use(healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', sessionRoutes);
app.use('/api', messageRoutes);

// 4. Error handling (must be last)
app.use(errorHandler);

// Graceful shutdown handler
// Implements graceful shutdown for database connections
async function gracefulShutdown(signal: string): Promise<void> {
  logInfo(`${signal} received, starting graceful shutdown`);
  
  try {
    // Close database connections gracefully
    await DatabaseConnection.disconnect();
    logInfo('Database connections closed');
    
    // Exit process
    process.exit(0);
  } catch (error) {
    logError('Error during graceful shutdown', error as Error);
    process.exit(1);
  }
}

// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled rejection handler
process.on('unhandledRejection', (reason: any) => {
  logError('Unhandled Promise Rejection', new Error(reason));
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Start server
async function startServer(): Promise<void> {
  try {
    // Connect to database with retry logic
    // Requirements: 1.3, 1.4 - Establish connection and handle failures
    await DatabaseConnection.connect();
    
    // Perform database health check on startup
    // Requirements: 8.2, 8.3 - Database health check in startup
    const isHealthy = await DatabaseConnection.healthCheck();
    if (!isHealthy) {
      throw new Error('Database health check failed');
    }
    
    logInfo('Database health check passed');
    
    // Log connection statistics
    const stats = DatabaseConnection.getConnectionStats();
    logInfo('Database connection pool configured', stats);
    
    // Start listening
    app.listen(PORT, () => {
      logInfo('Server started', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
      });
    });
  } catch (error) {
    logError('Failed to start server', error as Error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
