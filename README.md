# Backend Business Logic - Java/Spring Boot

Backend system for chat assistant session management.

## Tech Stack

- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Maven

## Features

- User authentication (register/login) with JWT
- Session management (create, list, delete)
- Message history with pagination
- Security (CORS, rate limiting, input validation)
- Health check endpoint

## Setup

1. Install Java 17+
2. Install PostgreSQL
3. Copy `.env.example` to `.env` and configure
4. Run database migrations (use schema.sql)
5. Build: `mvn clean install`
6. Run: `mvn spring-boot:run`

## API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user

### Sessions
- POST `/api/session` - Create session
- GET `/api/sessions?page=0&limit=20` - List sessions
- DELETE `/api/session/{id}` - Delete session

### Messages
- POST `/api/message` - Create message
- GET `/api/history/{session_id}?page=0&limit=50` - Get message history

### Health
- GET `/health` - Health check

## Database Schema

See `schema.sql` for the database structure.

## Environment Variables

See `.env.example` for all configuration options.
