# Controllers and Routes

This directory contains all HTTP request handlers (controllers) and route definitions.

## Available Routes

### Authentication Routes (`authRoutes.ts`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Session Routes (`sessionRoutes.ts`)
- `POST /api/session` - Create new session
- `GET /api/sessions` - List user sessions
- `DELETE /api/session/:id` - Delete session

### Message Routes (`messageRoutes.ts`)
- `GET /api/history/:session_id` - Get message history for a session
- `POST /api/message` - Create new message

## Integration

To integrate these routes into your Express app:

```typescript
import express from 'express';
import { authRoutes, sessionRoutes, messageRoutes } from './controllers';

const app = express();

app.use('/api/auth', authRoutes);
app.use('/api', sessionRoutes);
app.use('/api', messageRoutes);
```
