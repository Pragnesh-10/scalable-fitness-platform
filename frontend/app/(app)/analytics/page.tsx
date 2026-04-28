'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#6C63FF', '#FF6B6B', '#4ECDC4', '#FFE66D', '#51CF66', '#FFB347', '#60a5fa'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-700)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.8rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

const STUB_WEEKLY = {
  weeklyCalories: [
    { _id: 'Mon', calories: 420 }, { _id: 'Tue', calories: 0 }, { _id: 'Wed', calories: 510 },
    { _id: 'Thu', calories: 380 }, { _id: 'Fri', calories: 590 }, { _id: 'Sat', calories: 720 }, { _id: 'Sun', calories: 180 },
  ],
  dailyMetrics: [
    { date: 'Mon', steps: 8200, heartRate: 138 }, { date: 'Tue', steps: 6100, heartRate: 72 },
    { date: 'Wed', steps: 9400, heartRate: 145 }, { date: 'Thu', steps: 7800, heartRate: 135 },
    { date: 'Fri', steps: 10200, heartRate: 152 }, { date: 'Sat', steps: 12400, heartRate: 160 }, { date: 'Sun', steps: 5200, heartRate: 68 },
  ],
  weeklyWorkouts: [
    { _id: 'Mon', count: 1, totalDuration: 55 }, { _id: 'Wed', count: 1, totalDuration: 40 },
    { _id: 'Fri', count: 2, totalDuration: 80 }, { _id: 'Sat', count: 1, totalDuration: 60 },
  ],
};

const STUB_MONTHLY = {
  progressByType: [
    { _id: 'strength', count: 12, avgDuration: 55, totalCalories: 4560 },
    { _id: 'cardio', count: 8, avgDuration: 40, totalCalories: 3360 },
    { _id: 'hiit', count: 5, avgDuration: 30, totalCalories: 2550 },
    { _id: 'yoga', count: 3, avgDuration: 45, totalCalories: 450 },
  ],
  monthlyWorkouts: [
    { _id: 1, count: 6, totalMinutes: 280 }, { _id: 2, count: 8, totalMinutes: 380 },
    { _id: 3, count: 7, totalMinutes: 340 }, { _id: 4, count: 7, totalMinutes: 260 },
  ],
};

export default function AnalyticsPage() {
  const [tab, setTab] = useState<'weekly' | 'monthly'>('weekly');
  const [weekly, setWeekly] = useState<any>(STUB_WEEKLY);
  const [monthly, setMonthly] = useState<any>(STUB_MONTHLY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [w, m] = await Promise.all([api.get('/analytics/weekly'), api.get('/analytics/monthly')]);
        if (w.data.weeklyCalories?.length) setWeekly(w.data);
        if (m.data.progressByType?.length) setMonthly(m.data);
      } catch { /* use stubs */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const radarData = monthly.progressByType?.map((t: any) => ({
    subject: t._id.charAt(0).toUpperCase() + t._id.slice(1),
    count: t.count, calories: Math.round(t.totalCalories / 100),
  }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📊 Performance Analytics</h1>
        <p className="page-subtitle">Deep insights into your fitness journey</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav" style={{ marginBottom: '2rem', maxWidth: 300 }}>
        <button id="tab-weekly" className={`tab-btn ${tab === 'weekly' ? 'active' : ''}`} onClick={() => setTab('weekly')}>
          📅 Weekly
        </button>
        <button id="tab-monthly" className={`tab-btn ${tab === 'monthly' ? 'active' : ''}`} onClick={() => setTab('monthly')}>
          📈 Monthly
        </button>
      </div>

      {tab === 'weekly' && (
        <>
          {/* Weekly Charts */}
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="chart-container">
              <h3 className="chart-title">🔥 Daily Calorie Burn</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={weekly.weeklyCalories}>
                  <defs>
                    <linearGradient id="wCal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="_id" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="calories" stroke="#FF6B6B" strokeWidth={2.5} fill="url(#wCal)" name="Calories" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3 className="chart-title">❤️ Heart Rate vs Steps</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weekly.dailyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="hr" tick={{ fill: '#FF6B6B', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="steps" orientation="right" tick={{ fill: '#51CF66', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                  <Line yAxisId="hr" type="monotone" dataKey="heartRate" stroke="#FF6B6B" strokeWidth={2.5} dot={{ fill: '#FF6B6B', r: 4 }} name="Heart Rate" />
                  <Line yAxisId="steps" type="monotone" dataKey="steps" stroke="#51CF66" strokeWidth={2.5} dot={{ fill: '#51CF66', r: 4 }} name="Steps" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Workout Duration */}
          <div className="chart-container">
            <h3 className="chart-title">⏱️ Workout Duration This Week</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekly.weeklyWorkouts}>
                <defs>
                  <linearGradient id="durGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="_id" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalDuration" fill="url(#durGrad)" radius={[8, 8, 0, 0]} name="Minutes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {tab === 'monthly' && (
        <>
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            {/* Workout Type Distribution — Pie */}
            <div className="chart-container">
              <h3 className="chart-title">🏆 Workout Type Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={monthly.progressByType} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label={({ _id, percent }: any) => `${_id} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}>
                    {monthly.progressByType?.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any, name: string) => [val, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Radar */}
            <div className="chart-container">
              <h3 className="chart-title">⚡ Performance Radar</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <Radar name="Workouts" dataKey="count" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.25} />
                  <Radar name="Calories(×100)" dataKey="calories" stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="chart-container">
            <h3 className="chart-title">📈 Weekly Progress (Last 4 Weeks)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthly.monthlyWorkouts?.map((w: any, i: number) => ({ ...w, label: `Week ${i + 1}` }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Bar dataKey="count" fill="#6C63FF" radius={[6, 6, 0, 0]} name="Workouts" />
                <Bar dataKey="totalMinutes" fill="#4ECDC4" radius={[6, 6, 0, 0]} name="Minutes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Type Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            {monthly.progressByType?.map((t: any, i: number) => (
              <div key={i} className="stat-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                  {t._id === 'strength' ? '💪' : t._id === 'cardio' ? '🏃' : t._id === 'hiit' ? '⚡' : t._id === 'yoga' ? '🧘' : '🏋️'}
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.4rem', color: COLORS[i] }}>{t.count}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t._id} Sessions</div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {Math.round(t.avgDuration)} min avg · {t.totalCalories} kcal
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
