'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/store';
import api from '../../lib/api';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

const WORKOUT_COLORS: Record<string, string> = {
  cardio: '#FF6B6B', strength: '#6C63FF', hiit: '#FFE66D',
  yoga: '#4ECDC4', running: '#51CF66', cycling: '#FFB347', other: '#A0A8C8',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-700)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.8rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user, loadFromStorage } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
    const fetchAll = async () => {
      try {
        const [statsRes, analyticsRes, workoutsRes, planRes] = await Promise.all([
          api.get('/user/stats'),
          api.get('/analytics/weekly'),
          api.get('/workouts?limit=5'),
          api.get('/plans/active'),
        ]);
        setStats(statsRes.data);
        setAnalytics(analyticsRes.data);
        setRecentWorkouts(workoutsRes.data.workouts || []);
        setActivePlan(planRes.data.plan);
      } catch (e) {
        // Stub data for demo
        setStats({ totalWorkouts: 28, totalCalories: 14230, totalMinutes: 1260, avgHeartRate: 142, totalSteps: 87400, avgSleep: 7.2, streak: 12 });
        setAnalytics({
          weeklyCalories: [
            { _id: 'Mon', calories: 420 }, { _id: 'Tue', calories: 0 }, { _id: 'Wed', calories: 510 },
            { _id: 'Thu', calories: 380 }, { _id: 'Fri', calories: 590 }, { _id: 'Sat', calories: 720 }, { _id: 'Sun', calories: 0 },
          ],
          dailyMetrics: [
            { date: 'Mon', steps: 8200, heartRate: 138 }, { date: 'Tue', steps: 6100, heartRate: 72 },
            { date: 'Wed', steps: 9400, heartRate: 145 }, { date: 'Thu', steps: 7800, heartRate: 135 },
            { date: 'Fri', steps: 10200, heartRate: 152 }, { date: 'Sat', steps: 12400, heartRate: 160 }, { date: 'Sun', steps: 5200, heartRate: 68 },
          ],
        });
        setRecentWorkouts([
          { _id: '1', type: 'strength', title: 'Chest & Triceps', duration: 55, caloriesBurned: 380, date: new Date().toISOString() },
          { _id: '2', type: 'cardio', title: 'Morning Run', duration: 40, caloriesBurned: 420, date: new Date(Date.now() - 86400000).toISOString() },
          { _id: '3', type: 'hiit', title: 'HIIT Blast', duration: 30, caloriesBurned: 510, date: new Date(Date.now() - 2 * 86400000).toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { icon: '🏋️', label: 'Total Workouts', value: stats?.totalWorkouts || 0, unit: 'sessions', color: '#6C63FF', change: '+4 this week' },
    { icon: '🔥', label: 'Calories Burned', value: (stats?.totalCalories || 0).toLocaleString(), unit: 'kcal', color: '#FF6B6B', change: '+12% vs last month' },
    { icon: '⏱️', label: 'Active Minutes', value: stats?.totalMinutes || 0, unit: 'min', color: '#4ECDC4', change: `~${Math.round((stats?.totalMinutes || 0) / 60)}h total` },
    { icon: '👣', label: 'Total Steps', value: (stats?.totalSteps || 0).toLocaleString(), unit: 'steps', color: '#51CF66', change: '30-day count' },
    { icon: '❤️', label: 'Avg Heart Rate', value: stats?.avgHeartRate || '--', unit: 'bpm', color: '#FF6B6B', change: 'Active rate' },
    { icon: '😴', label: 'Avg Sleep', value: stats?.avgSleep || '--', unit: 'hrs', color: '#FFB347', change: 'Last 30 days' },
    { icon: '🏅', label: 'Active Streak', value: stats?.streak || 0, unit: 'days', color: '#FFE66D', change: 'Keep going!' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0] || 'Athlete'} 👋</span>
          </h1>
          <p className="page-subtitle">Here's your fitness overview for the past 30 days</p>
        </div>
        <Link href="/workouts" className="btn btn-primary animate-pulse-glow">
          + Log Workout
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        {statCards.slice(0, 4).map((card, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-icon" style={{ background: `${card.color}20` }}>
              <span style={{ fontSize: '1.4rem' }}>{card.icon}</span>
            </div>
            <div className="stat-value" style={{ color: card.color }}>{card.value}</div>
            <div className="stat-label">{card.label}</div>
            <div className="stat-change up" style={{ color: card.color, opacity: 0.8, fontSize: '0.72rem', marginTop: '0.35rem' }}>
              {card.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Weekly Calories Chart */}
        <div className="chart-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="chart-title" style={{ margin: 0 }}>🔥 Weekly Calories Burned</h3>
            <span className="badge badge-primary">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analytics?.weeklyCalories || []}>
              <defs>
                <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="_id" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="calories" stroke="#FF6B6B" strokeWidth={2} fill="url(#calGrad)" name="Calories" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Steps */}
        <div className="chart-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 className="chart-title" style={{ margin: 0 }}>👣 Daily Steps</h3>
            <span className="badge badge-success">7 Days</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics?.dailyMetrics || []}>
              <defs>
                <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#51CF66" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#51CF66" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="steps" fill="url(#stepsGrad)" radius={[6, 6, 0, 0]} name="Steps" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Workouts + Active Plan */}
      <div className="grid-2">
        {/* Recent Workouts */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>🏋️ Recent Workouts</h3>
            <Link href="/workouts" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
              View all →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentWorkouts.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="empty-state-icon">🏋️</div>
                <h3>No workouts yet</h3>
                <p style={{ fontSize: '0.8rem' }}>Log your first workout to get started</p>
              </div>
            ) : recentWorkouts.map((w) => (
              <div key={w._id} className="workout-item">
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${WORKOUT_COLORS[w.type] || '#6C63FF'}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                }}>
                  {w.type === 'cardio' ? '🏃' : w.type === 'strength' ? '💪' : w.type === 'hiit' ? '⚡' : w.type === 'yoga' ? '🧘' : '🏋️'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{w.title || w.type}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {w.duration} min · {w.caloriesBurned || 0} kcal · {new Date(w.date).toLocaleDateString()}
                  </div>
                </div>
                <span className={`badge badge-primary`} style={{ background: `${WORKOUT_COLORS[w.type] || '#6C63FF'}20`, color: WORKOUT_COLORS[w.type] || '#6C63FF', borderColor: `${WORKOUT_COLORS[w.type] || '#6C63FF'}40` }}>
                  {w.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Plan + Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Active Plan */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(78,205,196,0.08))', borderColor: 'rgba(108,99,255,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>📋 Active Plan</h3>
              <Link href="/plans" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>Manage →</Link>
            </div>
            {activePlan ? (
              <div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span className="badge badge-primary">🎯 {activePlan.planType?.replace(/_/g, ' ')}</span>
                  <span className="badge badge-accent">⚡ {activePlan.difficulty}</span>
                  <span className="badge badge-warning">📅 {activePlan.durationWeeks}W</span>
                </div>
                {activePlan.recommendations?.slice(0, 2).map((r: string, i: number) => (
                  <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.5rem 0', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.5rem' }}>
                    <span>💡</span><span>{r}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>No active plan yet</p>
                <Link href="/plans" className="btn btn-primary btn-sm">Generate Plan</Link>
              </div>
            )}
          </div>

          {/* Extra Stats */}
          <div className="grid-2" style={{ gap: '0.875rem' }}>
            {statCards.slice(4).map((card, i) => (
              <div key={i} className="stat-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{card.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.2rem' }}>{card.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
