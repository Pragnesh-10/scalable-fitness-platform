# AWS Migration Guide for FitPulse Backend

## Overview
Your Node.js Express backend currently runs on Render. This guide covers migrating to AWS with three recommended options.

---

## Option Comparison

| Feature | EC2 | Elastic Beanstalk | AppRunner | Lambda |
|---------|-----|------------------|-----------|--------|
| **Ease of Setup** | ⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Cost** | $$ | $$ | $$$ | $ (if low traffic) |
| **Scalability** | Manual | Auto | Auto | Auto |
| **Control** | Full | High | Medium | Low |
| **Always-On** | ✅ | ✅ | ✅ | ❌ (cold starts) |
| **Container Support** | ✅ | ✅ | ✅ | ❌ |
| **Recommended for FitPulse** | ✅ If you need full control | ✅✅ Best for lift-and-shift | ✅ Simple & managed | ❌ Not ideal (cold starts) |

---

## Recommended: AWS Elastic Beanstalk (Most Similar to Render)

**Why Elastic Beanstalk?**
- Closest to Render's simplicity
- Handles deployment, scaling, and updates automatically
- Pay only for EC2 instances
- Environment configuration via `.ebextensions`
- Easy CI/CD integration

### Prerequisites
1. AWS Account (free tier eligible)
2. AWS CLI installed: `brew install awscli`
3. EB CLI: `brew install aws-elasticbeanstalk`
4. AWS credentials configured: `aws configure`

### Step 1: Prepare Your Project

```bash
cd /Users/ypragnesh/Desktop/fitness/backend

# Create .ebignore file (similar to .gitignore)
cat > .ebignore << 'EOF'
node_modules/
.git
.gitignore
.env.local
.DS_Store
EOF

# Ensure package.json has correct start script
# Should already have: "start": "node server.js"
```

### Step 2: Initialize Elastic Beanstalk

```bash
# Initialize EB in the backend directory
eb init -p "Node.js 20 running on 64bit Amazon Linux 2" fitpulse-api --region us-east-1

# Create an environment (e.g., production)
eb create fitpulse-prod --instance-type t3.small --envvars NODE_ENV=production,PORT=8081
```

### Step 3: Configure Environment Variables

Create `.ebextensions/01_env.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: "production"
    PORT: "8081"
    MONGO_URI: "mongodb+srv://[user]:[pass]@[cluster]/fitpulse"
    JWT_SECRET: "[your-secret-key]"
    FRONTEND_URL: "https://your-frontend-domain.com"
    PROD_FRONTEND_URL: "https://your-frontend-domain.com"
    RATE_LIMIT_MAX: "100"
    AUTH_RATE_LIMIT_MAX: "10"
    AUTHENTICATED_RATE_LIMIT_MAX: "300"
    COACH_REGISTRATION_KEY: "[your-coach-key]"
```

### Step 4: Deploy

```bash
# Deploy to Elastic Beanstalk
eb deploy

# Check status
eb status

# View logs
eb logs

# Open in browser
eb open
```

---

## Alternative: AWS AppRunner (Simplest - Recommended for First-Time AWS Users)

**Why AppRunner?**
- Simplest deployment process
- Automatic container builds from GitHub
- Built-in HTTPS
- No infrastructure management
- Pay per container hour (~$0.005-0.007 per hour)

### Step 1: Push to GitHub

```bash
cd /Users/ypragnesh/Desktop/fitness
git add .
git commit -m "Ready for AWS AppRunner"
git push origin main
```

### Step 2: Create AppRunner Service (via AWS Console)

1. Go to AWS Console → AppRunner
2. Click "Create Service"
3. Select "Source code repository"
4. Connect GitHub → Authorize → Select `fitness` repo
5. Select branch: `main`
6. Runtime: Node.js 20
7. Build settings:
   - Build command: `cd backend && npm install`
   - Start command: `npm start`
