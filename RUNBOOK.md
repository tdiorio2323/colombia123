# Operations Runbook

This runbook provides step-by-step procedures for deploying, monitoring, and maintaining the creator monetization platform.

## 🚀 Deployment Procedures

### Development Setup

```bash
# 1. Clone and install dependencies
git clone <repository-url>
cd colombia
npm install

# 2. Environment setup
cp .env.example .env
# Edit .env with your configuration values

# 3. Start development server
npm run dev
```

### Production Deployment

#### Pre-deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Type checking clean (`npm run typecheck`)
- [ ] Security scan completed (`npm audit`)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates valid

#### Docker Deployment

```bash
# 1. Build production image
docker build -t creator-platform:latest .

# 2. Run with Docker Compose
docker-compose up -d

# 3. Verify deployment
docker-compose ps
docker-compose logs app
```

#### Health Check Verification

```bash
# Check application health
curl -f http://localhost:8080/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2024-01-01T00:00:00.000Z",
#   "uptime": 12345,
#   "version": "1.0.0"
# }
```

## 🔍 Monitoring & Alerting

### Log Monitoring

#### Log Locations

- **Application logs**: `/var/log/app/`
- **Security logs**: `/var/log/app/security/`
- **Payment logs**: `/var/log/app/payments/`
- **Performance logs**: `/var/log/app/performance/`

#### Key Log Events to Monitor

```bash
# Rate limit violations
tail -f /var/log/app/security/security-*.log | grep "RATE_LIMIT_EXCEEDED"

# Payment failures
tail -f /var/log/app/payments/payment-*.log | grep "error"

# Authentication failures
tail -f /var/log/app/security/security-*.log | grep "auth_failure"

# Performance issues
tail -f /var/log/app/performance/performance-*.log | grep "slow_query"
```

### Performance Monitoring

#### Key Metrics

- **Response Time**: Average API response time < 200ms
- **Error Rate**: Error rate < 1%
- **CPU Usage**: < 70% average
- **Memory Usage**: < 80% of available
- **Database Connections**: < 80% of pool size

#### Monitoring Commands

```bash
# Check system resources
docker stats creator-platform

# Check application metrics
curl http://localhost:8080/metrics

# Database connection status
docker exec creator-db psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"
```

## 🛠️ Maintenance Procedures

### Security Maintenance

#### Weekly Security Review

1. **Review Security Logs**

   ```bash
   # Check for suspicious activity
   grep -E "(RATE_LIMIT|auth_failure|suspicious)" /var/log/app/security/security-*.log | tail -100

   # Review failed payment attempts
   grep "payment_failed" /var/log/app/payments/payment-*.log | tail -50
   ```

2. **Validate Security Headers**

   ```bash
   curl -I https://your-domain.com | grep -E "(Strict-Transport-Security|Content-Security-Policy|X-Frame-Options)"
   ```

3. **Check SSL Certificate**
   ```bash
   echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
   ```

#### Monthly Security Tasks

- [ ] Update dependencies (`npm update`)
- [ ] Security audit (`npm audit`)
- [ ] Review user access permissions
- [ ] Rotate API keys and secrets
- [ ] Review rate limiting effectiveness
- [ ] Check for new security advisories

### Database Maintenance

#### Daily Tasks

```bash
# Check database health
docker exec creator-db psql -U postgres -c "SELECT version();"

# Monitor connection counts
docker exec creator-db psql -U postgres -c "SELECT state, count(*) FROM pg_stat_activity GROUP BY state;"
```

#### Weekly Tasks

```bash
# Backup database
docker exec creator-db pg_dump -U postgres -d creator_db > backup_$(date +%Y%m%d).sql

# Check database size
docker exec creator-db psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('creator_db'));"

# Analyze table statistics
docker exec creator-db psql -U postgres -d creator_db -c "ANALYZE VERBOSE;"
```

### Log Rotation

```bash
# Check log sizes
du -sh /var/log/app/

# Manual log rotation (if needed)
docker exec creator-platform npm run logs:rotate
```

