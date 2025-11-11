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

dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 3000;

app.use(helmetConfig);
app.use(corsOptions);
app.use(requestLogger);
app.use(express.json({ limit: REQUEST_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: URL_ENCODED_LIMIT }));
app.use(sanitizeInput);
app.use(xssProtection);
app.use('/api', apiRateLimiter);

app.use(healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', sessionRoutes);
app.use('/api', messageRoutes);

app.use(errorHandler);

async function gracefulShutdown(signal: string): Promise<void> {
  logInfo(`${signal} received, starting graceful shutdown`);
  
  try {
    await DatabaseConnection.disconnect();
    logInfo('Database connections closed');
    process.exit(0);
  } catch (error) {
    logError('Error during graceful shutdown', error as Error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: any) => {
  logError('Unhandled Promise Rejection', new Error(reason));
  gracefulShutdown('UNHANDLED_REJECTION');
});

async function startServer(): Promise<void> {
  try {
    await DatabaseConnection.connect();
    
    const isHealthy = await DatabaseConnection.healthCheck();
    if (!isHealthy) {
      throw new Error('Database health check failed');
    }
    
    logInfo('Database health check passed');
    
    const stats = DatabaseConnection.getConnectionStats();
    logInfo('Database connection pool configured', stats);
    
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

startServer();

export default app;
