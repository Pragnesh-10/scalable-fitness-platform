'use client';
import { useState, useEffect } from 'react';
import api from '../../lib/api';

const WORKOUT_TYPES = ['cardio', 'strength', 'hiit', 'yoga', 'running', 'cycling', 'swimming', 'other'];
const TYPE_ICONS: Record<string, string> = {
  cardio: '🏃', strength: '💪', hiit: '⚡', yoga: '🧘', running: '👟', cycling: '🚴', swimming: '🏊', other: '🏋️'
};
const TYPE_COLORS: Record<string, string> = {
  cardio: '#FF6B6B', strength: '#6C63FF', hiit: '#FFE66D', yoga: '#4ECDC4', running: '#51CF66', cycling: '#FFB347', swimming: '#60a5fa', other: '#A0A8C8'
};

interface Workout {
  _id: string; type: string; title: string; duration: number;
  caloriesBurned: number; notes: string; date: string; exercises: any[];
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({
    type: 'strength', title: '', duration: '', caloriesBurned: '', notes: '', date: new Date().toISOString().split('T')[0],
    exercises: [{ name: '', sets: '', reps: '', weight: '' }],
  });

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 20 };
      if (filter) params.type = filter;
      const { data } = await api.get('/workouts', { params });
      setWorkouts(data.workouts || []);
      setTotal(data.total || 0);
    } catch {
      // stub
      setWorkouts([
        { _id: '1', type: 'strength', title: 'Chest & Triceps', duration: 55, caloriesBurned: 380, notes: '', date: new Date().toISOString(), exercises: [] },
        { _id: '2', type: 'cardio', title: 'Morning Run', duration: 40, caloriesBurned: 420, notes: 'Park run', date: new Date(Date.now() - 86400000).toISOString(), exercises: [] },
        { _id: '3', type: 'hiit', title: 'HIIT Blast', duration: 30, caloriesBurned: 510, notes: '', date: new Date(Date.now() - 2 * 86400000).toISOString(), exercises: [] },
        { _id: '4', type: 'yoga', title: 'Flow Yoga', duration: 45, caloriesBurned: 150, notes: 'Morning session', date: new Date(Date.now() - 3 * 86400000).toISOString(), exercises: [] },
      ]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchWorkouts(); }, [filter]);

  const addExercise = () => setForm(f => ({ ...f, exercises: [...f.exercises, { name: '', sets: '', reps: '', weight: '' }] }));
  const removeExercise = (i: number) => setForm(f => ({ ...f, exercises: f.exercises.filter((_, idx) => idx !== i) }));
  const updateExercise = (i: number, field: string, val: string) =>
    setForm(f => ({ ...f, exercises: f.exercises.map((ex, idx) => idx === i ? { ...ex, [field]: val } : ex) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/workouts', { ...form, duration: parseInt(form.duration), caloriesBurned: parseInt(form.caloriesBurned) || 0 });
      setShowModal(false);
      setToast('Workout logged! 🎉');
      setTimeout(() => setToast(''), 3000);
      fetchWorkouts();
      setForm({ type: 'strength', title: '', duration: '', caloriesBurned: '', notes: '', date: new Date().toISOString().split('T')[0], exercises: [{ name: '', sets: '', reps: '', weight: '' }] });
    } catch { setToast('Failed to save'); setTimeout(() => setToast(''), 3000); }
    finally { setSaving(false); }
  };

  const deleteWorkout = async (id: string) => {
    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts(w => w.filter(x => x._id !== id));
      setToast('Workout deleted');
      setTimeout(() => setToast(''), 2500);
    } catch { setToast('Delete failed'); setTimeout(() => setToast(''), 2500); }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.includes('failed') || toast.includes('Failed') ? 'error' : 'success'}`}>
            <span>{toast.includes('failed') ? '❌' : '✅'}</span>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">🏋️ Workout Log</h1>
          <p className="page-subtitle">{total} total workouts · Track every session</p>
        </div>
        <button id="open-log-workout" className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Log Workout
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button className={`btn btn-sm ${!filter ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('')}>All</button>
        {WORKOUT_TYPES.map(t => (
          <button key={t} className={`btn btn-sm ${filter === t ? 'btn-secondary' : 'btn-ghost'}`}
            style={filter === t ? { borderColor: TYPE_COLORS[t], color: TYPE_COLORS[t] } : {}}
            onClick={() => setFilter(filter === t ? '' : t)}>
            {TYPE_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Workout Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading workouts...</div>
      ) : workouts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏋️</div>
          <h3>No workouts found</h3>
          <p>Log your first workout to get started!</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowModal(true)}>Log Workout</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {workouts.map(w => (
            <div key={w._id} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                background: `${TYPE_COLORS[w.type] || '#6C63FF'}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
              }}>{TYPE_ICONS[w.type] || '🏋️'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{w.title || `${w.type} session`}</span>
                  <span className="badge" style={{ background: `${TYPE_COLORS[w.type]}20`, color: TYPE_COLORS[w.type], borderColor: `${TYPE_COLORS[w.type]}40`, border: '1px solid' }}>
                    {w.type}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>⏱️</span> {w.duration} min
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>🔥</span> {w.caloriesBurned} kcal
                  </span>
                  {w.exercises?.length > 0 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>📋</span> {w.exercises.length} exercises
                    </span>
                  )}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>📅</span> {new Date(w.date).toLocaleDateString()}
                  </span>
                </div>
                {w.notes && <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>💬 {w.notes}</p>}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ color: '#FF6B6B', borderColor: 'rgba(255,107,107,0.2)' }}
                onClick={() => deleteWorkout(w._id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {/* Log Workout Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>🏋️ Log Workout</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)} style={{ fontSize: '1rem' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Workout Type Selector */}
              <div>
                <label className="form-label">Workout Type</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {WORKOUT_TYPES.map(t => (
                    <button key={t} type="button"
                      className={`btn btn-sm ${form.type === t ? '' : 'btn-ghost'}`}
                      style={form.type === t ? { background: `${TYPE_COLORS[t]}30`, color: TYPE_COLORS[t], border: `1px solid ${TYPE_COLORS[t]}60` } : {}}
                      onClick={() => setForm(f => ({ ...f, type: t }))}>
                      {TYPE_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Session Title</label>
                  <input className="form-input" placeholder="e.g. Chest & Back" value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Duration (minutes) *</label>
                  <input className="form-input" type="number" placeholder="45" required value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Calories Burned</label>
                  <input className="form-input" type="number" placeholder="350" value={form.caloriesBurned}
                    onChange={e => setForm(f => ({ ...f, caloriesBurned: e.target.value }))} />
                </div>
              </div>

              {/* Exercises */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label">Exercises</label>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={addExercise}>+ Add Exercise</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {form.exercises.map((ex, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                      <input className="form-input" placeholder="Exercise name" value={ex.name}
                        onChange={e => updateExercise(i, 'name', e.target.value)} style={{ fontSize: '0.82rem', padding: '0.6rem' }} />
                      <input className="form-input" placeholder="Sets" type="number" value={ex.sets}
                        onChange={e => updateExercise(i, 'sets', e.target.value)} style={{ fontSize: '0.82rem', padding: '0.6rem' }} />
                      <input className="form-input" placeholder="Reps" value={ex.reps}
                        onChange={e => updateExercise(i, 'reps', e.target.value)} style={{ fontSize: '0.82rem', padding: '0.6rem' }} />
                      <input className="form-input" placeholder="kg" type="number" value={ex.weight}
                        onChange={e => updateExercise(i, 'weight', e.target.value)} style={{ fontSize: '0.82rem', padding: '0.6rem' }} />
                      {form.exercises.length > 1 && (
                        <button type="button" onClick={() => removeExercise(i)}
                          style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '0.9rem', padding: '0 0.25rem' }}>✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-input" placeholder="How did it feel?" rows={2} value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button id="submit-workout" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? '⏳ Saving...' : '✅ Log Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
