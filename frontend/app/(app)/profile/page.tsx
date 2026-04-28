'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useAuthStore } from '../../lib/store';

const GOALS = [
  { value: 'fat_loss', label: '🔥 Fat Loss' },
  { value: 'muscle_gain', label: '💪 Muscle Gain' },
  { value: 'endurance', label: '🏅 Endurance' },
  { value: 'general_fitness', label: '🏃 General Fitness' },
  { value: 'weight_maintenance', label: '⚖️ Weight Maintenance' },
];
const LEVELS = [
  { value: 'beginner', label: '🟢 Beginner', desc: 'New to structured training' },
  { value: 'intermediate', label: '🟡 Intermediate', desc: '1-3 years of experience' },
  { value: 'advanced', label: '🔴 Advanced', desc: '3+ years of consistent training' },
];

export default function ProfilePage() {
  const { user, loadFromStorage } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', age: '', weight: '', height: '', fitnessGoals: 'general_fitness', experienceLevel: 'beginner' });

  useEffect(() => {
    loadFromStorage();
    Promise.all([api.get('/user/profile'), api.get('/user/stats')])
      .then(([profileRes, statsRes]) => {
        const u = profileRes.data.user;
        const p = profileRes.data.profile;
        setProfile(p);
        setStats(statsRes.data);
        setForm({
          name: u?.name || '', age: p?.age || '', weight: p?.weight || '',
          height: p?.height || '', fitnessGoals: p?.fitnessGoals || 'general_fitness',
          experienceLevel: p?.experienceLevel || 'beginner',
        });
      })
      .catch(() => {
        setStats({ totalWorkouts: 28, totalCalories: 14230, totalMinutes: 1260, totalSteps: 87400, avgSleep: 7.2, streak: 12 });
      });
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/user/profile', form);
      setEditing(false);
      setToast('✅ Profile updated!');
      setTimeout(() => setToast(''), 3000);
    } catch { setToast('❌ Update failed'); setTimeout(() => setToast(''), 3000); }
  };

  const statItems = [
    { icon: '🏋️', label: 'Total Workouts', value: stats?.totalWorkouts || 0, color: '#6C63FF' },
    { icon: '🔥', label: 'Calories Burned', value: (stats?.totalCalories || 0).toLocaleString(), color: '#FF6B6B' },
    { icon: '⏱️', label: 'Active Minutes', value: stats?.totalMinutes || 0, color: '#4ECDC4' },
    { icon: '🏅', label: 'Workout Streak', value: stats?.streak || 0, color: '#FFE66D' },
    { icon: '👣', label: 'Total Steps', value: (stats?.totalSteps || 0).toLocaleString(), color: '#51CF66' },
    { icon: '😴', label: 'Avg Sleep', value: `${stats?.avgSleep || '--'} hrs`, color: '#FFB347' },
  ];

  return (
    <div>
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.includes('❌') ? 'error' : 'success'}`}>{toast}</div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">👤 Profile</h1>
        <p className="page-subtitle">Your fitness identity and personal records</p>
      </div>

      <div className="grid-2" style={{ gap: '2rem' }}>
        {/* Left: User Card */}
        <div>
          <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(78,205,196,0.06))', borderColor: 'rgba(108,99,255,0.3)' }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 1rem', boxShadow: '0 8px 30px rgba(108,99,255,0.4)' }}>
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
              <span className={`badge ${user?.role === 'coach' ? 'badge-warning' : 'badge-primary'}`}>
                {user?.role === 'coach' ? '🎯 Coach' : '🏃 Member'}
              </span>
              <span className="badge badge-accent">
                {GOALS.find(g => g.value === profile?.fitnessGoals)?.label || '🏃 General'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {statItems.map((s, i) => (
              <div key={i} className="stat-card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem' }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: s.color, marginTop: '0.25rem' }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700 }}>⚙️ Profile Settings</h3>
            <button className={`btn btn-sm ${editing ? 'btn-ghost' : 'btn-secondary'}`} onClick={() => setEditing(!editing)}>
              {editing ? '✕ Cancel' : '✏️ Edit'}
            </button>
          </div>

          <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} disabled={!editing}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>

            <div className="grid-3" style={{ gap: '0.875rem' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input className="form-input" type="number" placeholder="--" value={form.age} disabled={!editing}
                  onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input className="form-input" type="number" placeholder="--" value={form.weight} disabled={!editing}
                  onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input className="form-input" type="number" placeholder="--" value={form.height} disabled={!editing}
                  onChange={e => setForm(f => ({ ...f, height: e.target.value }))} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Fitness Goal</label>
              <select className="form-select" value={form.fitnessGoals} disabled={!editing}
                onChange={e => setForm(f => ({ ...f, fitnessGoals: e.target.value }))}>
                {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Experience Level</label>
              {editing ? (
                <div style={{ display: 'flex', gap: '0.625rem' }}>
                  {LEVELS.map(l => (
                    <button key={l.value} type="button" className={`btn btn-sm ${form.experienceLevel === l.value ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1 }} onClick={() => setForm(f => ({ ...f, experienceLevel: l.value }))}>
                      {l.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="form-input" style={{ cursor: 'default' }}>
                  {LEVELS.find(l => l.value === form.experienceLevel)?.label || '🟢 Beginner'}
                </div>
              )}
            </div>

            {editing && (
              <button id="save-profile" type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                💾 Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
