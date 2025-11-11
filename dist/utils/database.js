"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("./logger");
/**
 * Get database configuration from environment variables
 */
function getDatabaseConfig() {
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
    /**
     * Get Prisma client instance (singleton pattern)
     * Configures connection pool with min and max connections
     */
    static getInstance() {
        if (!DatabaseConnection.instance) {
            const databaseUrl = process.env.DATABASE_URL;
            if (!databaseUrl) {
                throw new Error('DATABASE_URL environment variable is not set');
            }
            // Build connection URL with pool configuration
            const urlWithPool = DatabaseConnection.buildConnectionUrl(databaseUrl);
            DatabaseConnection.instance = new client_1.PrismaClient({
                log: process.env.NODE_ENV === 'development'
                    ? ['query', 'error', 'warn']
                    : ['error'],
                datasources: {
                    db: {
                        url: urlWithPool,
                    },
                },
            });
            (0, logger_1.logInfo)('Prisma client initialized', {
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
    static buildConnectionUrl(baseUrl) {
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
        }
        catch (error) {
            // If URL parsing fails, return original
            return baseUrl;
        }
    }
    /**
     * Connect to database with retry logic
     * Requirement 1.3: Establish database connection on application startup
     * Requirement 1.4: Log error and prevent startup on connection failure
     */
    static async connect() {
        const { maxRetries, retryDelay } = DatabaseConnection.config;
        let lastError = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                (0, logger_1.logInfo)(`Attempting database connection (attempt ${attempt}/${maxRetries})`);
                const prisma = DatabaseConnection.getInstance();
                await prisma.$connect();
                DatabaseConnection.isConnected = true;
                (0, logger_1.logInfo)('Database connected successfully', {
                    attempt,
                    poolMin: DatabaseConnection.config.connectionPoolMin,
                    poolMax: DatabaseConnection.config.connectionPoolMax,
                });
                return;
            }
            catch (error) {
                lastError = error;
                (0, logger_1.logWarn)(`Database connection attempt ${attempt} failed`, {
                    error: lastError.message,
                    attempt,
                    maxRetries,
                });
                if (attempt < maxRetries) {
                    (0, logger_1.logInfo)(`Retrying in ${retryDelay}ms...`);
                    await DatabaseConnection.sleep(retryDelay);
                }
            }
        }
        // All retries failed
        (0, logger_1.logError)('Database connection failed after all retries', lastError);
        throw new Error(`Failed to connect to database after ${maxRetries} attempts. Application cannot start.`);
    }
    /**
     * Disconnect from database gracefully
     * Implements graceful shutdown for database connections
     */
    static async disconnect() {
        if (DatabaseConnection.instance) {
            try {
                await DatabaseConnection.instance.$disconnect();
                DatabaseConnection.isConnected = false;
                (0, logger_1.logInfo)('Database disconnected gracefully');
            }
            catch (error) {
                (0, logger_1.logError)('Error during database disconnect', error);
                throw error;
            }
        }
    }
    /**
     * Check if database is connected
     */
    static isHealthy() {
        return DatabaseConnection.isConnected;
    }
    /**
     * Health check - verify database connectivity
     * Requirement 8.2, 8.3: Database health check in startup
     */
    static async healthCheck() {
        try {
            const prisma = DatabaseConnection.getInstance();
            await prisma.$queryRaw `SELECT 1`;
            return true;
        }
        catch (error) {
            (0, logger_1.logError)('Database health check failed', error);
            return false;
        }
    }
    /**
     * Get database connection statistics
     * Useful for monitoring and debugging
     */
    static getConnectionStats() {
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
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
DatabaseConnection.instance = null;
DatabaseConnection.isConnected = false;
DatabaseConnection.config = getDatabaseConfig();
// Export singleton instance
exports.prisma = DatabaseConnection.getInstance();
exports.default = DatabaseConnection;
