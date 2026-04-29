# 🏋️ FitTrack - Scalable Fitness Application

A modern, full-stack fitness tracking application with real-time analytics, workout management, community features, and wearable device integration.



---

## 🚀 Quick Start

### Option 1: Automated Startup (Recommended)

**macOS/Linux:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Windows:**
```bash
start-dev.bat
```

### Option 2: Manual Startup

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Then open: **http://localhost:3000**

---

## 📋 What You'll Need

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git**

## 🗂️ Project Structure

```
fitness/
├── backend/          # Express.js API server
│   ├── controllers/  # API logic
│   ├── routes/       # API endpoints
│   ├── models/       # MongoDB schemas
│   ├── middleware/   # Auth & validation
│   └── server.js     # Main app
│
├── frontend/         # Next.js React app
│   ├── app/          # Pages and layouts
│   ├── components/   # UI components
│   ├── lib/          # API client & utilities
│   └── package.json
│
├── LOCAL_SETUP.md    # Detailed setup guide
├── start-dev.sh      # Startup script (macOS/Linux)
└── start-dev.bat     # Startup script (Windows)
```

---

## 🔧 Environment Setup

### Backend
Create `backend/.env`:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://<name>_db_user:c2ZgusbuQzJpbTaG@scalablefitnessplatform.cxzuciq.mongodb.net/fitpulse
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

### Frontend
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## 🌐 Access the App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api
- **Health Check:** http://localhost:5001/api/health

### Test Account
```
Email: copilot.test+20260429@example.com
Password: TestPass123!
```

---

## 📚 Technology Stack

### Backend
- **Framework:** Express.js v5.2
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT
- **Additional:** Mongoose, Bcryptjs, Express-validator

### Frontend
- **Framework:** Next.js 16.2.4
- **UI Library:** React 19.2
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Zustand
- **Charts:** Recharts
- **Icons:** Lucide React

---

## 🎯 Key Features

✅ **User Authentication** - Secure JWT-based auth  
✅ **Workout Tracking** - Create and log workouts  
✅ **Analytics Dashboard** - Real-time performance metrics  
✅ **Community Features** - Connect with other users  
✅ **Coach System** - Personal training support  
✅ **Wearable Integration** - Apple Watch, Fitbit sync  
✅ **Responsive Design** - Works on mobile & desktop  

---

## 🚀 Development Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** - Frontend hot-reloads automatically

3. **Commit & push:**
   ```bash
   git add .
   git commit -m "Add feature: description"
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request** on GitHub

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5001
lsof -i :5001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Cannot Connect to MongoDB
- Verify `MONGO_URI` in `.env` is correct
- Check internet connection
- Ensure MongoDB Atlas IP whitelist includes your IP

### Frontend Won't Load
- Clear browser cache (Cmd+Shift+Delete)
- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5001/api`
- Check browser console for errors



## 📝 License

This project is licensed under the ISC License.


