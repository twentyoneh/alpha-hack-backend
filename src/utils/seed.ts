/**
 * Database Seed Script
 * Creates demo data for development and testing
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { prisma } from './database';
import { User, Session } from '@prisma/client';

/**
 * Clear all data from the database
 * Requirement 7.5: Provide a command to clear all seed data
 */
async function clearDatabase(): Promise<void> {
  console.log('🗑️  Clearing database...');
  
  // Delete in correct order due to foreign key constraints
  await prisma.message.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('✅ Database cleared');
}

/**
 * Create demo users
 * Requirement 7.2: Create at least 3 demo users
 */
async function createSeedUsers(): Promise<User[]> {
  console.log('👥 Creating seed users...');
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Smith',
        email: 'bob@example.com',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Charlie Brown',
        email: null, // User without email
      },
    }),
  ]);
  
  console.log(`✅ Created ${users.length} users`);
  return users;
}

/**
 * Create demo sessions for users
 * Requirement 7.3: Create at least 5 demo sessions with messages
 */
async function createSeedSessions(users: User[]): Promise<Session[]> {
  console.log('💬 Creating seed sessions...');
  
  const now = new Date();
  const sessions: Session[] = [];
  
  // Alice's sessions
  sessions.push(
    await prisma.session.create({
      data: {
        userId: users[0].id,
        assistantRole: 'helpful-assistant',
        timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
    }),
    await prisma.session.create({
      data: {
        userId: users[0].id,
        assistantRole: 'code-reviewer',
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    }),
    await prisma.session.create({
      data: {
        userId: users[0].id,
        assistantRole: 'creative-writer',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
    })
  );
  
  // Bob's sessions
  sessions.push(
    await prisma.session.create({
      data: {
        userId: users[1].id,
        assistantRole: 'technical-advisor',
        timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
    }),
    await prisma.session.create({
      data: {
        userId: users[1].id,
        assistantRole: 'data-analyst',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    })
  );
  
  // Charlie's sessions
  sessions.push(
    await prisma.session.create({
      data: {
        userId: users[2].id,
        assistantRole: 'general-assistant',
        timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },
    }),
    await prisma.session.create({
      data: {
        userId: users[2].id,
        assistantRole: 'language-tutor',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
    })
  );
  
  console.log(`✅ Created ${sessions.length} sessions`);
  return sessions;
}

/**
 * Create realistic message history for sessions
 * Requirement 7.3: Create demo sessions with messages
 */
async function createSeedMessages(sessions: Session[]): Promise<void> {
  console.log('📝 Creating seed messages...');
  
  let totalMessages = 0;
  
  // Session 1: Helpful assistant conversation
  const session1Messages = [
    { role: 'user', text: 'Hello! Can you help me understand how async/await works in JavaScript?' },
    { role: 'assistant', text: 'Of course! Async/await is a way to handle asynchronous operations in JavaScript. It makes asynchronous code look and behave more like synchronous code.' },
    { role: 'user', text: 'Can you show me an example?' },
    { role: 'assistant', text: 'Sure! Here\'s a simple example:\n\nasync function fetchData() {\n  const response = await fetch(\'https://api.example.com/data\');\n  const data = await response.json();\n  return data;\n}' },
    { role: 'user', text: 'That makes sense! What happens if there\'s an error?' },
    { role: 'assistant', text: 'Great question! You should wrap async/await in try-catch blocks to handle errors properly.' },
  ];
  
  for (const msg of session1Messages) {
    await prisma.message.create({
      data: {
        sessionId: sessions[0].id,
        role: msg.role,
        text: msg.text,
        timestamp: new Date(sessions[0].timestamp.getTime() + session1Messages.indexOf(msg) * 60000),
      },
    });
    totalMessages++;
  }
  
  // Session 2: Code review conversation
  const session2Messages = [
    { role: 'user', text: 'Can you review this code for me?' },
    { role: 'assistant', text: 'I\'d be happy to review your code! Please share it with me.' },
    { role: 'user', text: 'Here it is: function add(a, b) { return a + b; }' },
    { role: 'assistant', text: 'The function looks good! It\'s simple and does what it\'s supposed to. Consider adding TypeScript types for better type safety.' },
  ];
  
  for (const msg of session2Messages) {
    await prisma.message.create({
      data: {
        sessionId: sessions[1].id,
        role: msg.role,
        text: msg.text,
        timestamp: new Date(sessions[1].timestamp.getTime() + session2Messages.indexOf(msg) * 60000),
      },
    });
    totalMessages++;
  }
  
  // Session 3: Creative writing
  const session3Messages = [
    { role: 'user', text: 'Help me write a short story about a robot learning to paint.' },
    { role: 'assistant', text: 'What a wonderful idea! Let\'s start with the opening: "In a world of precise calculations and binary decisions, Unit-7 discovered something unexpected..."' },
    { role: 'user', text: 'I love it! Continue please.' },
  ];
  
  for (const msg of session3Messages) {
    await prisma.message.create({
      data: {
        sessionId: sessions[2].id,
        role: msg.role,
        text: msg.text,
        timestamp: new Date(sessions[2].timestamp.getTime() + session3Messages.indexOf(msg) * 60000),
      },
    });
    totalMessages++;
  }
  
  // Session 4: Technical advisor
  const session4Messages = [
    { role: 'user', text: 'What database should I use for my new project?' },
    { role: 'assistant', text: 'That depends on your requirements. Can you tell me more about your project? What kind of data will you be storing?' },
    { role: 'user', text: 'It\'s a chat application with user sessions and message history.' },
    { role: 'assistant', text: 'For a chat application, I\'d recommend PostgreSQL for production. It handles relational data well and has excellent support for JSON if you need flexibility.' },
    { role: 'user', text: 'What about for development?' },
    { role: 'assistant', text: 'SQLite is perfect for development! It\'s lightweight, requires no setup, and you can easily switch to PostgreSQL for production.' },
  ];
  
  for (const msg of session4Messages) {
    await prisma.message.create({
      data: {
        sessionId: sessions[3].id,
        role: msg.role,
        text: msg.text,
        timestamp: new Date(sessions[3].timestamp.getTime() + session4Messages.indexOf(msg) * 60000),
      },
    });
    totalMessages++;
  }
  
  // Session 5: Data analyst
  const session5Messages = [
    { role: 'user', text: 'How do I analyze user engagement metrics?' },
    { role: 'assistant', text: 'User engagement can be measured through several key metrics: active users, session duration, feature usage, and retention rates.' },
    { role: 'user', text: 'Which one is most important?' },
    { role: 'assistant', text: 'It depends on your goals, but retention rate is often considered the most critical metric for long-term success.' },
  ];
  
  for (const msg of session5Messages) {
    await prisma.message.create({
      data: {
        sessionId: sessions[4].id,
        role: msg.role,
        text: msg.text,
        timestamp: new Date(sessions[4].timestamp.getTime() + session5Messages.indexOf(msg) * 60000),
      },
    });
    totalMessages++;
  }
  
  // Session 6: General assistant
  const session6Messages = [
    { role: 'user', text: 'What\'s the weather like today?' },
    { role: 'assistant', text: 'I don\'t have access to real-time weather data, but I can help you find weather information online!' },
    { role: 'user', text: 'That\'s okay, thanks anyway.' },
  ];
  
  for (const msg of session6Messages) {
    await prisma.message.create({
      data: {
        sessionId: sessions[5].id,
        role: msg.role,
        text: msg.text,
        timestamp: new Date(sessions[5].timestamp.getTime() + session6Messages.indexOf(msg) * 60000),
      },
    });
    totalMessages++;
  }
  
  // Session 7: Language tutor
  const session7Messages = [
    { role: 'user', text: 'Can you help me practice Spanish?' },
    { role: 'assistant', text: '¡Por supuesto! I\'d be happy to help you practice Spanish. What would you like to work on?' },
    { role: 'user', text: 'I want to learn basic greetings.' },
    { role: 'assistant', text: 'Great! Let\'s start with: "Hola" (Hello), "Buenos días" (Good morning), "Buenas tardes" (Good afternoon), "Buenas noches" (Good evening/night).' },
    { role: 'user', text: 'How do I say "How are you?"' },
    { role: 'assistant', text: 'You can say "¿Cómo estás?" (informal) or "¿Cómo está usted?" (formal).' },
  ];
  
  for (const msg of session7Messages) {
    await prisma.message.create({
      data: {
        sessionId: sessions[6].id,
        role: msg.role,
        text: msg.text,
        timestamp: new Date(sessions[6].timestamp.getTime() + session7Messages.indexOf(msg) * 60000),
      },
    });
    totalMessages++;
  }
  
  console.log(`✅ Created ${totalMessages} messages`);
}

/**
 * Main seed function
 * Requirement 7.1: Provide a seed script for populating demo data
 * Requirement 7.4: Ensure seed data is idempotent (can be run multiple times safely)
 */
async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seed...\n');
    
    // Clear existing data to ensure idempotency
    await clearDatabase();
    
    // Create seed data
    const users = await createSeedUsers();
    const sessions = await createSeedSessions(users);
    await createSeedMessages(sessions);
    
    console.log('\n✨ Database seeded successfully!');
    console.log(`   Users: ${users.length}`);
    console.log(`   Sessions: ${sessions.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Clear seed data function
 * Requirement 7.5: Provide a command to clear all seed data
 */
async function clearSeedData(): Promise<void> {
  try {
    console.log('🌱 Clearing seed data...\n');
    await clearDatabase();
    console.log('\n✨ Seed data cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing seed data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute based on command line argument
const command = process.argv[2];

if (command === 'clear') {
  clearSeedData();
} else {
  seedDatabase();
}
