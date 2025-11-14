-- Включаем расширение для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Удаляем существующие данные (так как нужно изменить тип ID)
TRUNCATE TABLE "Message" CASCADE;
TRUNCATE TABLE "Session" CASCADE;
TRUNCATE TABLE "User" CASCADE;

-- Изменяем тип ID в таблице User
ALTER TABLE "User" DROP CONSTRAINT "User_pkey";
ALTER TABLE "User" ALTER COLUMN id TYPE UUID USING uuid_generate_v4();
ALTER TABLE "User" ADD PRIMARY KEY (id);

-- Изменяем тип ID в таблице Session и внешний ключ userId
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey";
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";
ALTER TABLE "Session" ALTER COLUMN id TYPE UUID USING uuid_generate_v4();
ALTER TABLE "Session" ALTER COLUMN "userId" TYPE UUID USING uuid_generate_v4();
ALTER TABLE "Session" ADD PRIMARY KEY (id);
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE;

-- Изменяем внешний ключ sessionId в таблице Message
ALTER TABLE "Message" DROP CONSTRAINT "Message_sessionId_fkey";
ALTER TABLE "Message" ALTER COLUMN "sessionId" TYPE UUID USING uuid_generate_v4();
ALTER TABLE "Message" ADD CONSTRAINT "Message_sessionId_fkey" 
    FOREIGN KEY ("sessionId") REFERENCES "Session"(id) ON DELETE CASCADE;
