'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Users, Trophy, Target, Calendar, UserPlus, CheckCircle, ChevronRight, Zap } from 'lucide-react';

type LeaderboardUser = { _id: string; name: string; workoutCount: number; totalCalories: number };
type Challenge = {
  _id: string;
  challengeName: string;
  description?: string;
  goalValue?: number;
  goalType?: string;
  participant_count?: number;
  endDate: string;
  is_joined?: boolean;
};

export default function Community() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'leaderboard') {
        const { data } = await api.get('/community/leaderboard');
        setLeaderboard(data.leaderboard || []);
      } else {
        const { data } = await api.get('/community/challenges');
        setChallenges(data.challenges || []);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await api.post(`/community/challenges/${challengeId}/join`);
      fetchData();
    } catch (error) {
      console.error('Failed to join challenge', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#e5e2e1] pb-32">
      {/* Top Header */}
      <header className="fixed top-0 z-50 flex justify-between items-center w-full px-6 py-4 bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black italic tracking-tighter text-white font-space uppercase">FITPULSE</span>
        </div>
        <div className="flex bg-white/5 p-1 rounded-full border border-white/5">
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-1.5 rounded-full font-space font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === 'leaderboard' ? 'bg-[#6C63FF] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            LEADERBOARD
          </button>
          <button 
            onClick={() => setActiveTab('challenges')}
            className={`px-6 py-1.5 rounded-full font-space font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === 'challenges' ? 'bg-[#6C63FF] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            CHALLENGES
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-5xl mx-auto space-y-12">
        {/* Community Header */}
        <section>
          <h1 className="font-space text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
            COMMUNITY <span className="text-secondary">HUB</span>
          </h1>
          <p className="text-lg text-white/60 font-lexend mt-2 max-w-md">Connect with elite athletes and conquer shared objectives.</p>
        </section>

        {loading ? (
          <div className="flex h-[40vh] items-center justify-center text-[#6C63FF]/50 animate-pulse font-space text-xl uppercase tracking-widest">
            Syncing Community Data...
          </div>
        ) : activeTab === 'leaderboard' ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-space font-bold text-white uppercase tracking-tight">Global Rankings</h3>
              <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
                <Trophy className="w-4 h-4 text-secondary" />
                <span className="text-[10px] font-space font-bold text-white/60 uppercase tracking-widest">SEASON 12</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <div key={user._id} className="glass-card p-6 rounded-3xl flex items-center justify-between gap-6 hover:scale-[1.01] transition-transform group">
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-space font-black text-xl ${
                      index === 0 ? 'bg-gradient-to-tr from-yellow-400 to-amber-600 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]' :
                      index === 1 ? 'bg-gradient-to-tr from-slate-300 to-slate-500 text-black' :
                      index === 2 ? 'bg-gradient-to-tr from-orange-400 to-orange-700 text-black' :
                      'bg-white/5 text-white/40'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-space font-bold text-white uppercase tracking-tight">{user.name}</h4>
                      <p className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest mt-1">Level 42 Athlete</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest mb-1">WORKOUTS</span>
                      <span className="text-xl font-space font-black text-white">{user.workoutCount}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest mb-1">ENERGY</span>
                      <span className="text-xl font-space font-black text-secondary">{user.totalCalories} <span className="text-xs font-normal text-white/40">KCAL</span></span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <div className="h-40 glass-card rounded-[40px] flex items-center justify-center text-white/20 font-space uppercase tracking-widest">
                  No athletes in sector yet.
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-space font-bold text-white uppercase tracking-tight">Active Operations</h3>
              <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
                <Target className="w-4 h-4 text-[#6C63FF]" />
                <span className="text-[10px] font-space font-bold text-white/60 uppercase tracking-widest">4 LIVE OPS</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <div key={challenge._id} className="glass-card p-8 rounded-[40px] flex flex-col justify-between group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-24 h-24 text-[#6C63FF]" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-2xl font-space font-bold text-white uppercase tracking-tight leading-tight max-w-[70%]">{challenge.challengeName}</h4>
                      <div className="glass-card px-3 py-1 rounded-full flex items-center gap-2">
                        <Users className="w-3 h-3 text-secondary" />
                        <span className="text-[10px] font-space font-bold text-white/60">{challenge.participant_count || 0}</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/50 font-lexend mb-8 line-clamp-2">
                      {challenge.description || `Tactical Objective: Reach ${challenge.goalValue} ${challenge.goalType} before extraction.`}
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[10px] font-space font-bold text-white/30 uppercase tracking-widest">
                      <Calendar className="w-4 h-4" />
                      ENDS {new Date(challenge.endDate).toLocaleDateString()}
                    </div>
                    
                    {challenge.is_joined ? (
                      <div className="w-full bg-secondary/10 border border-secondary/20 py-4 rounded-2xl flex items-center justify-center gap-3">
                        <CheckCircle className="w-5 h-5 text-secondary" />
                        <span className="font-space font-black text-xs text-secondary uppercase tracking-widest">ENROLLED</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleJoinChallenge(challenge._id)}
                        className="w-full bg-[#6C63FF] hover:bg-[#5a52e0] text-white py-4 rounded-2xl font-space font-black text-xs transition-all shadow-lg shadow-[#6C63FF]/20 uppercase tracking-widest"
                      >
                        JOIN OPERATION
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {challenges.length === 0 && (
                <div className="col-span-full h-64 glass-card rounded-[40px] flex flex-col items-center justify-center text-center p-8 border-dashed border-white/10">
                  <Target className="w-12 h-12 text-white/10 mb-4" />
                  <p className="text-white/40 font-space uppercase tracking-widest">All sectors secured. Stand by for new directives.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
