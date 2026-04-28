'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';

const STUB_GROUPS = [
  { _id: 'g1', groupName: 'Morning Warriors', description: 'Early risers who train before sunrise', member_count: 142, is_member: false },
  { _id: 'g2', groupName: 'Iron Club', description: 'Dedicated strength and powerlifting community', member_count: 89, is_member: true },
  { _id: 'g3', groupName: 'Run Collective', description: 'Runners of all levels — 5K to ultramarathon', member_count: 234, is_member: false },
];
const STUB_CHALLENGES = [
  { _id: 'c1', challengeName: '10K Steps Daily', description: 'Hit 10,000 steps every day for 30 days', goalType: 'steps', goalValue: 10000, is_joined: true, participant_count: 318, endDate: new Date(Date.now() + 15 * 86400000).toISOString() },
  { _id: 'c2', challengeName: '500 Calorie Burn', description: 'Burn 500+ calories per workout session', goalType: 'calories', goalValue: 500, is_joined: false, participant_count: 156, endDate: new Date(Date.now() + 7 * 86400000).toISOString() },
  { _id: 'c3', challengeName: '30-Day Workout Streak', description: 'Complete a workout every single day', goalType: 'workouts', goalValue: 30, is_joined: false, participant_count: 412, endDate: new Date(Date.now() + 25 * 86400000).toISOString() },
];
const STUB_LEADERBOARD = [
  { name: 'Priya K.', workoutCount: 24, totalCalories: 9840 },
  { name: 'Rahul M.', workoutCount: 21, totalCalories: 8610 },
  { name: 'Arjun S.', workoutCount: 19, totalCalories: 7980 },
  { name: 'Sneha P.', workoutCount: 17, totalCalories: 6720 },
  { name: 'Vikram R.', workoutCount: 15, totalCalories: 5900 },
];

export default function CommunityPage() {
  const [tab, setTab] = useState<'groups' | 'challenges' | 'leaderboard'>('groups');
  const [groups, setGroups] = useState(STUB_GROUPS);
  const [challenges, setChallenges] = useState(STUB_CHALLENGES);
  const [leaderboard, setLeaderboard] = useState(STUB_LEADERBOARD);
  const [toast, setToast] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({ groupName: '', description: '' });

  useEffect(() => {
    api.get('/community/groups').then(r => setGroups(r.data.groups || STUB_GROUPS)).catch(() => {});
    api.get('/community/challenges').then(r => setChallenges(r.data.challenges || STUB_CHALLENGES)).catch(() => {});
    api.get('/community/leaderboard').then(r => setLeaderboard(r.data.leaderboard || STUB_LEADERBOARD)).catch(() => {});
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const joinGroup = async (id: string) => {
    try {
      await api.post(`/community/groups/${id}/join`);
      setGroups(gs => gs.map(g => g._id === id ? { ...g, is_member: true, member_count: g.member_count + 1 } : g));
      showToast('🎉 Joined group!');
    } catch { showToast('Failed to join'); }
  };

  const joinChallenge = async (id: string) => {
    try {
      await api.post(`/community/challenges/${id}/join`);
      setChallenges(cs => cs.map(c => c._id === id ? { ...c, is_joined: true } : c));
      showToast('⚡ Challenge accepted!');
    } catch { showToast('Failed to join'); }
  };

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/community/groups', groupForm);
      setGroups(gs => [{ ...data.group, is_member: true, member_count: 1 }, ...gs]);
      setShowCreateGroup(false);
      setGroupForm({ groupName: '', description: '' });
      showToast('🎉 Group created!');
    } catch { showToast('Failed to create'); }
  };

  return (
    <div>
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.includes('Failed') ? 'error' : 'success'}`}>{toast}</div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">👥 Community</h1>
        <p className="page-subtitle">Connect, compete, and grow together</p>
      </div>

      <div className="tab-nav" style={{ marginBottom: '2rem', maxWidth: 400 }}>
        {(['groups', 'challenges', 'leaderboard'] as const).map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'groups' ? '👥' : t === 'challenges' ? '🏆' : '🥇'} {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Groups */}
      {tab === 'groups' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowCreateGroup(!showCreateGroup)}>
              + Create Group
            </button>
          </div>
          {showCreateGroup && (
            <div className="card" style={{ marginBottom: '1.5rem', animation: 'slideUp 0.3s ease' }}>
              <form onSubmit={createGroup} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div className="form-group">
                  <label className="form-label">Group Name</label>
                  <input className="form-input" placeholder="e.g. Sunrise Runners" required
                    value={groupForm.groupName} onChange={e => setGroupForm(f => ({ ...f, groupName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" placeholder="What's this group about?" rows={2}
                    value={groupForm.description} onChange={e => setGroupForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm">Create Group</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowCreateGroup(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}
          <div className="grid-3">
            {groups.map(g => (
              <div key={g._id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                    👥
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{g.groupName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.member_count} members</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>{g.description}</p>
                {g.is_member ? (
                  <span className="badge badge-success" style={{ fontSize: '0.78rem' }}>✅ Joined</span>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => joinGroup(g._id)}>Join Group</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenges */}
      {tab === 'challenges' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {challenges.map(c => (
            <div key={c._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #FF6B6B20, #FFE66D20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                {c.goalType === 'steps' ? '👣' : c.goalType === 'calories' ? '🔥' : '🏋️'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700 }}>{c.challengeName}</span>
                  {c.is_joined && <span className="badge badge-success">✅ Active</span>}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{c.description}</p>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  <span>🎯 Goal: {c.goalValue.toLocaleString()} {c.goalType}</span>
                  <span>👥 {c.participant_count} participants</span>
                  <span>⏰ Ends {new Date(c.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              {!c.is_joined && (
                <button className="btn btn-primary btn-sm" style={{ flexShrink: 0 }} onClick={() => joinChallenge(c._id)}>Accept →</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard */}
      {tab === 'leaderboard' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 700 }}>🥇 Monthly Leaderboard</h2>
            <span className="badge badge-warning">Last 30 Days</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {leaderboard.map((entry: any, i: number) => (
              <div key={i} className="leaderboard-item">
                <div className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}`}>
                  {i + 1}
                </div>
                <div className="avatar" style={{ width: 40, height: 40, fontSize: '0.9rem', background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)' }}>
                  {entry.name?.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{entry.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {entry.workoutCount} workouts · {(entry.totalCalories || 0).toLocaleString()} kcal burned
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--primary-light)' }}>
                    {entry.workoutCount}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>workouts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
