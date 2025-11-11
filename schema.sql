-- SQLite Database Schema
-- Backend Business Logic - Chat Assistant System

-- User table - stores registered users
CREATE TABLE IF NOT EXISTS "User" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index on email for faster lookups
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");

-- Session table - stores chat sessions for each user
CREATE TABLE IF NOT EXISTS "Session" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "assistantRole" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Indexes on Session table
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "Session_timestamp_idx" ON "Session"("timestamp");

-- Message table - stores individual messages within sessions
CREATE TABLE IF NOT EXISTS "Message" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "role" TEXT NOT NULL CHECK("role" IN ('user', 'assistant', 'system')),
    "text" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE
);

-- Indexes on Message table
CREATE INDEX IF NOT EXISTS "Message_sessionId_idx" ON "Message"("sessionId");
CREATE INDEX IF NOT EXISTS "Message_timestamp_idx" ON "Message"("timestamp");

-- Trigger to auto-update updatedAt field on User table
CREATE TRIGGER IF NOT EXISTS "update_User_updatedAt"
AFTER UPDATE ON "User"
FOR EACH ROW
BEGIN
    UPDATE "User" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = NEW."id";
END;
