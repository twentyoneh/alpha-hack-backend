/**
 * Health Check Routes
 * Requirements: 8.5
 */

import { Router } from 'express';
import { healthController } from './HealthController';

const router = Router();

// GET /health - Health check endpoint
router.get('/health', healthController.health);

export default router;
