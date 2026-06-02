# Deployment Guide

## Deployment Platforms

This application can be deployed to various free or low-cost hosting platforms.

## Option 1: Deploy on Railway

Railway offers a generous free tier and integrates well with Docker Compose.

### Steps:

1. **Sign up on Railway**
   - Go to https://railway.app
   - Sign up with GitHub account

2. **Connect GitHub Repository**
   - Create a GitHub repository with your code
   - Push your code to GitHub
   - Connect Railway to your GitHub repo

3. **Configure Environment**
   - Set PostgreSQL database
   - Configure environment variables in Railway dashboard
   - Copy PostgreSQL connection string

4. **Update .env for Production**
   ```
   DATABASE_URL=your_railway_postgres_url
   ENVIRONMENT=production
   ```

5. **Deploy**
   - Railway auto-deploys on push
   - Check deployment status in dashboard

## Option 2: Deploy on Render

Render offers free tier with automatic deployments.

### Steps:

1. **Sign up on Render**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Create a new PostgreSQL database
   - Note the connection string

3. **Deploy Backend**
   - Create new Web Service
   - Connect GitHub repository
   - Set environment variables
   - Deploy

4. **Deploy Frontend**
   - Create new Static Site
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

5. **Update API URL**
   - In frontend `.env`, set `VITE_API_URL` to your backend URL

## Option 3: Deploy on Heroku (Limited Free Tier)

Note: Heroku's free tier is limited as of 2024.

### Steps:

1. **Sign up on Heroku**
   - Go to https://www.heroku.com
   - Sign up

2. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

3. **Create Procfile**
   ```
   web: gunicorn main:app --bind 0.0.0.0:$PORT
   ```

4. **Deploy**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

## Option 4: Deploy on DigitalOcean

DigitalOcean offers $5/month droplets with Docker support.

### Steps:

1. **Create Droplet**
   - Choose Ubuntu 22.04
   - Select $5/month plan
   - Add Docker in "Select additional options"

2. **SSH into Droplet**
   ```bash
   ssh root@your_droplet_ip
   ```

3. **Clone Repository**
   ```bash
   git clone your_repo_url
   cd Assignment-new
   ```

4. **Configure Environment**
   ```bash
   nano .env
   # Update DATABASE_URL with secure password
   # Update other production settings
   ```

5. **Build and Run**
   ```bash
   docker-compose up -d --build
   ```

6. **Setup Firewall**
   ```bash
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```

7. **Setup Domain & SSL**
   - Point domain to droplet IP
   - Use Let's Encrypt for SSL

## Option 5: Deploy on AWS

AWS offers free tier for 12 months.

### Using ECS (Elastic Container Service):

1. **Create ECR Repository**
   ```bash
   aws ecr create-repository --repository-name inventory-app
   ```

2. **Push Images**
   ```bash
   docker build -t inventory-backend ./backend
   docker tag inventory-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/inventory-app:latest
   docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/inventory-app:latest
   ```

3. **Create ECS Cluster**
   - Define task definitions for backend, frontend, database
   - Create service for each

4. **Setup RDS PostgreSQL**
   - Create RDS instance
   - Configure security groups
   - Update DATABASE_URL

## General Production Checklist

- [ ] Update all passwords in `.env`
- [ ] Enable HTTPS/SSL
- [ ] Setup domain name
- [ ] Configure CORS properly
- [ ] Enable database backups
- [ ] Setup monitoring and logging
- [ ] Configure rate limiting
- [ ] Setup authentication
- [ ] Add request validation
- [ ] Enable GZIP compression
- [ ] Setup CDN for static assets
- [ ] Configure firewall
- [ ] Setup health checks
- [ ] Create backup strategy
- [ ] Document deployment steps

## Environment Variables for Production

```bash
# Database
DATABASE_URL=postgresql://user:secure_password@host:5432/inventory_db

# Security
SECRET_KEY=your_secret_key_here

# API Settings
CORS_ORIGINS=https://yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com

# Monitoring
LOG_LEVEL=INFO

# Performance
DATABASE_POOL_SIZE=10
```

## Backup Strategy

### Daily Backups

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U postgres inventory_db > backups/backup_$DATE.sql
```

### Upload to Cloud Storage

```bash
# Upload to AWS S3
aws s3 cp backups/backup_$DATE.sql s3://your-bucket-name/
```

## Monitoring

### Setup Health Checks

```bash
# Check all services
curl https://yourdomain.com/health

# Set up monitoring alerts if status != healthy
```

### Log Aggregation

```bash
# Option 1: Use cloud provider's logging
# Option 2: Setup ELK stack
# Option 3: Use Datadog, New Relic, etc.
```

## Security Hardening

1. **Database**
   - Use strong passwords
   - Enable SSL connections
   - Restrict IP access
   - Regular backups

2. **API**
   - Enable HTTPS only
   - Implement rate limiting
   - Add request validation
   - Use API keys/tokens

3. **Infrastructure**
   - Use firewall rules
   - Enable WAF (Web Application Firewall)
   - Regular security audits
   - Keep dependencies updated

4. **Application**
   - No hardcoded secrets
   - Use environment variables
   - Regular dependency updates
   - Code review process

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml - Production
backend:
  replicas: 3
  # Use load balancer (nginx, HAProxy)

frontend:
  replicas: 2
```

### Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_sku ON products(sku);
CREATE INDEX idx_email ON customers(email);
CREATE INDEX idx_customer_id ON orders(customer_id);
```

### Caching

```python
# Add Redis for caching
# Configure FastAPI with Redis
```

## Disaster Recovery

1. **Regular Backups**
   - Daily database backups
   - Store in multiple locations
   - Test restore procedures

2. **Redundancy**
   - Multiple database replicas
   - Load balancing
   - Multi-region deployment

3. **Documentation**
   - Keep deployment runbook
   - Document recovery procedures
   - Version control everything

## Support & Troubleshooting

If issues arise:

1. Check logs: `docker-compose logs -f`
2. Verify environment variables: `docker-compose config`
3. Test connectivity: `curl /health`
4. Review deployment logs on hosting platform
5. Consult platform-specific documentation

## Next Steps After Deployment

1. Monitor application performance
2. Gather user feedback
3. Plan feature enhancements
4. Implement authentication
5. Add advanced analytics
6. Optimize for production
7. Plan for scaling

---

**Recommended:** Start with Railway or Render for ease, then migrate to AWS/DigitalOcean for scaling.
