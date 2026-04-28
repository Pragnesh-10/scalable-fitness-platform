'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Activity, Plus, Search, Timer, Zap, MoreVertical } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
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
    <div className="p-6 max-w-7xl mx-auto text-white">
      <header className="flex md:flex-row flex-col md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">Workout Log</h1>
          <p className="text-white/60">Track, analyze, and conquer your next session.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)] transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Log New Session
        </button>
      </header>

      {/* Filters & Search - UI Placeholder */}
      <div className="flex md:flex-row flex-col gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search activities..." 
            className="w-full bg-[#121212] border border-white/10 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 text-white placeholder-white/40 transition"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar hidden md:flex">
          {['All', 'Running', 'Strength', 'HIIT', 'Yoga'].map(filter => (
             <button key={filter} className={`px-5 py-2 rounded-full border text-sm font-medium transition whitespace-nowrap ${filter === 'All' ? 'bg-white text-black border-white' : 'bg-transparent border-white/20 text-white/70 hover:border-white/50'}`}>
                {filter}
             </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full h-40 flex items-center justify-center text-white/40">Loading history...</div>
        ) : workouts.length === 0 ? (
           <div className="col-span-full h-[40vh] flex flex-col items-center justify-center border border-dashed border-white/20 rounded-2xl bg-white/[0.02]">
             <Activity className="w-16 h-16 text-white/20 mb-4" />
             <h3 className="text-xl font-bold mb-2">No workouts found</h3>
             <p className="text-white/50 mb-6 text-center max-w-md">Your log is empty. It's time to lace up those shoes, grab a barbell, or hit the mat.</p>
             <button onClick={() => setIsModalOpen(true)} className="text-indigo-400 font-semibold flex items-center gap-2 hover:text-indigo-300">
               <Plus className="w-4 h-4" /> Start Tracking
             </button>
           </div>
        ) : (
          workouts.map((workout: any, idx: number) => (
             <div key={workout._id || idx} className="bg-[#121212] border border-white/10 rounded-2xl p-6 group hover:border-white/30 transition duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl inline-flex ${
                        workout.type === 'running' ? 'bg-blue-500/10 text-blue-400' : 
                        workout.type === 'strength' ? 'bg-amber-500/10 text-amber-400' :
                        workout.type === 'hiit' ? 'bg-rose-500/10 text-rose-400' :
                        'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      <Activity className="w-6 h-6" />
                    </div>
                    <button className="text-white/30 hover:text-white transition"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{workout.title || 'Untitled Session'}</h3>
                  <p className="text-sm font-medium text-white/50 uppercase tracking-wider mb-6">
                    {workout.type} • {new Date(workout.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                  </p>
                </div>
                
                <div className="flex items-center gap-6 mt-auto">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-white/40" />
                    <span className="text-white font-semibold">{workout.duration}<span className="text-white/50 text-xs ml-1">MIN</span></span>
                  </div>
                  {workout.caloriesBurned > 0 && (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-white/40" />
                      <span className="text-white font-semibold">{workout.caloriesBurned}<span className="text-white/50 text-xs ml-1">KCAL</span></span>
                    </div>
                  )}
                </div>
             </div>
          ))
        )}
      </div>

      {/* Modal Overlay for Adding Workouts */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-transparent">
              <h2 className="text-xl font-bold text-white">Log Session</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleAddWorkout} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Workout Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 text-white"
                  placeholder="e.g. Morning 5K Run"
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Type</label>
                  <select 
                    value={type} 
                    onChange={e => setType(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 text-white appearance-none"
                  >
                    <option value="running">Running</option>
                    <option value="cycling">Cycling</option>
                    <option value="strength">Strength</option>
                    <option value="yoga">Yoga</option>
                    <option value="hiit">HIIT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Duration (min)</label>
                  <input 
                    type="number" 
                    value={duration} 
                    onChange={e => setDuration(e.target.value)} 
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 text-white"
                    placeholder="45"
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Calories Burned (optional)</label>
                <input 
                  type="number" 
                  value={calories} 
                  onChange={e => setCalories(e.target.value)} 
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 text-white"
                  placeholder="350"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-4 py-3 transition shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
