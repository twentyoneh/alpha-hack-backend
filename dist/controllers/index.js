"use strict";
/**
 * Controllers index
 * Exports all controllers and routes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = exports.healthController = exports.messageRoutes = exports.messageController = exports.sessionRoutes = exports.sessionController = exports.authRoutes = exports.authController = void 0;
var AuthController_1 = require("./AuthController");
Object.defineProperty(exports, "authController", { enumerable: true, get: function () { return AuthController_1.authController; } });
var authRoutes_1 = require("./authRoutes");
Object.defineProperty(exports, "authRoutes", { enumerable: true, get: function () { return __importDefault(authRoutes_1).default; } });
var SessionController_1 = require("./SessionController");
Object.defineProperty(exports, "sessionController", { enumerable: true, get: function () { return SessionController_1.sessionController; } });
var sessionRoutes_1 = require("./sessionRoutes");
Object.defineProperty(exports, "sessionRoutes", { enumerable: true, get: function () { return __importDefault(sessionRoutes_1).default; } });
var MessageController_1 = require("./MessageController");
Object.defineProperty(exports, "messageController", { enumerable: true, get: function () { return MessageController_1.messageController; } });
var messageRoutes_1 = require("./messageRoutes");
Object.defineProperty(exports, "messageRoutes", { enumerable: true, get: function () { return __importDefault(messageRoutes_1).default; } });
var HealthController_1 = require("./HealthController");
Object.defineProperty(exports, "healthController", { enumerable: true, get: function () { return HealthController_1.healthController; } });
var healthRoutes_1 = require("./healthRoutes");
Object.defineProperty(exports, "healthRoutes", { enumerable: true, get: function () { return __importDefault(healthRoutes_1).default; } });
