CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Session" (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    assistantRole TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Session_userId_User FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE "Message" (
    id SERIAL PRIMARY KEY,
    sessionId INT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Message_sessionId_Session FOREIGN KEY (sessionId) REFERENCES "Session"(id) ON DELETE CASCADE
);

CREATE INDEX idx_session_userid ON "Session"(userId);
CREATE INDEX idx_message_sessionid ON "Message"(sessionId);
CREATE INDEX idx_message_timestamp ON "Message"(timestamp);
CREATE INDEX idx_user_email ON "User"(email);
