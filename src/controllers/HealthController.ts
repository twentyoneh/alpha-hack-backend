/**
 * HealthController - Health check endpoint
 * Requirements: 8.5
 */

import { Request, Response, NextFunction } from 'express';
import DatabaseConnection from '../utils/database';

export class HealthController {
  /**
   * GET /health
   * Returns health status of the application and database connection
   * Includes connection pool statistics
   * Requirements: 8.5, 8.2, 8.3
   */
  health = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check database connection
      const isHealthy = await DatabaseConnection.healthCheck();
      const databaseStatus = isHealthy ? 'connected' : 'disconnected';

      // Get connection pool statistics
      const connectionStats = DatabaseConnection.getConnectionStats();

      // Calculate uptime in seconds
      const uptime = Math.floor(process.uptime());

      // Return health status
      res.status(200).json({
        status: 'ok',
        database: databaseStatus,
        uptime,
        timestamp: new Date().toISOString(),
        connectionPool: {
          min: connectionStats.poolMin,
          max: connectionStats.poolMax,
          timeout: connectionStats.connectionTimeout,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

// Export singleton instance
export const healthController = new HealthController();
