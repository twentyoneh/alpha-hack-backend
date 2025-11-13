create table if not exists "User" (
                                      id bigint primary key,
                                      name text not null,
                                      email text unique,
                                      "createdAt" timestamp not null,
                                      "updatedAt" timestamp not null
);

create table if not exists "Session" (
                                         id bigint primary key,
                                         "userId" bigint not null references "User"(id),
    "assistantRole" text not null
    );

create table if not exists "Message" (
                                         id bigserial primary key,
                                         "sessionId" bigint not null references "Session"(id),
    role text not null,
    text text not null,
    timestamp timestamp not null
    );

create index if not exists idx_message_session_ts on "Message"("sessionId", timestamp);
