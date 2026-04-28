# AWS Elastic Beanstalk Deployment Guide

## Prerequisites (One-Time Setup)

### 1. Install Required Tools
```bash
# AWS CLI
brew install awscli

# Elastic Beanstalk CLI
brew install aws-elasticbeanstalk

# Verify installations
aws --version
eb --version
```

### 2. Configure AWS Credentials
```bash
aws configure

# You'll be prompted for:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: us-east-1
# - Default output format: json
```

**Get AWS Keys:**
1. Go to [AWS Console](https://console.aws.amazon.com)
2. IAM → Users → Your User
3. "Create access key"
4. Download and save credentials

### 3. Run Setup Script
```bash
cd /Users/ypragnesh/Desktop/fitness/backend
chmod +x aws-setup.sh
./aws-setup.sh
```

The script will:
- Validate AWS CLI setup
- Ask for region selection
- Ask for environment name
- Ask for instance type
- Initialize Elastic Beanstalk
- Create `.ebignore`

---

## Production Environment Variables

### Step 1: Copy Example File
```bash
cd /Users/ypragnesh/Desktop/fitness/backend
cp .env.production.example .env.production
```

### Step 2: Fill in Your Values
```bash
# Edit with your editor
vim .env.production
# or
nano .env.production
```

**Required values:**
- `MONGO_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `FRONTEND_URL`: Your frontend domain (e.g., https://fitpulse.vercel.app)
- `COACH_REGISTRATION_KEY`: Any secret string for coach registration

---

## Deployment Steps

### Step 1: First-Time Environment Creation
```bash
cd /Users/ypragnesh/Desktop/fitness/backend

# Set environment variables from your .env.production file
export MONGO_URI="mongodb+srv://..."
export JWT_SECRET="your-secret"
export FRONTEND_URL="https://your-domain.com"
export COACH_REGISTRATION_KEY="secret-code"

# Create environment (this takes 5-10 minutes)
eb create fitpulse-prod \
  --instance-type t3.small \
  --envvars NODE_ENV=production,PORT=5001,MONGO_URI="$MONGO_URI",JWT_SECRET="$JWT_SECRET",FRONTEND_URL="$FRONTEND_URL",COACH_REGISTRATION_KEY="$COACH_REGISTRATION_KEY"

# Wait for completion
eb status
```

### Step 2: Check Status
```bash
# Check if deployment is complete
eb status

# Should show:
# Environment: fitpulse-prod
# Status: Ready
# Health: Green
```

### Step 3: View Logs
```bash
# Stream live logs
eb logs

# Or view most recent logs
eb logs --zip
```

### Step 4: Test Your API
```bash
# Get your Elastic Beanstalk URL
EB_URL=$(eb open --print-url)
echo "API URL: $EB_URL"

# Test health endpoint
curl $EB_URL/health

# Should return:
# {"status":"OK","timestamp":"2026-04-29T..."}
```

### Step 5: Get Full URL for Frontend
```bash
# Print the environment URL
eb open --print-url

# You'll get something like:
# http://fitpulse-prod.us-east-1.elasticbeanstalk.com
```

---

## Subsequent Deployments

After your first deployment, updating your API is simple:

```bash
cd /Users/ypragnesh/Desktop/fitness/backend

# Make your code changes
git add .
git commit -m "Update API logic"

# Deploy
eb deploy

# Check status
eb status

# View logs
eb logs
```

---

## Managing Environment Variables in Production

### Option 1: Set via CLI (Quick)
```bash
eb setenv JWT_SECRET=new-secret FRONTEND_URL=https://new-domain.com
```

### Option 2: Edit via Console
```bash
# Open Elastic Beanstalk console
eb console

# Or open directly in browser:
# https://console.aws.amazon.com/elasticbeanstalk
```

### Option 3: Update .ebextensions
```bash
# Edit .ebextensions/03_env.config (if exists)
# Then redeploy
eb deploy
```

---

## Monitoring & Logs

### View Application Logs
```bash
# Stream real-time logs
eb logs --stream

# Download all logs
eb logs --zip

# View logs in CloudWatch
# https://console.aws.amazon.com/cloudwatch
```

### Health Dashboard
```bash
# Check health status
eb health

# Open health dashboard
eb health --refresh
```

### AWS Console (Full Monitoring)
1. Go to [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk)
2. Select `fitpulse-prod`
3. View:
   - Recent Deployments
   - Environment Health
   - Logs
   - Monitoring → CloudWatch metrics

---

## Scaling Your Application

### Auto Scaling Configuration
Edit `.ebextensions/01_nodejs.config`:

```yaml
option_settings:
  aws:autoscaling:asg:
    MinSize: "1"
    MaxSize: "3"
    DesiredCapacity: "1"

  aws:autoscaling:trigger:
    MeasureName: "CPUUtilization"
    Statistic: "Average"
    Unit: "Percent"
    UpperThreshold: "80"
    LowerThreshold: "20"
    UpperBreachScaleIncrement: "1"
    LowerBreachScaleIncrement: "-1"
```

Then redeploy:
```bash
eb deploy
```

---

## Domain & SSL Setup

### Option 1: CloudFlare (Recommended)
```
1. Register domain on CloudFlare
2. Add DNS record pointing to EB URL
   Type: CNAME
   Name: api
   Value: fitpulse-prod.us-east-1.elasticbeanstalk.com
3. CloudFlare automatically provides free SSL
```

### Option 2: AWS Route 53 + ACM
```
1. Register domain in Route 53
2. Request SSL certificate in ACM
3. Create ALB in EC2 and attach cert
4. Create Route 53 alias record
```

---

## Updating Frontend to Use AWS Backend

In [frontend/.env.local](../frontend/.env.local):

```bash
# Old (Render)
NEXT_PUBLIC_API_URL=http://localhost:5001/api

# New (AWS Elastic Beanstalk)
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
# OR
NEXT_PUBLIC_API_URL=https://fitpulse-prod.us-east-1.elasticbeanstalk.com/api
```

Then redeploy frontend:
```bash
cd frontend
npm run build
# Deploy to Vercel or your hosting
```

---

## Database Backup (MongoDB Atlas)

Your MongoDB is on Atlas, so backups are automatic:

1. Go to [MongoDB Atlas Console](https://cloud.mongodb.com)
2. Project → Backup
3. Automatic backups are enabled by default
4. Manual backups available anytime

---

## Troubleshooting

### Deployment Fails
```bash
# Check logs
eb logs

# Check EB events
eb events

# Check CPU/Memory
eb health
```

### Environment Health is Red
```bash
# Get detailed logs
eb logs --stream

# Check specific log files
# Common issues:
# - PORT not set to 5001
# - NODE_ENV not set to production
# - MONGO_URI incorrect or unreachable
# - JWT_SECRET missing
```

### API Returns 502/503
```bash
# Check if Node.js is running
eb ssh
ps aux | grep node

# Check logs
cd /var/log
tail -f nodejs/nodejs.log
```

---

## Cost Estimation

| Resource | Free Tier | Paid (Monthly) |
|----------|-----------|---------|
| t3.micro EC2 | ✅ 750 hrs/month | - |
| t3.small EC2 | ✗ | ~$10-15 |
| Data Transfer | ✅ 1 GB/month | $0.09/GB after |
| Elastic Beanstalk | ✅ Included | No extra charge |

**Recommendation:** Start with t3.micro (free tier), upgrade to t3.small if needed.

---

## Clean Up / Destroy Environment

⚠️ **WARNING: This cannot be undone**

```bash
# Terminate environment and all resources
eb terminate

# You'll be prompted to confirm
```

---

## Quick Reference Commands

```bash
# Create environment
eb create fitpulse-prod --instance-type t3.small

# Deploy code
eb deploy

# Check status
eb status

# View logs (stream)
eb logs --stream

# SSH into instance
eb ssh

# Set environment variable
eb setenv KEY=VALUE

# Update environment variables
eb setenv NODE_ENV=production FRONTEND_URL=https://domain.com

# Open in browser
eb open

# Get environment URL
eb open --print-url

# Health monitoring
eb health
eb health --refresh

# View all environments
eb list

# Switch environment
eb use fitpulse-prod

# Terminate (DELETE)
eb terminate
```

---

## Next Steps

1. ✅ Install AWS CLI & EB CLI
2. ✅ Run `./aws-setup.sh`
3. ✅ Configure `.env.production`
4. ✅ Create environment: `eb create fitpulse-prod --instance-type t3.small`
5. ✅ Deploy code: `eb deploy`
6. ✅ Update frontend API URL
7. ✅ Test signup/login/protected routes
8. ✅ Set up monitoring
9. ✅ Configure domain & SSL
10. ✅ Enable auto-scaling

**Questions?** Check AWS docs or uncomment the help commands above!
