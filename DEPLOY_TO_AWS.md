# Deploy FitPulse Backend to AWS - Step-by-Step

## Phase 1: Prerequisites (15 minutes)

### Step 1.1: Install AWS Tools
```bash
# Install AWS CLI
brew install awscli

# Install Elastic Beanstalk CLI
brew install aws-elasticbeanstalk

# Verify installations
aws --version
eb --version
```

### Step 1.2: Get AWS Access Keys
1. Go to https://console.aws.amazon.com/
2. Login with your AWS account (create free one if needed)
3. Click your username → "Security credentials"
4. Click "Create access key"
5. Download the CSV file and keep it safe

### Step 1.3: Configure AWS Credentials
```bash
aws configure

# When prompted, enter:
# AWS Access Key ID: [from CSV file]
# AWS Secret Access Key: [from CSV file]
# Default region: us-east-1
# Default output format: json
```

**Verify configuration:**
```bash
aws sts get-caller-identity

# Should output:
# {
#     "UserId": "AIDAI...",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/YourName"
# }
```

---

## Phase 2: Prepare Your Backend (10 minutes)

### Step 2.1: Create Production Environment File
```bash
cd /Users/ypragnesh/Desktop/fitness/backend

# Copy example file
cp .env.production.example .env.production

# Edit with your values
vim .env.production
```

**Fill in these values in `.env.production`:**

```bash
NODE_ENV=production
PORT=5001

# Get your MongoDB connection string from MongoDB Atlas
MONGO_URI=mongodb+srv://your_username:your_password@your-cluster.mongodb.net/fitpulse?appName=fitpulse&retryWrites=true&w=majority

# Generate a strong JWT secret
JWT_SECRET=your-random-256-bit-secret-here

# Your frontend domain (we'll update this later)
FRONTEND_URL=https://your-frontend.vercel.app

# Coach registration key
COACH_REGISTRATION_KEY=your-secret-coach-key

# Rate limiting (keep these as-is)
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
AUTH_RATE_LIMIT_MAX=10
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTHENTICATED_RATE_LIMIT_MAX=300
```

### Step 2.2: Generate Strong JWT Secret
```bash
# Generate a random 256-bit secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and paste it into JWT_SECRET in .env.production
```

### Step 2.3: Verify Your Code
```bash
# Make sure you're in the backend directory
cd /Users/ypragnesh/Desktop/fitness/backend

# Check package.json has correct start script
cat package.json | grep -A 2 '"scripts"'

# Should include: "start": "node server.js"
```

---

## Phase 3: Initialize Elastic Beanstalk (10 minutes)

### Step 3.1: Create .ebignore File
```bash
# In /Users/ypragnesh/Desktop/fitness/backend
cat > .ebignore << 'EOF'
node_modules/
.git
.gitignore
.env
.env.local
.env.production
.DS_Store
*.log
.vscode
.idea
coverage/
build/
dist/
EOF
```

### Step 3.2: Initialize Elastic Beanstalk
```bash
# Still in backend directory
eb init -p "Node.js 20 running on 64bit Amazon Linux 2" fitpulse-api \
  --region us-east-1 \
  --ignore-version-conflict
```

**Response should show:**
```
Application fitpulse-api has been created successfully.
```

### Step 3.3: Verify EB Initialization
```bash
# Check that .elasticbeanstalk/config.yml exists
ls -la .elasticbeanstalk/

# Should show: config.yml
cat .elasticbeanstalk/config.yml

# Should show your app name and region
```

---

## Phase 4: Create AWS Environment (5-10 minutes)

### Step 4.1: Create the Production Environment
```bash
# In backend directory
eb create fitpulse-prod \
  --instance-type t3.small \
  --envvars NODE_ENV=production,PORT=5001
```

**This will:**
- Create an AWS Elastic Beanstalk environment named `fitpulse-prod`
- Launch a t3.small EC2 instance (~$10/month)
- Set up load balancer and auto-scaling
- Take 5-10 minutes to complete

**Monitor progress:**
```bash
# In another terminal, watch the status
eb status

# Keep checking until it shows:
# Status: Ready
# Health: Green
```

### Step 4.2: Set Environment Variables
Once the environment is ready, set your production secrets:

