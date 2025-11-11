import { PrismaClient } from '@prisma/client';
import { logInfo, logError, logWarn } from './logger';

/**
 * Database connection configuration
 * Requirements: 1.3, 1.4, 8.2, 8.3
 */
interface DatabaseConfig {
  connectionPoolMin: number;
  connectionPoolMax: number;
  connectionTimeout: number;
  maxRetries: number;
  retryDelay: number;
}

/**
 * Get database configuration from environment variables
 */
function getDatabaseConfig(): DatabaseConfig {
  return {
    connectionPoolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
    connectionPoolMax: parseInt(process.env.DB_POOL_MAX || '10', 10),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000', 10),
    maxRetries: parseInt(process.env.DB_MAX_RETRIES || '3', 10),
    retryDelay: parseInt(process.env.DB_RETRY_DELAY || '2000', 10),
  };
}

/**
 * Database connection singleton with connection pooling and optimization
 * Implements connection management as per requirements 1.3, 1.4, 8.2, 8.3
 */
class DatabaseConnection {
  private static instance: PrismaClient | null = null;
  private static isConnected: boolean = false;
  private static config: DatabaseConfig = getDatabaseConfig();

  /**
   * Get Prisma client instance (singleton pattern)
   * Configures connection pool with min and max connections
   */
  static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      const databaseUrl = process.env.DATABASE_URL;
      
      if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
      }

      // Build connection URL with pool configuration
      const urlWithPool = DatabaseConnection.buildConnectionUrl(databaseUrl);

      DatabaseConnection.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' 
          ? ['query', 'error', 'warn'] 
          : ['error'],
        datasources: {
          db: {
            url: urlWithPool,
          },
        },
      });

      logInfo('Prisma client initialized', {
        poolMin: DatabaseConnection.config.connectionPoolMin,
        poolMax: DatabaseConnection.config.connectionPoolMax,
        connectionTimeout: DatabaseConnection.config.connectionTimeout,
      });
    }
    return DatabaseConnection.instance;
  }

  /**
   * Build connection URL with pool configuration
   * Adds connection pool parameters to the database URL
   */
  private static buildConnectionUrl(baseUrl: string): string {
    // For SQLite (file:), pool parameters are not applicable
    // Prisma handles SQLite connections differently, return as-is
    if (baseUrl.startsWith('file:')) {
      return baseUrl;
    }
    
    // For PostgreSQL, add connection pool parameters
    try {
      const url = new URL(baseUrl);
      if (url.protocol === 'postgresql:' || url.protocol === 'postgres:') {
        url.searchParams.set('connection_limit', DatabaseConnection.config.connectionPoolMax.toString());
        url.searchParams.set('pool_timeout', (DatabaseConnection.config.connectionTimeout / 1000).toString());
      }
      return url.toString();
    } catch (error) {
      // If URL parsing fails, return original
      return baseUrl;
    }
  }

  /**
   * Connect to database with retry logic
   * Requirement 1.3: Establish database connection on application startup
   * Requirement 1.4: Log error and prevent startup on connection failure
   */
  static async connect(): Promise<void> {
    const { maxRetries, retryDelay } = DatabaseConnection.config;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logInfo(`Attempting database connection (attempt ${attempt}/${maxRetries})`);
        
        const prisma = DatabaseConnection.getInstance();
        await prisma.$connect();
        
        DatabaseConnection.isConnected = true;
        logInfo('Database connected successfully', {
          attempt,
          poolMin: DatabaseConnection.config.connectionPoolMin,
          poolMax: DatabaseConnection.config.connectionPoolMax,
        });
        
        return;
      } catch (error) {
        lastError = error as Error;
        logWarn(`Database connection attempt ${attempt} failed`, {
          error: lastError.message,
          attempt,
          maxRetries,
        });

        if (attempt < maxRetries) {
          logInfo(`Retrying in ${retryDelay}ms...`);
          await DatabaseConnection.sleep(retryDelay);
        }
      }
    }

    // All retries failed
    logError('Database connection failed after all retries', lastError!);
    throw new Error(`Failed to connect to database after ${maxRetries} attempts. Application cannot start.`);
  }

  /**
   * Disconnect from database gracefully
   * Implements graceful shutdown for database connections
   */
  static async disconnect(): Promise<void> {
    if (DatabaseConnection.instance) {
      try {
        await DatabaseConnection.instance.$disconnect();
        DatabaseConnection.isConnected = false;
        logInfo('Database disconnected gracefully');
      } catch (error) {
        logError('Error during database disconnect', error as Error);
        throw error;
      }
    }
  }

  /**
   * Check if database is connected
   */
  static isHealthy(): boolean {
    return DatabaseConnection.isConnected;
  }

  /**
   * Health check - verify database connectivity
   * Requirement 8.2, 8.3: Database health check in startup
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const prisma = DatabaseConnection.getInstance();
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logError('Database health check failed', error as Error);
      return false;
    }
  }

  /**
   * Get database connection statistics
   * Useful for monitoring and debugging
   */
  static getConnectionStats(): {
    isConnected: boolean;
    poolMin: number;
    poolMax: number;
    connectionTimeout: number;
  } {
    return {
      isConnected: DatabaseConnection.isConnected,
      poolMin: DatabaseConnection.config.connectionPoolMin,
      poolMax: DatabaseConnection.config.connectionPoolMax,
      connectionTimeout: DatabaseConnection.config.connectionTimeout,
    };
  }

  /**
   * Sleep utility for retry delays
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const prisma = DatabaseConnection.getInstance();
export default DatabaseConnection;
