INSERT INTO "User" (name, email, createdAt, updatedAt) VALUES
('John Doe', 'john@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Jane Smith', 'jane@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Session" (userId, assistantRole, timestamp, createdAt) VALUES
(1, 'helpful assistant', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'code reviewer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Message" (sessionId, role, text, timestamp) VALUES
(1, 'user', 'Hello, how are you?', CURRENT_TIMESTAMP),
(1, 'assistant', 'I am doing well, thank you! How can I help you today?', CURRENT_TIMESTAMP),
(2, 'user', 'Can you review my code?', CURRENT_TIMESTAMP),
(2, 'assistant', 'Of course! Please share your code.', CURRENT_TIMESTAMP);
