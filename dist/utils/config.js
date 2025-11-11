"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    database: {
        url: process.env.DATABASE_URL || 'file:./dev.db',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-key',
        expiration: process.env.JWT_EXPIRATION || '1h',
    },
    server: {
        port: parseInt(process.env.PORT || '3000', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },
};
