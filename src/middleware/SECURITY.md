# Security Measures Documentation

This document describes the security measures implemented in the backend system.

## Overview

The application implements multiple layers of security to protect against common web vulnerabilities and attacks. All security measures are configured in accordance with Requirements 4.4 and 6.2.

## Implemented Security Measures

### 1. Input Validation

**Location**: `src/middleware/validation.ts`

All API endpoints use Zod schemas for strict input validation:

- **Type validation**: Ensures data types match expected formats
- **Length limits**: Prevents excessively long inputs
- **Format validation**: Email addresses, numeric IDs, etc.
- **Enum validation**: Restricts values to allowed options (e.g., message roles)

**Benefits**:
- Prevents injection attacks
- Ensures data integrity
- Provides clear error messages
- Validates before processing

### 2. Rate Limiting

**Location**: `src/middleware/security.ts`

Two levels of rate limiting are implemented:

#### General API Rate Limiter
- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Applied to**: All `/api/*` routes
- **Excludes**: Health check endpoint

#### Authentication Rate Limiter
- **Window**: 15 minutes
- **Limit**: 20 requests per IP
- **Applied to**: `/api/auth/login` and `/api/auth/register`
- **Purpose**: Prevents brute force attacks

**Benefits**:
- Prevents API abuse
- Protects against brute force attacks
- Reduces server load from malicious actors

### 3. CORS Configuration

**Location**: `src/middleware/security.ts`

Cross-Origin Resource Sharing is configured to:

- Allow only specified origins (configurable via `ALLOWED_ORIGINS` env variable)
- Allow credentials (cookies, authorization headers)
- Restrict HTTP methods to: GET, POST, PUT, DELETE, OPTIONS
- Restrict headers to: Content-Type, Authorization
- Cache preflight requests for 24 hours

**Default allowed origins**:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:8080`

**Benefits**:
- Prevents unauthorized cross-origin requests
- Protects against CSRF attacks
- Allows legitimate frontend applications

### 4. Input Sanitization

**Location**: `src/middleware/security.ts`

Multiple sanitization layers:

#### MongoDB Sanitization
- Removes `$` and `.` characters from user input
- Prevents NoSQL injection attacks
- Logs sanitization events for monitoring

#### XSS Protection
- Removes HTML tags from all string inputs
- Strips dangerous JavaScript patterns
- Sanitizes body, query, and URL parameters recursively

**Benefits**:
- Prevents XSS (Cross-Site Scripting) attacks
- Removes potentially malicious code
- Protects against injection attacks

### 5. Security Headers (Helmet)

**Location**: `src/middleware/security.ts`

Helmet middleware sets various HTTP security headers:

- **Content Security Policy**: Restricts resource loading
- **HSTS**: Forces HTTPS connections (1 year max-age)
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-XSS-Protection**: Enables browser XSS protection

**Benefits**:
- Protects against common web vulnerabilities
- Enforces secure communication
- Prevents clickjacking and MIME attacks

### 6. Request Size Limits

**Location**: `src/middleware/security.ts` and `src/index.ts`

Request body size is limited to:
- **JSON payloads**: 10MB maximum
- **URL-encoded data**: 10MB maximum

**Benefits**:
- Prevents denial-of-service attacks
- Protects server resources
- Prevents memory exhaustion

## Configuration

### Environment Variables

Add to your `.env` file:

```bash
# CORS Configuration
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173,http://localhost:8080"
```

### Customizing Rate Limits

Edit `src/middleware/security.ts`:

```typescript
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Change window
  max: 100,                  // Change limit
  // ...
});
```

### Customizing Request Size Limits

Edit `src/middleware/security.ts`:

```typescript
export const REQUEST_SIZE_LIMIT = '10mb'; // Change limit
```

## Middleware Order

The order of middleware in `src/index.ts` is critical:

1. **Helmet** - Security headers (first)
2. **CORS** - Cross-origin configuration
3. **Request Logger** - Logging
4. **Body Parser** - With size limits
5. **Input Sanitization** - Remove dangerous characters
6. **XSS Protection** - Additional sanitization
7. **Rate Limiting** - Applied to API routes
8. **Routes** - Application endpoints
9. **Error Handler** - Must be last

## Testing Security Measures

### Test Rate Limiting

```bash
# Send multiple requests quickly
for i in {1..25}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
done
```

Expected: After 20 requests, you should receive a 429 status code.

### Test Input Validation

```bash
# Invalid email format
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email"}'
```

Expected: 400 status with validation error message.

### Test XSS Protection

```bash
# Attempt XSS injection
curl -X POST http://localhost:3000/api/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"session_id":1,"role":"user","text":"<script>alert(\"XSS\")</script>"}'
```

Expected: Script tags should be removed from the stored text.

### Test CORS

```bash
# Request from unauthorized origin
curl -X GET http://localhost:3000/api/sessions \
  -H "Origin: http://malicious-site.com" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: CORS error if origin is not in allowed list.

## Security Best Practices

1. **Always use HTTPS in production** - Set `NODE_ENV=production`
2. **Keep JWT_SECRET secure** - Use strong, random values
3. **Regularly update dependencies** - Run `npm audit` and fix vulnerabilities
4. **Monitor rate limit violations** - Check logs for suspicious activity
5. **Review ALLOWED_ORIGINS** - Only include trusted domains
6. **Use environment variables** - Never hardcode secrets
7. **Enable logging** - Monitor security events

## Compliance

These security measures help comply with:

- **Requirement 4.4**: Input validation, rate limiting, CORS, XSS prevention, request size limits
- **Requirement 6.2**: Authentication endpoint protection

## Additional Recommendations

For production deployments, consider:

1. **WAF (Web Application Firewall)** - Additional layer of protection
2. **DDoS Protection** - CloudFlare, AWS Shield, etc.
3. **Security Monitoring** - Sentry, LogRocket, etc.
4. **Regular Security Audits** - Penetration testing
5. **Database Encryption** - Encrypt sensitive data at rest
6. **API Key Management** - For service-to-service communication
7. **Two-Factor Authentication** - For user accounts
