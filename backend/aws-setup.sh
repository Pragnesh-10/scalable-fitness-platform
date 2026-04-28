#!/bin/bash

# AWS Migration Setup Script for FitPulse Backend
# This script automates the initial setup for AWS deployment

set -e

echo "🚀 FitPulse AWS Migration Setup"
echo "================================"

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Install with: brew install awscli"
    exit 1
fi

if ! command -v eb &> /dev/null; then
    echo "❌ Elastic Beanstalk CLI not found. Install with: brew install aws-elasticbeanstalk"
    exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "not-configured")
if [ "$AWS_ACCOUNT_ID" == "not-configured" ]; then
    echo "❌ AWS credentials not configured. Run: aws configure"
    exit 1
fi

echo "✅ Prerequisites checked"
echo "   AWS Account: $AWS_ACCOUNT_ID"
echo ""

# Determine region
echo "Select AWS Region:"
echo "1) us-east-1 (N. Virginia) - Default"
echo "2) us-west-2 (Oregon)"
echo "3) eu-west-1 (Ireland)"
echo "4) ap-southeast-1 (Singapore)"
read -p "Enter choice (1-4): " REGION_CHOICE

case $REGION_CHOICE in
    1) AWS_REGION="us-east-1" ;;
    2) AWS_REGION="us-west-2" ;;
    3) AWS_REGION="eu-west-1" ;;
    4) AWS_REGION="ap-southeast-1" ;;
    *) AWS_REGION="us-east-1" ;;
esac

echo "✓ Selected region: $AWS_REGION"
echo ""

# Get environment name
read -p "Enter Elastic Beanstalk environment name (e.g., fitpulse-prod): " ENV_NAME
ENV_NAME=${ENV_NAME:-fitpulse-prod}

# Get instance type
echo "Select Instance Type:"
echo "1) t3.micro (free tier, low traffic)"
echo "2) t3.small (recommended for light traffic)"
echo "3) t3.medium (moderate traffic)"
read -p "Enter choice (1-3): " INSTANCE_CHOICE

case $INSTANCE_CHOICE in
    1) INSTANCE_TYPE="t3.micro" ;;
    2) INSTANCE_TYPE="t3.small" ;;
    3) INSTANCE_TYPE="t3.medium" ;;
    *) INSTANCE_TYPE="t3.small" ;;
esac

echo "✓ Selected instance type: $INSTANCE_TYPE"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")" || exit 1

# Create .ebignore
echo "✓ Creating .ebignore..."
cat > .ebignore << 'EOF'
node_modules/
.git
.gitignore
.env
.env.local
.DS_Store
*.log
.vscode
.idea
coverage/
dist/
build/
EOF

# Initialize Elastic Beanstalk
echo "✓ Initializing Elastic Beanstalk..."
eb init -p "Node.js 20 running on 64bit Amazon Linux 2" fitpulse-api \
    --region "$AWS_REGION" \
    --ignore-version-conflict || echo "⚠️  EB already initialized"

echo ""
echo "✓ Configuration complete!"
echo ""
echo "Next steps:"
echo "1. Review .ebextensions configuration"
echo "2. Set production environment variables:"
echo "   cp .env.production.example .env.production"
echo "   Edit .env.production with your values"
echo "3. Create and deploy environment:"
echo "   eb create $ENV_NAME --instance-type $INSTANCE_TYPE --envvars NODE_ENV=production,PORT=5001"
echo "4. Deploy updates:"
echo "   eb deploy"
echo ""
echo "Useful commands:"
echo "  eb status          - Check environment status"
echo "  eb logs            - View application logs"
echo "  eb open            - Open app in browser"
echo "  eb setenv KEY=VAL  - Set environment variable"
echo "  eb terminate       - Delete environment (WARNING!)"
echo ""
