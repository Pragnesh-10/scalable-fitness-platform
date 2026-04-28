'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';

const GOAL_ICONS: Record<string, string> = {
  fat_loss: '🔥', muscle_gain: '💪', endurance: '🏅', general_fitness: '🏃', weight_maintenance: '⚖️'
};
const LEVEL_COLORS: Record<string, string> = { beginner: '#51CF66', intermediate: '#FFB347', advanced: '#FF6B6B' };

export default function PlansPage() {
  const [activePlan, setActivePlan] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ plan_type: 'general_fitness', difficulty: 'beginner', duration_weeks: '4' });
  const [selectedWeek, setSelectedWeek] = useState('week_1');

  useEffect(() => {
    api.get('/plans/active').then(r => setActivePlan(r.data.plan)).catch(() => {});
  }, []);

  const generatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const { data } = await api.post('/plans/generate', { ...form, duration_weeks: parseInt(form.duration_weeks) });
      setActivePlan(data.plan);
      setShowForm(false);
      setToast(`✨ Plan generated!`);
      setTimeout(() => setToast(''), 3000);
    } catch { setToast('Generation failed'); setTimeout(() => setToast(''), 3000); }
    finally { setGenerating(false); }
  };

  const weekSchedule = activePlan?.schedule?.[selectedWeek] || [];
  const weeks = activePlan ? Array.from({ length: activePlan.durationWeeks }, (_, i) => `week_${i + 1}`) : [];

  return (
    <div>
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.includes('failed') ? 'error' : 'success'}`}>
            {toast.includes('failed') ? '❌' : '✅'} {toast}
          </div>
        </div>
      )}

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">📋 Training Plans</h1>
          <p className="page-subtitle">Personalized plans based on your goals</p>
        </div>
        <button id="generate-plan-btn" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '⚡ Generate Plan'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', borderColor: 'rgba(108,99,255,0.3)', animation: 'slideUp 0.3s ease' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>🎯 Generate Your Plan</h3>
          <form onSubmit={generatePlan}>
            <div className="grid-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Fitness Goal</label>
                <select className="form-select" value={form.plan_type} onChange={e => setForm(f => ({ ...f, plan_type: e.target.value }))}>
                  <option value="fat_loss">🔥 Fat Loss</option>
                  <option value="muscle_gain">💪 Muscle Gain</option>
                  <option value="endurance">🏅 Endurance</option>
                  <option value="general_fitness">🏃 General Fitness</option>
                  <option value="weight_maintenance">⚖️ Weight Maintenance</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select className="form-select" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                  <option value="beginner">🟢 Beginner</option>
                  <option value="intermediate">🟡 Intermediate</option>
                  <option value="advanced">🔴 Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <select className="form-select" value={form.duration_weeks} onChange={e => setForm(f => ({ ...f, duration_weeks: e.target.value }))}>
                  <option value="4">4 Weeks</option>
                  <option value="8">8 Weeks</option>
                  <option value="12">12 Weeks</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={generating}>
              {generating ? '⏳ Generating...' : `Generate ${form.duration_weeks}-Week Plan →`}
            </button>
          </form>
        </div>
      )}

      {activePlan ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>
              {GOAL_ICONS[activePlan.planType]} {activePlan.planType?.replace(/_/g, ' ')} Plan
            </h2>
            <span className="badge badge-success">✅ Active</span>
            <span className="badge" style={{ background: `${LEVEL_COLORS[activePlan.difficulty]}20`, color: LEVEL_COLORS[activePlan.difficulty], border: `1px solid ${LEVEL_COLORS[activePlan.difficulty]}40` }}>
              {activePlan.difficulty}
            </span>
            <span className="badge badge-warning">📅 {activePlan.durationWeeks} Weeks</span>
          </div>

          {weeks.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
              {weeks.map(w => (
                <button key={w} className={`btn btn-sm ${selectedWeek === w ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setSelectedWeek(w)}>
                  Week {w.split('_')[1]}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {weekSchedule.map((day: any, i: number) => (
              <div key={i} className="card" style={{
                padding: '1rem 0.75rem', textAlign: 'center',
                background: day.type === 'Rest' ? 'rgba(15,16,32,0.5)' : 'rgba(108,99,255,0.1)',
                borderColor: day.type === 'Rest' ? 'var(--border-light)' : 'rgba(108,99,255,0.3)',
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {day.day?.slice(0, 3)}
                </div>
                <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>
                  {day.type === 'Rest' ? '😴' : day.type?.includes('Run') ? '🏃' : day.type?.includes('HIIT') ? '⚡' : day.type?.includes('Yoga') ? '🧘' : '💪'}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, lineHeight: 1.3 }}>{day.type}</div>
                {day.duration > 0 && <div style={{ fontSize: '0.62rem', color: 'var(--primary-light)', marginTop: '0.3rem' }}>{day.duration}min</div>}
              </div>
            ))}
          </div>

          {activePlan.recommendations?.length > 0 && (
            <div className="card" style={{ background: 'rgba(78,205,196,0.06)', borderColor: 'rgba(78,205,196,0.2)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.875rem', fontSize: '0.95rem' }}>💡 Coach Recommendations</h3>
              {activePlan.recommendations.map((r: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0', borderTop: i > 0 ? '1px solid var(--border-light)' : 'none', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent-2)' }}>→</span> {r}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : !showForm && (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <div className="empty-state-icon">📋</div>
          <h3>No active plan</h3>
          <p>Generate a personalized plan based on your goals</p>
          <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => setShowForm(true)}>
            ⚡ Generate My Plan
          </button>
        </div>
      )}
    </div>
  );
}
