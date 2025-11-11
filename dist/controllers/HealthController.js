"use strict";
/**
 * HealthController - Health check endpoint
 * Requirements: 8.5
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = exports.HealthController = void 0;
const database_1 = __importDefault(require("../utils/database"));
class HealthController {
    constructor() {
        /**
         * GET /health
         * Returns health status of the application and database connection
         * Includes connection pool statistics
         * Requirements: 8.5, 8.2, 8.3
         */
        this.health = async (req, res, next) => {
            try {
                // Check database connection
                const isHealthy = await database_1.default.healthCheck();
                const databaseStatus = isHealthy ? 'connected' : 'disconnected';
                // Get connection pool statistics
                const connectionStats = database_1.default.getConnectionStats();
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
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.HealthController = HealthController;
// Export singleton instance
exports.healthController = new HealthController();
