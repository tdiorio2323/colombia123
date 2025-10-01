# Security Checklist (Ship Gate)

## Authentication & Authorization

- [x] **JWT Security**
  - Access tokens expire in 15 minutes (configurable via `JWT_EXPIRES_IN`)
  - Refresh tokens expire in 7 days (configurable via `REFRESH_TOKEN_EXPIRES_IN`)
  - Separate secrets for access and refresh tokens
  - JWT ID (jti) tracking implemented for token families

- [x] **Password Security**
  - Bcrypt with cost factor 12
  - Minimum password length: 8 characters (enforced by Zod validation)
  - Passwords hashed before database storage

- [x] **Token Management**
  - Short-lived access tokens (15m default)
  - Refresh token rotation ready for implementation
  - Role-based access control (CREATOR, FAN, ADMIN)

## Input Validation & Data Protection

- [x] **Request Validation**
  - Zod schemas on all POST/PATCH/PUT endpoints
  - Type-safe validation for user inputs
  - Error handling with appropriate HTTP status codes

- [x] **Database Security**
  - Prisma ORM with parameterized queries (SQL injection protection)
  - Email uniqueness constraints
  - Profile username uniqueness constraints
  - Foreign key relationships properly defined

## Infrastructure Security

- [ ] **HTTP Headers** (TODO: Implement Helmet)
  - Content Security Policy without `unsafe-inline`
  - Referrer Policy: `strict-origin-when-cross-origin`
  - Permissions Policy with minimal permissions
  - X-Frame-Options, X-Content-Type-Options, etc.

- [ ] **Rate Limiting** (TODO: Implement)
  - IP + user-based rate limiting on auth routes
  - 60 requests/minute default with burst allowance
  - Separate limits for payment operations

- [ ] **CORS Configuration** (TODO: Secure)
  - Exact origin allowlist (no wildcards)
  - Credentials support only for trusted origins
  - Environment-specific CORS policies

## Payment & Financial Security

- [x] **Stripe Integration**
  - Webhook signature verification implemented
  - Test vs production key separation
  - Customer ID validation before payment processing

- [ ] **Transaction Security** (TODO: Complete)
  - Idempotency keys for payment operations
  - Double-spend protection
  - Audit logging for all financial transactions

## Secrets & Environment Management

- [x] **Environment Variables**
  - Database credentials via environment only
  - JWT secrets configurable and separate
  - Stripe keys environment-specific

- [ ] **Key Rotation** (TODO: Document)
  - JWT secret rotation procedure
  - Database credential rotation schedule
  - Stripe webhook secret rotation process

## Monitoring & Audit

- [ ] **Security Logging** (TODO: Implement)
  - Authentication attempts (success/failure)
  - Authorization failures
  - Payment operations
  - Administrative actions
  - Rate limit violations

- [ ] **Error Handling** (TODO: Review)
  - No sensitive data in error responses
  - Consistent error format
  - Appropriate HTTP status codes
  - No stack traces in production

## File Upload Security

- [x] **Upload Validation**
  - File type restrictions (images, videos, audio)
  - File size limits enforced
  - MIME type validation
  - Creator role requirement for uploads

- [ ] **File Storage** (TODO: Secure)
  - Virus scanning for uploaded files
  - Content-Type header validation
  - Filename sanitization
  - Access control for uploaded content

## Deployment Security

- [ ] **Production Readiness**
  - Environment variable validation
  - Database connection security
  - HTTPS enforcement
  - Health check endpoints
  - Graceful shutdown handling

## Security Testing

- [ ] **Automated Security Tests**
  - Authentication bypass attempts
  - SQL injection testing
  - XSS protection validation
  - CSRF protection verification
  - Rate limiting effectiveness

## Compliance & Privacy

- [ ] **Data Protection**
  - User data encryption at rest
  - Personal information access logging
  - Data retention policies
  - Right to be forgotten implementation

---

## Critical Security TODOs (Priority Order)

1. **Implement Helmet.js** for HTTP security headers
2. **Configure rate limiting** on authentication and payment routes
3. **Secure CORS configuration** with exact origin allowlist
4. **Add structured security logging** for audit trails
5. **Implement refresh token rotation** for enhanced security
6. **Set up automated security testing** in CI/CD pipeline

## Environment Configuration

Required environment variables for production:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentication
JWT_SECRET=<strong-random-secret>
REFRESH_TOKEN_SECRET=<different-strong-random-secret>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Security
NODE_ENV=production
TRUST_PROXY_HOPS=1  # Adjust based on infrastructure
```

## Security Review Checklist

Before deploying to production:

- [ ] All TODOs in this document completed
- [ ] Security testing suite passing
- [ ] Environment variables properly configured
- [ ] Rate limiting tuned for expected traffic
- [ ] Monitoring and alerting configured
- [ ] Incident response procedures documented