-- FitPulse Database Schema
-- Run: psql -U postgres -d fitnessdb -f schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  avatar_url TEXT,
  age INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  fitness_goal VARCHAR(50) DEFAULT 'general_fitness',
  experience_level VARCHAR(20) DEFAULT 'beginner',
  google_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workouts
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(100),
  duration INTEGER NOT NULL,
  calories_burned INTEGER,
  notes TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Exercises (within a workout)
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  reps INTEGER,
  sets INTEGER,
  weight DECIMAL(6,2),
  duration_seconds INTEGER,
  distance_km DECIMAL(6,2),
  order_index INTEGER DEFAULT 0
);

-- Metrics (from wearables / manual input)
CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  heart_rate INTEGER,
  steps INTEGER,
  sleep_hours DECIMAL(4,2),
  calories_intake INTEGER,
  calories_burned INTEGER,
  water_ml INTEGER,
  source VARCHAR(50) DEFAULT 'manual',
  recorded_at TIMESTAMP DEFAULT NOW(),
  date DATE DEFAULT CURRENT_DATE
);

-- Plans
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  duration_weeks INTEGER NOT NULL,
  schedule JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Groups (community)
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES users(id),
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Group Members
CREATE TABLE IF NOT EXISTS group_members (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(150) NOT NULL,
  description TEXT,
  goal_type VARCHAR(50) NOT NULL,
  goal_value INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Challenge Participants
CREATE TABLE IF NOT EXISTS challenge_participants (
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (challenge_id, user_id)
);

-- Group Posts
CREATE TABLE IF NOT EXISTS group_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, date);
CREATE INDEX IF NOT EXISTS idx_metrics_user_date ON metrics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_exercises_workout ON exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);

-- Trigger: update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