## 🚨 Incident Response

### Emergency Contacts

- **Technical Lead**: [contact-info]
- **Security Team**: [contact-info]
- **Platform Team**: [contact-info]
- **Payment Provider**: Stripe Support

### Incident Response Steps

#### 1. Immediate Response

```bash
# Check system status
docker-compose ps

# Review recent logs
docker-compose logs --tail=100 app

# Check resource usage
docker stats
```

#### 2. Security Incident

```bash
# Isolate affected systems
docker-compose stop app

# Preserve evidence
cp -r /var/log/app/ /tmp/incident-logs-$(date +%Y%m%d-%H%M%S)/

# Review security logs
grep -E "(attack|breach|unauthorized)" /var/log/app/security/*.log > /tmp/security-incident.log
```

#### 3. Payment System Issues

```bash
# Check payment processing status
curl -H "Authorization: Bearer $STRIPE_SECRET_KEY" https://api.stripe.com/v1/events?limit=10

# Review payment logs
grep "payment_error" /var/log/app/payments/*.log | tail -20

# Verify webhook endpoints
curl -X GET https://api.stripe.com/v1/webhook_endpoints \
  -H "Authorization: Bearer $STRIPE_SECRET_KEY"
```

### Recovery Procedures

#### Application Recovery

```bash
# 1. Stop services
docker-compose down

# 2. Pull latest stable version
docker pull creator-platform:stable

# 3. Start with health checks
docker-compose up -d
sleep 30
curl -f http://localhost:8080/health

# 4. Verify functionality
curl -f http://localhost:8080/api/health
```

#### Database Recovery

```bash
# 1. Stop application
docker-compose stop app

# 2. Restore from backup
docker exec -i creator-db psql -U postgres -d creator_db < backup_latest.sql

# 3. Restart services
docker-compose up -d
```

## 📊 Performance Optimization

### Database Optimization

```sql
-- Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public';
```

### Application Optimization

```bash
# Check memory usage
docker exec creator-platform node -e "console.log(process.memoryUsage())"

# Profile API endpoints
curl -w "Response time: %{time_total}s\n" http://localhost:8080/api/creators

# Check bundle sizes
npm run build:analyze
```

## 🔄 Backup & Recovery

### Automated Backups

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec creator-db pg_dump -U postgres creator_db | gzip > backup_$DATE.sql.gz
aws s3 cp backup_$DATE.sql.gz s3://backups/database/
```

### File Backups

```bash
# Application files
tar -czf app_backup_$(date +%Y%m%d).tar.gz /app/uploads/
aws s3 cp app_backup_*.tar.gz s3://backups/files/
```

### Recovery Testing

- [ ] Monthly restore test from backup
- [ ] Disaster recovery drill (quarterly)
- [ ] Documentation update after each test

## 📈 Scaling Procedures

### Horizontal Scaling

```bash
# Scale application containers
docker-compose up -d --scale app=3

# Update load balancer configuration
# (Configure Nginx or cloud load balancer)
```

### Vertical Scaling

```bash
# Update resource limits in docker-compose.yml
# Restart services
docker-compose down && docker-compose up -d
```

## 🔧 Troubleshooting Guide

### Common Issues

#### High CPU Usage

1. Check for expensive queries in database
2. Review API endpoint performance
3. Check for memory leaks
4. Scale horizontally if needed

#### Payment Processing Errors

1. Verify Stripe webhook configuration
2. Check API key validity
3. Review payment logs for patterns
4. Test with Stripe CLI

#### Database Connection Issues

1. Check connection pool settings
2. Verify database server health
3. Review connection logs
4. Check network connectivity

### Diagnostic Commands

```bash
# System health check
curl http://localhost:8080/health

# Database connectivity
docker exec creator-db pg_isready

# API response time
curl -w "@curl-format.txt" http://localhost:8080/api/creators

# Memory usage
docker exec creator-platform cat /proc/meminfo

# Disk space
df -h
```
