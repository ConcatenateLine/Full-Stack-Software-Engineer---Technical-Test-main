# Production Deployment Guide

## Docker Configuration

The updated dockerfile includes:
- ✅ Non-root user execution for security
- ✅ Proper file permissions (no chmod 777)
- ✅ Health checks for monitoring
- ✅ Production environment variable
- ✅ Optimized dependency installation

## Environment Setup

1. Copy `.env.production.example` to `.env.production`
2. Update with your production values:
   - Database credentials
   - JWT secret (use a strong, unique secret)
   - Domain URLs
   - CORS origins

## Deployment Options

### Option 1: Docker Compose (Recommended)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Standalone Docker
```bash
# Build image
docker build -t backend-prod .

# Run container
docker run -d \
  --name backend \
  -p 8080:8080 \
  --env-file .env.production \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/assets:/app/assets \
  backend-prod
```

## Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure production database
- [ ] Set correct ALLOWED_ORIGINS
- [ ] Ensure SSL certificates for HTTPS
- [ ] Set up database backups
- [ ] Configure monitoring for health checks
- [ ] Set up log aggregation
- [ ] Review file upload limits and security

## Security Notes

- Application runs as non-root user
- File permissions are properly set
- Database logging is disabled in production
- Health checks are configured for monitoring
- Environment variables are used for sensitive data

## Monitoring

The application includes:
- Health check endpoint: `/api/health`
- Docker health checks
- Error logging in console

Consider setting up:
- Application monitoring (PM2, New Relic, etc.)
- Database monitoring
- Log aggregation (ELK stack, etc.)
