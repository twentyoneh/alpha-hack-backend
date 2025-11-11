# Logging and Monitoring

This document describes the logging and monitoring system implemented in the backend application.

## Overview

The application uses Winston for structured logging with support for multiple log levels and formats. All API requests are logged for audit purposes, and a health check endpoint is available for monitoring.

## Log Levels

The application supports four log levels (in order of severity):

- **error**: Critical errors that require immediate attention
- **warn**: Warning messages for potentially harmful situations
- **info**: Informational messages about application flow
- **debug**: Detailed debugging information

The log level can be configured via the `LOG_LEVEL` environment variable (default: `info`).

## Log Format

### Development Mode
In development (`NODE_ENV=development`), logs are formatted for human readability with colors:
```
2025-11-12 01:27:39 [info]: Server started {"port":"3000","environment":"development"}
```

### Production Mode
In production (`NODE_ENV=production`), logs are output in JSON format for easy parsing:
```json
{
  "level": "info",
  "message": "Server started",
  "timestamp": "2025-11-12T01:27:39.123Z",
  "port": "3000",
  "environment": "production"
}
```

## Request Logging

All API requests are automatically logged with the following information:
- HTTP method
- Request path
- User ID (if authenticated)
- Response status code
- Request duration (in milliseconds)

Example:
```
2025-11-12 01:29:15 [info]: API Request {"type":"api_request","method":"GET","path":"/health","userId":null,"statusCode":200,"duration":6}
```

## Error Logging

Errors are logged with full context including:
- Error type and message
- Stack trace (for unexpected errors)
- Request path and method
- User ID (if authenticated)

### Operational Errors
Expected errors (validation, not found, unauthorized) are logged at `info` level:
```
2025-11-12 01:30:00 [info]: Operational error {"type":"operational_error","error":"ValidationError","message":"Email is required","statusCode":400}
```

### Unexpected Errors
Unexpected errors are logged at `error` level with full stack traces:
```
2025-11-12 01:30:58 [error]: Unexpected error {"error":"SyntaxError","errorMessage":"...","stack":"...","path":"/api/auth/register"}
```

## Health Check Endpoint

The application provides a health check endpoint for monitoring:

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "database": "connected",
  "uptime": 97,
  "timestamp": "2025-11-11T18:29:15.936Z"
}
```

**Fields**:
- `status`: Overall application status ("ok")
- `database`: Database connection status ("connected" or "disconnected")
- `uptime`: Application uptime in seconds
- `timestamp`: Current server timestamp

## Usage in Code

### Using the Logger

```typescript
import { logger, logInfo, logError, logWarn, logDebug } from '../utils/logger';

// Simple logging
logInfo('User logged in');

// Logging with context
logInfo('Session created', { sessionId: 123, userId: 456 });

// Error logging
try {
  // some code
} catch (error) {
  logError('Failed to create session', error as Error, { userId: 123 });
}

// Warning
logWarn('Rate limit approaching', { userId: 123, requestCount: 95 });

// Debug
logDebug('Processing request', { data: requestData });
```

### Direct Winston Logger

For advanced use cases, you can use the Winston logger directly:

```typescript
import { logger } from '../utils/logger';

logger.info('Message', { custom: 'context' });
logger.error('Error message', { error: err });
```

## Configuration

Set the following environment variables:

```bash
# Log level: error, warn, info, debug
LOG_LEVEL=info

# Environment: development or production
NODE_ENV=development
```

## Monitoring Integration

The structured JSON logs in production mode can be easily integrated with log aggregation services like:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Splunk
- Datadog
- CloudWatch Logs
- Papertrail

Simply configure your log shipper to read from stdout and parse the JSON format.
