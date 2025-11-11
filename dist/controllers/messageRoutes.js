"use strict";
/**
 * Message history routes
 * Defines API endpoints for message operations
 * Requirements: 3.1, 3.2, 2.3, 4.4, 4.5
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MessageController_1 = require("./MessageController");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
/**
 * GET /api/history/{session_id}
 * Retrieve message history for a session with pagination
 * Requires authentication, param validation, and query validation
 * Requirements: 3.1, 3.2, 4.4 - Message history with validation
 */
router.get('/history/:session_id', middleware_1.authenticate, (0, middleware_1.validateMultiple)([
    { schema: middleware_1.sessionIdMessageParamSchema, target: 'params' },
    { schema: middleware_1.paginationSchema, target: 'query' },
]), MessageController_1.messageController.getMessageHistory);
/**
 * POST /api/message
 * Create a new message in a session
 * Requires authentication and input validation
 * Requirements: 2.3, 4.4, 4.5 - Message creation with validation
 */
router.post('/message', middleware_1.authenticate, (0, middleware_1.validate)(middleware_1.createMessageSchema, 'body'), MessageController_1.messageController.createMessage);
exports.default = router;
