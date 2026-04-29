'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Activity, Plus, Search, Timer, Zap, MoreVertical, Brain, RotateCcw, Play, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

type Workout = {
  _id?: string;
  title?: string;
  type: string;
  date?: string;
  duration: number;
  caloriesBurned?: number;
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('running');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loadFromStorage } = useAuthStore();

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/workouts');
      setWorkouts(data.workouts || []);
    } catch (err) {
      console.error('Failed to fetch workouts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFromStorage();
    fetchWorkouts();
  }, [loadFromStorage]);

  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/workouts', {
        title,
        type,
        duration: Number(duration),
        caloriesBurned: Number(calories),
      });
      setTitle(''); setDuration(''); setCalories('');
      setIsModalOpen(false);
      fetchWorkouts();
    } catch (err) {
      console.error('Failed to add workout', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#e5e2e1] pb-32">
      {/* Top Header */}
      <header className="fixed top-0 z-50 flex justify-between items-center w-full px-6 py-4 bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black italic tracking-tighter text-white font-space uppercase">FITPULSE</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white px-6 py-2 rounded-full font-space font-bold text-sm shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> LOG SESSION
        </button>
      </header>

      <main className="pt-24 px-6 max-w-5xl mx-auto space-y-12">
        {/* Workout Tracker Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-space text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
              WORKOUT <span className="text-[#6C63FF]">TRACKER</span>
            </h1>
            <p className="text-lg text-white/60 font-lexend mt-2 max-w-md">Precision tracking for peak performance athletes.</p>
          </div>
          <div className="flex gap-4">
            <div className="glass-card rounded-2xl p-4 flex flex-col items-center min-w-[100px]">
              <span className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest mb-1">STREAK</span>
              <span className="text-2xl font-space font-black text-white">12 <span className="text-xs text-secondary font-normal">DAYS</span></span>
            </div>
          </div>
        </section>

        {/* Form Check & Timer */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Check AI */}
          <div className="glass-card p-8 rounded-[40px] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-secondary" />
                  <span className="text-[10px] font-space font-bold text-secondary uppercase tracking-widest">FORM AI CHECK</span>
                </div>
                <h3 className="text-2xl font-space font-bold text-white">ELBOW POSITION</h3>
              </div>
              <div className="bg-[#4ECDC4]/10 p-2 rounded-full border border-[#4ECDC4]/20">
                <CheckCircle2 className="w-5 h-5 text-[#4ECDC4]" />
              </div>
            </div>
            <p className="text-white/60 font-lexend mb-8 leading-relaxed">Tuck your elbows closer to your body during the descent to maximize tricep engagement and protect your shoulders.</p>
            <div className="flex items-center gap-2 text-white/40">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <span className="text-[10px] font-space font-bold uppercase tracking-widest">AI MONITORING ACTIVE</span>
            </div>
          </div>

          {/* Rest Timer */}
          <div className="glass-card p-8 rounded-[40px] relative overflow-hidden group flex flex-col items-center justify-center text-center">
            <div className="absolute top-6 left-6">
              <span className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest">REST TIMER</span>
            </div>
            <div className="relative mb-6">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle className="text-white/5" strokeWidth="4" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                <circle 
                  className="text-[#6C63FF] transition-all duration-1000" 
                  strokeWidth="4" 
                  strokeDasharray="440" 
                  strokeDashoffset="120" 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="70" 
                  cx="80" 
                  cy="80" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-space font-black text-white">01:45</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:text-[#6C63FF] transition">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button className="px-8 py-3 bg-[#6C63FF] rounded-full font-space font-bold text-sm text-white shadow-lg shadow-[#6C63FF]/30">
                START REST
              </button>
            </div>
          </div>
        </section>

        {/* Activity Log */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-space font-bold text-white uppercase tracking-tight">Activity Log</h2>
            <div className="flex gap-4">
              <button className="glass-card p-2 rounded-xl text-white/40 hover:text-white transition">
                <Search className="w-5 h-5" />
              </button>
              <button className="glass-card px-4 py-2 rounded-xl text-white/40 hover:text-white transition flex items-center gap-2">
                <span className="text-[10px] font-space font-bold uppercase tracking-widest">MONTHLY</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="h-40 flex items-center justify-center text-white/40 font-space uppercase tracking-widest animate-pulse">Scanning history...</div>
            ) : workouts.length === 0 ? (
              <div className="h-64 glass-card rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-8">
                <Activity className="w-12 h-12 text-white/10 mb-4" />
                <h3 className="text-xl font-space font-bold text-white uppercase mb-2">No Sessions Yet</h3>
                <p className="text-white/40 font-lexend max-w-xs mb-8">Your legacy starts here. Log your first session and begin the journey.</p>
                <button onClick={() => setIsModalOpen(true)} className="text-[#6C63FF] font-space font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                  <Plus className="w-4 h-4" /> INITIALIZE FIRST SESSION
                </button>
              </div>
            ) : (
              workouts.map((workout, idx) => (
                <div key={workout._id || idx} className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:scale-[1.01] transition-transform group cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#6C63FF] group-hover:bg-[#6C63FF]/10 transition-colors">
                      <Activity className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-space font-bold text-white uppercase tracking-tight">{workout.title || 'Untitled Session'}</h4>
                      <p className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest mt-1">
                        {workout.type} • {new Date(workout.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest mb-1">DURATION</span>
                      <span className="text-xl font-space font-black text-white">{workout.duration} <span className="text-xs text-secondary font-normal uppercase">min</span></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest mb-1">BURN</span>
                      <span className="text-xl font-space font-black text-white">{workout.caloriesBurned || 0} <span className="text-xs text-[#6C63FF] font-normal uppercase">kcal</span></span>
                    </div>
                    <button className="text-white/20 hover:text-white transition">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Log Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="glass-strong w-full max-w-md rounded-[40px] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-space font-bold text-white uppercase tracking-tight">LOG SESSION</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleAddWorkout} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest ml-1">WORKOUT TITLE</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#6C63FF]/50 text-white font-lexend placeholder-white/20"
                  placeholder="e.g. MORNING PUSH"
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest ml-1">TYPE</label>
                  <select 
                    value={type} 
                    onChange={e => setType(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#6C63FF]/50 text-white font-lexend appearance-none"
                  >
                    <option value="running">RUNNING</option>
                    <option value="cycling">CYCLING</option>
                    <option value="strength">STRENGTH</option>
                    <option value="yoga">YOGA</option>
                    <option value="hiit">HIIT</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest ml-1">MINUTES</label>
                  <input 
                    type="number" 
                    value={duration} 
                    onChange={e => setDuration(e.target.value)} 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#6C63FF]/50 text-white font-lexend"
                    placeholder="45"
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest ml-1">CALORIES (OPTIONAL)</label>
                <input 
                  type="number" 
                  value={calories} 
                  onChange={e => setCalories(e.target.value)} 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#6C63FF]/50 text-white font-lexend"
                  placeholder="350"
                />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-[#6C63FF] hover:bg-[#5a52e0] text-white font-space font-black text-sm py-5 rounded-2xl transition-all shadow-lg shadow-[#6C63FF]/30 uppercase tracking-widest">
                  UPLOAD PERFORMANCE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