```bash
# Set all environment variables
eb setenv \
  MONGO_URI="mongodb+srv://your_username:your_password@your-cluster.mongodb.net/fitpulse" \
  JWT_SECRET="your-jwt-secret-from-step-2.2" \
  FRONTEND_URL="https://your-frontend.vercel.app" \
  COACH_REGISTRATION_KEY="your-secret-coach-key" \
  RATE_LIMIT_MAX=100 \
  RATE_LIMIT_WINDOW_MS=60000 \
  AUTH_RATE_LIMIT_MAX=10 \
  AUTH_RATE_LIMIT_WINDOW_MS=900000 \
  AUTHENTICATED_RATE_LIMIT_MAX=300
```

**Verify variables were set:**
```bash
eb printenv

# Should show all your variables (secrets masked)
```

---

## Phase 5: Deploy Your Backend Code (5 minutes)

### Step 5.1: Deploy to Elastic Beanstalk
```bash
# In backend directory
eb deploy

# This uploads your code and deploys it
# Takes 2-5 minutes
```

**Monitor deployment:**
```bash
# Watch the deployment
eb status

# Check logs in real-time
eb logs --stream

# Exit logs with Ctrl+C
```

### Step 5.2: Get Your API URL
```bash
# Print the URL of your deployed API
EB_URL=$(eb open --print-url)
echo "Your API URL: $EB_URL"

# Save this URL - you'll need it for the frontend
# Example: http://fitpulse-prod.us-east-1.elasticbeanstalk.com
```

---

## Phase 6: Verify Deployment (10 minutes)

### Step 6.1: Test Health Endpoint
```bash
# Get your EB URL
EB_URL=$(eb open --print-url)

# Test the health endpoint
curl "$EB_URL/health"

# Should return:
# {"status":"OK","timestamp":"2026-04-29T..."}
```

**If this fails:**
```bash
# Check logs
eb logs --stream

# Check environment health
eb health

# Check if instance is running
eb status
```

### Step 6.2: Test Authentication
```bash
EB_URL=$(eb open --print-url)

# Test registration
curl -X POST "$EB_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user",
    "fitnessGoals": "general_fitness"
  }'

# Should return 201 with token:
# {"message":"Account created!","token":"eyJ...","user":{...}}
```

### Step 6.3: Test Protected Route
```bash
EB_URL=$(eb open --print-url)

# Register to get a token
RESPONSE=$(curl -s -X POST "$EB_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another User",
    "email": "another@example.com",
    "password": "password123",
    "role": "user",
    "fitnessGoals": "general_fitness"
  }')

# Extract token
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Test protected route with token
curl "$EB_URL/api/user/profile" \
  -H "Authorization: Bearer $TOKEN"

# Should return 200 with user data

# Test without token (should fail with 401)
curl "$EB_URL/api/user/profile"
# {"error":"No token provided"}
```

### Step 6.4: Test Rate Limiting
```bash
EB_URL=$(eb open --print-url)

# Try logging in 11 times quickly
for i in {1..11}; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$EB_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"fake@example.com","password":"wrong"}')
  echo "Attempt $i: HTTP $CODE"
done

# Should see:
# Attempts 1-10: 401 (unauthorized)
# Attempts 11+: 429 (rate limited)
```

---

## Phase 7: Update Your Frontend (5 minutes)

### Step 7.1: Update Frontend API URL
```bash
cd /Users/ypragnesh/Desktop/fitness/frontend

# Get your EB URL (from Phase 5)
# Example: http://fitpulse-prod.us-east-1.elasticbeanstalk.com

# Update .env.local
vim .env.local
```

**Change:**
```bash
# OLD:
NEXT_PUBLIC_API_URL=http://localhost:5001/api

# NEW (use your actual EB URL):
NEXT_PUBLIC_API_URL=http://fitpulse-prod.eba-gbwbegcm.us-east-1.elasticbeanstalk.com/api
```

### Step 7.2: Restart Frontend Dev Server
```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
npm run dev

# Visit http://localhost:3000
# Test signup, login, and protected routes
```

### Step 7.3: Test Complete Flow
1. Open http://localhost:3000 in your browser
2. Go to Register page
3. Sign up with a new account
4. Should see success message
5. Login with those credentials
6. Should see dashboard
7. Navigate to different pages
8. Everything should work!

