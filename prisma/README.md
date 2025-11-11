# Prisma Database Setup

This directory contains the Prisma schema and migrations for the backend business logic system.

## Database Models

- **User**: Registered users with name and optional email
- **Session**: Chat sessions associated with users
- **Message**: Individual messages within sessions

## Key Features

- **Cascade Delete**: When a Session is deleted, all associated Messages are automatically deleted
- **Indexes**: Optimized queries with indexes on foreign keys and timestamp fields
- **Connection Pooling**: Managed through PrismaClient singleton

## Common Commands

### Generate Prisma Client
```bash
npm run prisma:generate
```

### Create a new migration
```bash
npm run prisma:migrate
# or
npx prisma migrate dev --name <migration_name>
```

### Apply migrations in production
```bash
npx prisma migrate deploy
```

### Open Prisma Studio (Database GUI)
```bash
npm run prisma:studio
```

### Reset database (development only)
```bash
npx prisma migrate reset
```

## Database Configuration

The database connection is configured via the `DATABASE_URL` environment variable in `.env`:

- **Development**: SQLite (`file:./dev.db`)
- **Production**: PostgreSQL (`postgresql://user:password@localhost:5432/dbname`)

To switch from SQLite to PostgreSQL, update:
1. `DATABASE_URL` in `.env`
2. `provider` in `prisma/schema.prisma` from `"sqlite"` to `"postgresql"`
3. Run `npx prisma migrate dev` to recreate migrations

## Migration History

- `20251111170502_init`: Initial schema with User, Session, and Message models
