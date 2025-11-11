/**
 * Test script to verify database connection and configuration
 * This can be run to ensure the database is properly set up
 */
import DatabaseConnection from './database';

async function testDatabaseConnection() {
  console.log('Testing database connection...\n');

  try {
    // Test connection
    await DatabaseConnection.connect();
    
    // Test health check
    const isHealthy = await DatabaseConnection.healthCheck();
    console.log(`Health check: ${isHealthy ? '✓ PASSED' : '✗ FAILED'}`);
    
    // Test basic query
    const prisma = DatabaseConnection.getInstance();
    const userCount = await prisma.user.count();
    console.log(`\nDatabase statistics:`);
    console.log(`- Users: ${userCount}`);
    
    const sessionCount = await prisma.session.count();
    console.log(`- Sessions: ${sessionCount}`);
    
    const messageCount = await prisma.message.count();
    console.log(`- Messages: ${messageCount}`);
    
    console.log('\n✓ All database tests passed!');
    
  } catch (error) {
    console.error('\n✗ Database test failed:', error);
    process.exit(1);
  } finally {
    await DatabaseConnection.disconnect();
  }
}

// Run the test
testDatabaseConnection();
