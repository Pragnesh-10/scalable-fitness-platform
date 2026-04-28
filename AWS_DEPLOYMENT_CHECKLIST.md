# AWS Elastic Beanstalk Deployment Checklist

## Pre-Deployment Setup (One-Time)

### AWS Account & CLI Setup
- [ ] Create AWS Account (https://aws.amazon.com)
- [ ] Install AWS CLI: `brew install awscli`
- [ ] Install EB CLI: `brew install aws-elasticbeanstalk`
- [ ] Configure credentials: `aws configure`
- [ ] Verify setup: `aws sts get-caller-identity`

### Repository Setup
- [ ] Ensure code is pushed to GitHub (main branch)
- [ ] Copy `.env.production.example` to `.env.production`
- [ ] Fill in production secrets in `.env.production`
- [ ] Review `.ebextensions/` configurations
- [ ] Review `.elasticbeanstalk/config.yml`

### AWS Secrets (GitHub Actions)
- [ ] Go to GitHub repo → Settings → Secrets and variables → Actions
- [ ] Create `AWS_ACCESS_KEY_ID`
- [ ] Create `AWS_SECRET_ACCESS_KEY`
- [ ] Verify secrets are set (don't show values)

---

## Initial Deployment

### Step 1: Manual Setup
```bash
cd /Users/ypragnesh/Desktop/fitness/backend

# Run setup script
chmod +x aws-setup.sh
./aws-setup.sh

# Follow prompts for region and instance type
```

### Step 2: Create Environment
```bash
# Create the Elastic Beanstalk environment (5-10 min)
eb create fitpulse-prod \
  --instance-type t3.small \
  --envvars NODE_ENV=production,PORT=5001

# Monitor creation
eb status
```

### Step 3: Deploy Application
```bash
# Deploy your backend code
eb deploy

# Wait for deployment to complete
eb status

# Check logs
eb logs
```

### Step 4: Verify Deployment
```bash
# Test API
API_URL=$(eb open --print-url)
curl $API_URL/health

# Should return: {"status":"OK","timestamp":"..."}
```

---

## Post-Deployment Verification

### Test Core Functionality
- [ ] Health endpoint: `GET /health` → 200 OK
- [ ] Register endpoint: `POST /api/auth/register` → 201 Created
- [ ] Login endpoint: `POST /api/auth/login` → 200 OK
- [ ] Protected route (no token): `GET /api/user/profile` → 401 Unauthorized
- [ ] Protected route (valid token): `GET /api/user/profile` → 200 OK
- [ ] RBAC (user accessing coach route): `GET /api/coach/clients` → 403 Forbidden
- [ ] Rate limiting: Multiple auth attempts → 429 Too Many Requests after limit

### Check Logs & Monitoring
- [ ] View application logs: `eb logs --stream`
- [ ] Check CloudWatch metrics: AWS Console → CloudWatch → Metrics
- [ ] Verify MongoDB connection: Check application logs for connection message
- [ ] Check environment health: `eb health`

### Update Frontend
- [ ] Update frontend `.env.local` or `.env.production`:
  ```bash
  NEXT_PUBLIC_API_URL=https://your-eb-url/api
  ```
- [ ] Redeploy frontend (if using Vercel): `git push`
- [ ] Test signup flow from frontend
- [ ] Test login flow from frontend

---

## Ongoing Maintenance

### Regular Checks
- [ ] Monitor error logs: `eb logs --stream`
- [ ] Check environment health: `eb health`
- [ ] Monitor CloudWatch metrics
- [ ] Review MongoDB Atlas metrics

### Code Updates
- [ ] Push changes to `main` branch
- [ ] GitHub Actions automatically deploys (if configured)
- [ ] Monitor deployment in GitHub Actions tab
- [ ] Verify new version with `eb open`

### Scheduled Tasks
- **Daily**: Check application logs for errors
- **Weekly**: Review CloudWatch metrics (CPU, memory, requests)
- **Monthly**: Review AWS costs and scaling settings
- **Monthly**: Test backup/recovery procedures

---

## Common Deployment Issues & Solutions

### Issue: Deployment Timeout
**Solution:**
```bash
# Check if Node.js is running
eb ssh
ps aux | grep node

# View logs
eb logs --stream
```

### Issue: API Returns 502/503
**Solution:**
```bash
# Check environment variables
eb printenv

# Check if MongoDB connection is working
eb ssh
# Then inside the instance:
curl http://localhost:5001/health
```

### Issue: CORS Errors from Frontend
**Solution:**
```bash
# Update CORS_ALLOWED_ORIGINS
eb setenv CORS_ALLOWED_ORIGINS="https://your-frontend.com,https://www.your-frontend.com"

# Redeploy
eb deploy
```

### Issue: Rate Limiting Too Strict/Loose
**Solution:**
```bash
# Adjust rate limiting
eb setenv RATE_LIMIT_MAX=200 AUTH_RATE_LIMIT_MAX=20

# Redeploy
eb deploy
```

### Issue: Out of Memory
**Solution:**
```bash
# Upgrade instance type
# Edit .ebextensions/01_nodejs.config:
# Change InstanceType: from t3.small to t3.medium

# Then redeploy
eb deploy
```

---

## Scaling Strategy

### Current Setup (t3.small)
- **Cost**: ~$10-15/month
- **Traffic**: ~100-500 active users
- **Performance**: Good for most use cases

### Scale to t3.medium (if needed)
- **Cost**: ~$30/month
- **Traffic**: 500-2000+ active users
- **When**: If CPU consistently > 80%

### Enable Auto-Scaling
```bash
# Already configured in .ebextensions/01_nodejs.config
# Auto-scales 1-3 instances based on CPU usage

# Verify auto-scaling is working
eb scale 2  # Scale to 2 instances
eb status   # Check status
```

---

## Disaster Recovery

### Backup MongoDB Atlas
- ✅ Automatic daily backups enabled on MongoDB Atlas
- MongoDB Atlas → Backup → View Backups

### Restore MongoDB
```bash
# Restore from Atlas backup (via MongoDB Atlas console)
# Or restore from snapshots if available
```

### Rebuild Elastic Beanstalk Environment
```bash
# If environment is corrupted, terminate and recreate
eb terminate
eb create fitpulse-prod --instance-type t3.small
eb deploy
```

---

## Security Checklist

- [ ] JWT_SECRET is strong (32+ chars, random)
- [ ] COACH_REGISTRATION_KEY is kept secret
- [ ] CORS_ALLOWED_ORIGINS excludes wildcards
- [ ] Rate limiting is enabled and reasonable
- [ ] MongoDB connection uses strong password
- [ ] SSL certificate is valid (via CloudFlare or ACM)
- [ ] AWS IAM user has minimal required permissions
- [ ] Application logs do not expose secrets

---

## Monitoring & Alerts (Optional)

### Set Up CloudWatch Alarms
1. AWS Console → CloudWatch → Alarms
2. Create alarm for:
   - High CPU (> 80%)
   - Low disk space (< 20%)
   - Application errors (5xx responses)
   - High latency (> 1 second)

### Set Up Notifications
```bash
# Create SNS topic for alerts
aws sns create-topic --name fitpulse-alerts

# Subscribe to email/SMS
# AWS Console → SNS → Topics → fitpulse-alerts
```

---

## Performance Optimization

### Current Configuration
- ✅ Gzip compression enabled
- ✅ Nginx proxy enabled
- ✅ Enhanced health reporting enabled
- ✅ CloudWatch logs enabled (7 days retention)

### Additional Optimization
- [ ] Enable ElastiCache (Redis) for session storage
- [ ] Add CloudFront distribution for static assets
- [ ] Enable Application Load Balancer (ALB)
- [ ] Implement database connection pooling optimization

---

## Final Notes

- **Elastic Beanstalk URL**: Will be `fitpulse-prod.REGION.elasticbeanstalk.com`
- **Custom Domain**: Use Route 53 or CloudFlare CNAME record
- **SSL Certificate**: Use AWS ACM or CloudFlare (free)
- **Support**: AWS Support (Business plan recommended for production)

---

**Last Updated**: April 2026
**Deployment Method**: AWS Elastic Beanstalk with GitHub Actions CI/CD
**Instance Type**: t3.small (adjustable)
**Region**: us-east-1 (configurable)
