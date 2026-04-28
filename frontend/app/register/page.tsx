'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', fitnessGoals: 'general_fitness' });
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="auth-card" style={{ animation: 'slideUp 0.5s ease', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem', fontSize: '1.5rem',
            boxShadow: '0 8px 30px rgba(108,99,255,0.5)'
          }}>⚡</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            Join <span className="gradient-text">FitPulse</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Start your fitness journey today
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)',
            borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem',
            color: '#FF6B6B', fontSize: '0.85rem'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div className="grid-2" style={{ gap: '0.875rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input id="reg-name" className="form-input" type="text" placeholder="Rahul Sharma"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">I am a</label>
              <select id="reg-role" className="form-select" value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="user">Fitness User</option>
                <option value="coach">Fitness Coach</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input id="reg-email" className="form-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input id="reg-password" className="form-input" type="password" placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Fitness Goal</label>
            <select id="reg-goal" className="form-select" value={form.fitnessGoals}
              onChange={e => setForm({ ...form, fitnessGoals: e.target.value })}>
              <option value="general_fitness">🏃 General Fitness</option>
              <option value="fat_loss">🔥 Fat Loss</option>
              <option value="muscle_gain">💪 Muscle Gain</option>
              <option value="endurance">🏅 Endurance</option>
              <option value="weight_maintenance">⚖️ Weight Maintenance</option>
            </select>
          </div>

          <button id="reg-submit" type="submit" className="btn btn-primary btn-lg"
            style={{ marginTop: '0.5rem', width: '100%' }} disabled={isLoading}>
            {isLoading ? '⏳ Creating account...' : '✨ Create Account'}
          </button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