---

## Phase 8: Monitor Your Deployment (Ongoing)

### Check Logs
```bash
# Stream logs in real-time
eb logs --stream

# Exit with Ctrl+C
```

### Check Health Status
```bash
# See environment health
eb health

# Live monitoring
eb health --refresh
```

### View Environment Details
```bash
# Open AWS Console for this environment
eb open

# Get URL without opening browser
eb open --print-url
```

---

## Troubleshooting

### Issue: Deployment Failed
```bash
# Check detailed logs
eb logs --stream

# Common issues:
# 1. Package.json start script missing
# 2. Missing environment variables
# 3. Node.js version mismatch
# 4. Port not set to 5001
```

### Issue: Health Check Failing
```bash
# SSH into the instance
eb ssh

# Check if Node.js is running
ps aux | grep node

# Check logs in the instance
cd /var/log
tail -f nodejs/nodejs.log

# Exit SSH
exit
```

### Issue: API Returns 502/503
```bash
# Check environment status
eb status

# Redeploy
eb deploy

# Check logs
eb logs --stream
```

### Issue: MongoDB Connection Failing
```bash
# Verify MONGO_URI is set correctly
eb printenv | grep MONGO_URI

# Check MongoDB Atlas:
# 1. Go to https://cloud.mongodb.com
# 2. Check IP whitelist includes AWS region
# 3. Verify connection string is correct

# Update if needed
eb setenv MONGO_URI="new-connection-string"
```

---

## Success Checklist

✅ **Phase 1:** AWS CLI installed and configured  
✅ **Phase 2:** Production environment variables ready  
✅ **Phase 3:** Elastic Beanstalk initialized  
✅ **Phase 4:** AWS environment created and healthy  
✅ **Phase 5:** Code deployed successfully  
✅ **Phase 6:** All endpoints tested and working  
✅ **Phase 7:** Frontend pointing to AWS backend  
✅ **Phase 8:** Complete signup→login flow working  

---

## Quick Commands Reference

```bash
# Create environment (one-time)
eb create fitpulse-prod --instance-type t3.small

# Deploy code
eb deploy

# Check status
eb status

# View logs
eb logs --stream

# SSH into instance
eb ssh

# Set environment variable
eb setenv KEY=VALUE

# Get environment URL
eb open --print-url

# Delete environment (WARNING!)
eb terminate
```

---

## Next Steps

1. ✅ Complete Phases 1-7 above
2. **Optional:** Set up custom domain (see below)
3. **Optional:** Enable automatic deployments via GitHub Actions
4. **Recommended:** Set up monitoring and alerts

---

## Optional: Set Up Custom Domain

### With CloudFlare (Easiest - Free SSL)
```bash
# 1. Register domain on CloudFlare
# 2. Add DNS record:
#    Type: CNAME
#    Name: api
#    Value: fitpulse-prod.us-east-1.elasticbeanstalk.com
# 3. CloudFlare provides free SSL automatically

# 4. Update backend CORS:
EB_URL=$(eb open --print-url)
eb setenv CORS_ALLOWED_ORIGINS="https://your-frontend.com,https://api.your-domain.com"

# 5. Update frontend:
# NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
```

### With AWS Route 53 (More Complex)
1. Register domain in Route 53
2. Request SSL certificate in ACM
3. Create Application Load Balancer
4. Attach certificate to ALB
5. Create Route 53 alias record

---

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| t3.small EC2 | ~$10-15/month | Always running |
| Data Transfer | ~$1-5/month | Depends on traffic |
| Elastic Beanstalk | Free | No separate charge |
| Route 53 (optional) | ~$0.50/month | If using custom domain |
| **Total** | **~$11-20/month** | Very reasonable |

---

## Congratulations! 🎉

Your backend is now running on AWS Elastic Beanstalk!

- ✅ Automatic scaling (1-3 instances)
- ✅ Load balancing built-in
- ✅ MongoDB Atlas for database
- ✅ Rate limiting, RBAC, CORS hardening
- ✅ CloudWatch monitoring
- ✅ Automatic log rotation

**Your API is production-ready!**