8. Port: `5001`
9. Environment variables:
   ```
   NODE_ENV=production
   PORT=5001
   MONGO_URI=mongodb+srv://[user]:[pass]@[cluster]/fitpulse
   JWT_SECRET=[your-secret]
   FRONTEND_URL=https://your-frontend.com
   ```
10. Click "Create & Deploy"

**Automatic deploys:**
- AppRunner automatically redeploys when you push to `main`

---

## Alternative: AWS EC2 (Full Control)

If you need maximum control, use EC2 with a deployment script.

### Quick EC2 Setup:

```bash
# 1. Launch t3.micro instance (free tier eligible)
# - AMI: Ubuntu 22.04 LTS
# - Security Group: Allow 22 (SSH), 80, 443, 5001

# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Clone repo
git clone https://github.com/your-username/fitness.git
cd fitness/backend

# 5. Install dependencies
npm install

# 6. Set environment variables
sudo tee /etc/environment << EOF
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://[user]:[pass]@[cluster]/fitpulse
JWT_SECRET=[your-secret]
FRONTEND_URL=https://your-frontend.com
EOF

# 7. Use PM2 for process management
sudo npm install -g pm2
pm2 start server.js --name fitpulse-api
pm2 startup
pm2 save

# 8. Use Nginx as reverse proxy (optional but recommended)
sudo apt-get install -y nginx
sudo tee /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
sudo systemctl restart nginx
```

---

## Database Considerations

### Keep MongoDB Atlas (Recommended)
Your current setup likely uses MongoDB Atlas (cloud). Keep it - it's AWS-agnostic and works perfectly.

### Alternative: AWS DocumentDB
If you want everything in AWS:
- AWS-native MongoDB-compatible database
- Starts at $1+ per day
- Requires VPC setup
- Not free tier eligible

**Recommendation:** Keep MongoDB Atlas unless you have specific AWS-only requirements.

---

## Domain & SSL Setup

### Option 1: Route 53 + AWS Certificate Manager (Recommended)
```bash
# 1. Register domain in Route 53
# 2. Request free SSL cert in ACM
# 3. Create load balancer to attach cert
```

### Option 2: CloudFlare (Simpler)
```
# 1. Point your domain to CloudFlare
# 2. CloudFlare handles SSL automatically (free)
# 3. Point CloudFlare to your AWS service
```

---

## Migration Checklist

- [ ] Create AWS Account
- [ ] Install AWS CLI & EB CLI
- [ ] Configure AWS credentials
- [ ] Choose hosting option (Elastic Beanstalk recommended)
- [ ] Update environment variables for production
- [ ] Test backend APIs after deployment
- [ ] Update FRONTEND_URL in backend config
- [ ] Update API URL in frontend (.env.local)
- [ ] Test signup, login, and protected routes
- [ ] Set up monitoring (CloudWatch)
- [ ] Enable backups & disaster recovery
- [ ] Set up domain & SSL

---

## Cost Estimation (Monthly)

**Elastic Beanstalk (t3.small):** ~$10-20/month
**AppRunner (1 instance):** ~$5-10/month
**EC2 (t3.micro free tier):** Free for 12 months, then ~$5/month
**MongoDB Atlas:** $0-10/month (depends on usage)
**Domain:** ~$12/year
**SSL:** Free (AWS ACM or CloudFlare)

---

## Environment Variables You'll Need

```bash
# Required
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/fitpulse
JWT_SECRET=your-256-bit-random-secret
FRONTEND_URL=https://your-frontend-domain.com

# Security (from your recent hardening)
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
AUTH_RATE_LIMIT_MAX=10
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTHENTICATED_RATE_LIMIT_MAX=300
COACH_REGISTRATION_KEY=your-secret-coach-key
CORS_ALLOWED_ORIGINS=https://your-frontend.com,https://www.your-frontend.com
```

---

## Next Steps

1. **Choose your option** (I recommend Elastic Beanstalk)
2. **I'll help you set it up** with step-by-step AWS configuration
3. **Test the deployment** from your frontend
4. **Set up monitoring & backups**

Would you like me to help you set up **Elastic Beanstalk** or **AppRunner**? Just let me know!
