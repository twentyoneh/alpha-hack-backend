# Backend Business Logic

Backend system for chat assistant session management, message history storage, and basic analytics.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

5. (Optional) Seed demo data:
```bash
npm run seed
```

## Development

Start the development server:
```bash
npm run dev
```

## Build

Build for production:
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── controllers/    # HTTP request handlers
├── services/       # Business logic layer
├── repositories/   # Data access layer
├── models/         # Data models and types
├── middleware/     # Express middleware
└── utils/          # Utility functions and configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Sessions
- `POST /api/session` - Create new session
- `GET /api/sessions` - List user sessions
- `DELETE /api/session/{id}` - Delete session

### Messages
- `GET /api/history/{session_id}` - Get message history
- `POST /api/message` - Create new message

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL / SQLite
- **ORM**: Prisma
- **Authentication**: JWT tokens
- **Validation**: Zod
