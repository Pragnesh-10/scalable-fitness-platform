import { useState, useEffect } from 'react';
import api from '../lib/api';
import { 
  Activity, 
  Plus, 
  Search, 
  Timer, 
  Zap, 
  MoreVertical, 
  Brain, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  ChevronDown,
  Dumbbell,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('running');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loadFromStorage } = useAuthStore();
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(105); // 01:45

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

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleAddWorkout = async (e) => {
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#e5e2e1] pb-32 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Top Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 right-0 z-[60] flex justify-between items-center py-4 md:py-6 px-4 sm:px-6 md:px-8 lg:px-12 bg-black/40 backdrop-blur-2xl border-b border-white/5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ left: 'var(--sidebar-width, 0px)' }}
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="w-10 h-10 rounded-xl bg-[#6C63FF] flex items-center justify-center shadow-lg shadow-[#6C63FF]/30"
          >
            <Zap className="w-6 h-6 text-white" fill="currentColor" />
          </motion.div>
          <span className="text-2xl font-black italic tracking-tighter text-white font-space uppercase">OPERATIONS</span>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-4 sm:px-10 py-2.5 sm:py-3 rounded-none font-space font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center gap-2 sm:gap-3 group border-2 border-transparent hover:border-white hover:bg-black hover:text-white"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform" />
          <span className="hidden xs:block">LOG MISSION</span>
          <span className="xs:hidden">LOG</span>
        </motion.button>
      </motion.header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-28 md:pt-32 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-12 space-y-8 sm:space-y-12 md:space-y-16 relative z-10"
      >
        {/* Workout Tracker Header */}
        <motion.section variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="left-panel">
            <h1 className="font-space text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tight leading-[0.9] break-words">
              WORKOUT <br />
              <span className="text-[#6C63FF] italic">TRACKER</span>
            </h1>
            <p className="text-white/40 font-lexend text-sm uppercase tracking-[0.3em] font-bold max-w-md">Precision telemetry for the elite cohort.</p>
          </div>
          <div className="flex gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-6 sm:p-8 rounded-[32px] p-8 flex flex-col items-center min-w-[140px] border border-white/10 shadow-2xl"
            >
              <span className="text-[10px] font-space font-black text-white/30 uppercase tracking-[0.4em] mb-3">STREAK</span>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-space font-black text-white">12</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-space font-black text-secondary uppercase">CYCLES</span>
                  <Activity size={14} className="text-secondary" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Form Check & Timer */}
        <motion.section variants={itemVariants} className="main-layout">
          {/* Form Check AI */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="glass-card p-6 sm:p-10 rounded-[40px] sm:rounded-[56px] relative overflow-hidden group shadow-2xl"
          >
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-[url('/assets/generated/strength_realistic_tactical_1777436798332.png')] bg-cover opacity-10 grayscale group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="left-panel">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-space font-black text-secondary uppercase tracking-[0.4em]">NEURAL FORM AI</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-space font-black text-white uppercase tracking-tight section-header">ELBOW STABILITY</h3>
                </div>
                <div className="bg-secondary/20 p-4 rounded-3xl border border-secondary/30">
                  <CheckCircle2 className="w-8 h-8 text-secondary" />
                </div>
              </div>
              <p className="text-white/60 font-lexend text-base sm:text-lg leading-relaxed mb-10">
                "Operational data indicates excessive flare. Tuck elbows closer to the thoracic cage to maximize tricep torque."
              </p>
              <p className="text-[10px] font-space font-black text-white/30 uppercase tracking-widest">LIVE WITH 2,842 USERS</p>
            </div>
          </motion.div>

          {/* Rest Timer */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="glass-card p-6 sm:p-10 rounded-[40px] sm:rounded-[56px] relative overflow-hidden group flex flex-col items-center justify-center text-center shadow-2xl"
          >
            <div className="absolute top-10 left-10">
              <span className="text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em]">RECOVERY PROTOCOL</span>
            </div>
            
            <div className="relative mb-6 sm:mb-10 group/timer cursor-pointer">
              <svg className="w-48 h-48 sm:w-64 sm:h-64 transform -rotate-90">
                <circle className="text-white/5" strokeWidth="4" stroke="currentColor" fill="transparent" r="120" cx="128" cy="128" />
                <motion.circle 
                  initial={{ strokeDashoffset: 754 }}
                  animate={{ strokeDashoffset: 754 - (754 * (timeLeft / 105)) }}
                  className="text-[#6C63FF] shadow-[0_0_20px_#6C63FF]" 
                  strokeWidth="6" 
                  strokeDasharray="754" 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="120" 
                  cx="128" 
                  cy="128" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  key={timeLeft}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl sm:text-7xl font-space font-black text-white tracking-tight"
                >
                  {formatTime(timeLeft)}
                </motion.span>
                <span className="text-[10px] font-space font-black text-white/20 uppercase tracking-[0.3em] mt-2">REMAINING</span>
              </div>
            </div>

            <div className="flex gap-6 relative z-10">
              <motion.button 
                whileHover={{ rotate: -180, scale: 1.1 }}
                onClick={() => { setTimeLeft(105); setTimerActive(false); }}
                className="w-16 h-16 rounded-3xl glass-card border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <RotateCcw size={24} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimerActive(!timerActive)}
                className="px-8 sm:px-12 py-4 sm:py-5 bg-[#6C63FF] text-white rounded-3xl font-space font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#6C63FF]/30"
              >
                {timerActive ? 'PAUSE PROTOCOL' : 'INITIATE REST'}
              </motion.button>
            </div>
          </motion.div>
        </motion.section>

        {/* Activity Log */}
        <motion.section variants={itemVariants}>
          <div className="flex justify-between items-center mb-12 px-2">
            <div className="left-panel">
              <h2 className="text-3xl sm:text-4xl font-space font-black text-white uppercase tracking-tight section-header">Operational History</h2>
              <p className="text-[9px] sm:text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em]">Audit log of past performance cycles</p>
            </div>
            <div className="flex gap-4">
              <button className="glass-card p-4 rounded-2xl text-white/40 hover:text-white border border-white/5 transition-all">
                <Search size={20} />
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#6C63FF] text-white px-6 sm:px-12 py-3 sm:py-6 rounded-none font-space font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#6C63FF]/40 hover:bg-[#5a52e0] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 sm:gap-4 group border-2 border-[#6C63FF]"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden xs:block">LOG NEW MISSION</span>
                <span className="xs:hidden">LOG MISSION</span>
              </button>
              <button className="hidden md:flex glass-card px-8 py-4 rounded-2xl text-white font-space font-black text-[10px] uppercase tracking-[0.2em] border border-white/5 hover:border-white/20 transition-all items-center gap-3">
                MONTHLY REPORT
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="h-40 flex items-center justify-center text-[#6C63FF] font-space font-black text-xs uppercase tracking-[0.6em] animate-pulse">Scanning Bio-Archive...</div>
            ) : workouts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-96 glass-card rounded-[56px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 group"
              >
                <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Activity size={48} className="text-white/10 group-hover:text-[#6C63FF] transition-colors" />
                </div>
                <h3 className="text-3xl font-space font-black text-white uppercase mb-4 tracking-tight">No Active History</h3>
                <p className="text-white/40 font-lexend text-lg max-w-sm mb-10 leading-relaxed">The archive is empty. Begin your first mission to establish a bio-legacy.</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsModalOpen(true)} 
                  className="bg-white text-black px-12 py-5 rounded-2xl font-space font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3"
                >
                  <Plus size={20} /> INITIALIZE SESSION
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {workouts.map((workout, idx) => (
                  <motion.div 
                    key={workout._id || idx} 
                    whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.02)' }}
                    className="glass-card p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-10 border border-white/5 hover:border-[#6C63FF]/30 transition-all group cursor-pointer relative overflow-hidden"
                  >
                    {/* Background Visualizer */}
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#6C63FF]/5 to-transparent pointer-events-none" />
                    
                    <div className="flex items-center gap-6 sm:gap-10 relative z-10">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] sm:rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center text-[#6C63FF] group-hover:bg-[#6C63FF] group-hover:text-white transition-all shadow-xl">
                        {workout.type === 'running' ? <Zap size={28} /> : <Dumbbell size={28} />}
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-2xl sm:text-3xl font-space font-black text-white uppercase tracking-tight group-hover:text-[#6C63FF] transition-colors">
                          {workout.title || 'BIO-MISSION'}
                        </h4>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-space font-black text-[#6C63FF] uppercase tracking-[0.3em] bg-[#6C63FF]/10 px-3 py-1 rounded-full">{workout.type}</span>
                          <span className="text-[10px] font-space font-black text-white/30 uppercase tracking-[0.3em]">
                            {new Date(workout.date || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 sm:gap-16 relative z-10 lg:pr-10">
                      <div className="space-y-1">
                        <p className="text-[9px] sm:text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em]">DURATION</p>
                        <p className="text-2xl sm:text-3xl font-space font-black text-white tracking-tighter italic">{workout.duration} <span className="text-[10px] sm:text-xs text-secondary font-normal not-italic tracking-widest">MINS</span></p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] sm:text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em]">OUTPUT</p>
                        <p className="text-2xl sm:text-3xl font-space font-black text-white tracking-tighter italic">{workout.caloriesBurned || 0} <span className="text-[10px] sm:text-xs text-[#6C63FF] font-normal not-italic tracking-widest">KCAL</span></p>
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.2, x: 5 }}
                        className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white group-hover:bg-[#6C63FF]/20 transition-all border border-white/5"
                      >
                        <ArrowRight size={20} />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </motion.main>

      {/* Log Session Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-strong w-full max-w-xl rounded-none overflow-hidden border border-white/10 shadow-3xl shadow-black/80"
            >
              <div className="p-8 sm:p-12 border-b border-white/5 flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-3xl sm:text-4xl font-space font-black text-white uppercase tracking-tighter italic pl-2 sm:pl-3">LOG MISSION</h2>
                  <p className="text-[9px] sm:text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em]">Manual performance data upload</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-white/10 text-white/40 hover:text-white text-2xl sm:text-3xl transition-all flex items-center justify-center">&times;</button>
              </div>
              <form onSubmit={handleAddWorkout} className="p-8 sm:p-12 space-y-6 sm:space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-space font-black text-white/40 uppercase tracking-[0.4em] ml-2">MISSION CODERS</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className="w-full bg-white/[0.03] border border-white/5 rounded-none px-8 py-5 focus:outline-none focus:border-[#6C63FF]/50 text-xl text-white font-space font-black tracking-tight placeholder-white/10 transition-all"
                    placeholder="e.g. ALPHA_STRENGTH"
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-space font-black text-white/40 uppercase tracking-[0.4em] ml-2">PROTOCOL TYPE</label>
                    <select 
                      value={type} 
                      onChange={e => setType(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-none px-8 py-5 focus:outline-none focus:border-[#6C63FF]/50 text-white font-space font-black uppercase tracking-widest appearance-none transition-all"
                    >
                      <option value="running">RUNNING</option>
                      <option value="strength">STRENGTH</option>
                      <option value="yoga">YOGA</option>
                      <option value="hiit">HIIT</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-space font-black text-white/40 uppercase tracking-[0.4em] ml-2">TIME CYCLES (MINS)</label>
                    <input 
                      type="number" 
                      value={duration} 
                      onChange={e => setDuration(e.target.value)} 
                      className="w-full bg-white/[0.03] border border-white/5 rounded-none px-8 py-5 focus:outline-none focus:border-[#6C63FF]/50 text-xl text-white font-space font-black tracking-tight"
                      placeholder="45"
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-space font-black text-white/40 uppercase tracking-[0.4em] ml-2">ENERGY OUTPUT (KCAL)</label>
                  <input 
                    type="number" 
                    value={calories} 
                    onChange={e => setCalories(e.target.value)} 
                    className="w-full bg-white/[0.03] border border-white/5 rounded-none px-8 py-5 focus:outline-none focus:border-[#6C63FF]/50 text-xl text-white font-space font-black tracking-tight"
                    placeholder="350"
                  />
                </div>
                <div className="pt-8">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full bg-[#6C63FF] text-white font-space font-black text-xs py-6 rounded-none transition-all shadow-3xl shadow-[#6C63FF]/40 uppercase tracking-[0.4em] border-2 border-[#6C63FF] hover:bg-[#5a52e0]"
                  >
                    AUTHORIZE BIO-LOG
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
