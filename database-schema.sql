-- Database Schema for Backend Business Logic
-- PostgreSQL Database Creation Script

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS "Message" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Create User table
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX "User_email_idx" ON "User"(email);

-- Create Session table
CREATE TABLE "Session" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "assistantRole" VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") 
        REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes on Session table
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_timestamp_idx" ON "Session"(timestamp);

-- Create Message table
CREATE TABLE "Message" (
    id SERIAL PRIMARY KEY,
    "sessionId" INTEGER NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_sessionId_fkey" FOREIGN KEY ("sessionId") 
        REFERENCES "Session"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes on Message table
CREATE INDEX "Message_sessionId_idx" ON "Message"("sessionId");
CREATE INDEX "Message_timestamp_idx" ON "Message"(timestamp);

-- Create trigger function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for User table
CREATE TRIGGER update_user_updated_at 
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO "User" (name, email) VALUES
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com'),
    ('Bob Johnson', NULL);

INSERT INTO "Session" ("userId", "assistantRole") VALUES
    (1, 'helpful assistant'),
    (1, 'code reviewer'),
    (2, 'helpful assistant');

INSERT INTO "Message" ("sessionId", role, text) VALUES
    (1, 'user', 'Hello, how are you?'),
    (1, 'assistant', 'I am doing well, thank you! How can I help you today?'),
    (1, 'user', 'Can you help me with my code?'),
    (2, 'user', 'Please review this function'),
    (3, 'user', 'What is the weather today?');

-- Display table information
SELECT 'Database schema created successfully!' AS status;
