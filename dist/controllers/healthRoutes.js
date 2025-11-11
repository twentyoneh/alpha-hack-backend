"use strict";
/**
 * Health Check Routes
 * Requirements: 8.5
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HealthController_1 = require("./HealthController");
const router = (0, express_1.Router)();
// GET /health - Health check endpoint
router.get('/health', HealthController_1.healthController.health);
exports.default = router;
