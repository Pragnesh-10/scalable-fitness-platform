# 🚀 FitPulse - Local Development Setup Guide

This guide will help you set up and run the FitPulse application locally after forking the repository.

## 📋 Prerequisites

Before starting, ensure you have these installed on your machine:

- **Node.js** (v18 or higher): [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **Git**: [Download](https://git-scm.com/)
- **MongoDB** (optional for local development, we use MongoDB Atlas cloud): [Guide below](#mongodb-setup)
- **Redis** (optional, for caching): [Download](https://redis.io/download)

**Verify installations:**
```bash
node --version
npm --version
git --version
```

---

## 📦 Step 1: Clone the Repository

```bash
# Clone your forked repository
git clone https://github.com/YOUR_USERNAME/fitness.git
cd fitness
```

**Or if you cloned the original:**
```bash
git clone https://github.com/original-owner/fitness.git
cd fitness
```

---

## 🔧 Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd backend
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
# Copy the example (if it exists)
cp .env.production.example .env

# Or create manually - edit the .env file with these values:
```

**Add these environment variables to `.env`:**

```
PORT=5001
NODE_ENV=development

# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://yedrunagapragnesh_db_user:c2ZgusbuQzJpbTaG@scalablefitnessplatform.cxzuciq.mongodb.net/fitpulse

# JWT Security
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Redis (optional - leave as is for now)
REDIS_URL=redis://localhost:6379

# Google OAuth (optional - only if you want social login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Fitbit Integration (optional - only if you want wearable sync)
FITBIT_CLIENT_ID=your_fitbit_client_id
FITBIT_CLIENT_SECRET=your_fitbit_client_secret
```

**⚠️ Important Notes:**
- The `MONGO_URI` above is a **shared demo database** for development
- For production, create your own MongoDB Atlas cluster
- Keep `.env` **private** - never commit it to git
- `.gitignore` should already exclude `.env`

### 2.4 Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

**Expected output:**
```
Server running on port 5001
MongoDB connected to fitpulse database
```

✅ Backend is now running at: `http://localhost:5001`

---

## 🎨 Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory
Open a **NEW terminal** and:

```bash
cd fitness/frontend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Configure Environment Variables

Create a `.env.local` file in the `frontend` folder:

```bash
# Create .env.local file with:
```

**Add this environment variable:**

```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

**Explanation:**
- `NEXT_PUBLIC_API_URL` tells the frontend where the backend API is located
- During development, it points to `localhost:5001`
- This variable is public (exposed to browser), so prefix is `NEXT_PUBLIC_`

### 3.4 Start Frontend Server

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 16.2.4 (Turbopack)
- Local:         http://localhost:3000
- Environments: .env.local
✓ Ready in 246ms
```

✅ Frontend is now running at: `http://localhost:3000`

---

## 🌐 Step 4: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the FitPulse login page.

### Test Login

**Demo Account:**
- Email: `copilot.test+20260429@example.com`
- Password: `TestPass123!`

Or create a new account via the **Register** page.

---

## 🗄️ MongoDB Setup (Optional - For Local Database)

If you want to use a **local MongoDB** instead of MongoDB Atlas cloud:

### Option A: Using MongoDB Atlas (Recommended - Already Set Up)

The `.env` file already points to a shared MongoDB Atlas cluster. No additional setup needed.

### Option B: Using Local MongoDB

1. **Install MongoDB:**
   - [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
   - [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Update `.env`:**
   ```
   MONGO_URI=mongodb://localhost:27017/fitpulse
   ```

3. **Start MongoDB:**
   ```bash
   # macOS (if installed with Homebrew)
   brew services start mongodb-community

   # Linux/Windows - follow MongoDB documentation
   ```

---

## ⚙️ Redis Setup (Optional - For Caching)

Redis is optional and not required for basic functionality.

```bash
# Install Redis
# macOS
brew install redis

# Start Redis
redis-server

# Update .env
REDIS_URL=redis://localhost:6379
```

---

## 🧪 Testing the Connection

### Test Backend API

```bash
curl http://localhost:5001/api/health

# Expected response: { "status": "ok" }
```

### Test Frontend Connection

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try logging in - check Network tab for API calls
4. Backend should return JWT token ✅

---

## 📂 Project Structure

```
fitness/
├── backend/
│   ├── .env (create this)
│   ├── server.js (main app)
│   ├── config/ (database config)
│   ├── controllers/ (API logic)
│   ├── routes/ (API endpoints)
│   ├── middleware/ (auth, validation)
│   ├── models/ (database schemas)
│   └── package.json
│
├── frontend/
│   ├── .env.local (create this)
│   ├── app/ (pages and layouts)
│   ├── components/ (UI components)
│   ├── lib/ (utilities, API client)
│   ├── public/ (static assets)
│   ├── package.json
│   └── next.config.ts
│
└── README.md
```

---

## 🚀 Running Both Services Together

**Terminal 1 (Backend):**
```bash
cd fitness/backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd fitness/frontend
npm run dev
```

Both services will run concurrently and communicate via the API URL.

---

## 🔗 API Documentation

### Key API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | User login |
| GET | `/api/user/profile` | Get user profile |
| POST | `/api/workouts` | Create workout |
| GET | `/api/workouts` | Get all workouts |
| POST | `/api/analytics` | Log analytics |

**Backend API Root:** `http://localhost:5001/api`

---

## 🛠️ Troubleshooting

### Issue: Port Already in Use

```bash
# Kill process on port 5001 (backend)
lsof -i :5001
kill -9 <PID>

# Kill process on port 3000 (frontend)
lsof -i :3000
kill -9 <PID>
```

### Issue: Cannot Connect to MongoDB

- Check `.env` has correct `MONGO_URI`
- If using MongoDB Atlas, whitelist your IP in cluster settings
- Test connection: `mongoose` should log "MongoDB connected"

### Issue: Frontend Shows "Cannot connect to server"

- Ensure backend is running on port 5001
- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5001/api`
- Check browser console for CORS errors
- Clear browser cache and reload

### Issue: Node modules errors

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🔐 Security Notes

⚠️ **Never commit `.env` files to git!**

- `.env` contains sensitive credentials
- `.gitignore` should exclude `.env`
- For each developer, create their own `.env` locally
- Share `.env.example` instead with placeholder values

---

## 📝 Development Workflow

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Install new dependencies:**
   ```bash
   npm install
   ```

3. **Start both services:**
   ```bash
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2
   cd frontend && npm run dev
   ```

4. **Make changes** to code - hot reload will work automatically

5. **Commit changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin your-branch-name
   ```

---

## 📞 Support

If you encounter issues:

1. Check terminal logs for error messages
2. Verify all environment variables are set
3. Ensure ports 3000 and 5001 are not in use
4. Check MongoDB connection
5. Create an issue in the GitHub repository

---

## ✅ Verification Checklist

- [ ] Node.js v18+ installed
- [ ] Repository cloned locally
- [ ] Backend `.env` file created
- [ ] Frontend `.env.local` file created
- [ ] `npm install` run in both directories
- [ ] Backend running on `http://localhost:5001`
- [ ] Frontend running on `http://localhost:3000`
- [ ] Can login with test account
- [ ] Dashboard loads successfully

---

**You're all set! 🎉 Happy coding!**

For more info, check the backend and frontend README files.
