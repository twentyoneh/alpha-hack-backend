"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test script to verify database connection and configuration
 * This can be run to ensure the database is properly set up
 */
const database_1 = __importDefault(require("./database"));
async function testDatabaseConnection() {
    console.log('Testing database connection...\n');
    try {
        // Test connection
        await database_1.default.connect();
        // Test health check
        const isHealthy = await database_1.default.healthCheck();
        console.log(`Health check: ${isHealthy ? '✓ PASSED' : '✗ FAILED'}`);
        // Test basic query
        const prisma = database_1.default.getInstance();
        const userCount = await prisma.user.count();
        console.log(`\nDatabase statistics:`);
        console.log(`- Users: ${userCount}`);
        const sessionCount = await prisma.session.count();
        console.log(`- Sessions: ${sessionCount}`);
        const messageCount = await prisma.message.count();
        console.log(`- Messages: ${messageCount}`);
        console.log('\n✓ All database tests passed!');
    }
    catch (error) {
        console.error('\n✗ Database test failed:', error);
        process.exit(1);
    }
    finally {
        await database_1.default.disconnect();
    }
}
// Run the test
testDatabaseConnection();
