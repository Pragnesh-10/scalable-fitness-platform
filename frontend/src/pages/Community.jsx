import { useState, useEffect } from 'react';
import api from '../lib/api';
import { 
  Users, 
  Trophy, 
  Target, 
  Calendar, 
  UserPlus, 
  CheckCircle, 
  ChevronRight, 
  Zap,
  Activity,
  Flame,
  ArrowRight,
  ShieldCheck,
  Globe,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Community() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState([]);
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

  const handleJoinChallenge = async (challengeId) => {
    try {
      await api.post(`/community/challenges/${challengeId}/join`);
      fetchData();
    } catch (error) {
      console.error('Failed to join challenge', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#e5e2e1] pb-32 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      {/* Top Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 z-[60] flex flex-col sm:flex-row justify-between items-center w-full px-4 sm:px-8 md:px-12 py-4 md:py-6 bg-black/40 backdrop-blur-2xl border-b border-white/5 gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
            <Globe size={24} className="text-black" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-white font-space uppercase">GLOBAL SECTOR</span>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={cn(
              "px-4 sm:px-8 py-2 sm:py-2.5 rounded-xl font-space font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] transition-all",
              activeTab === 'leaderboard' ? 'bg-white text-black shadow-2xl' : 'text-white/40 hover:text-white'
            )}
          >
            RANKINGS
          </button>
          <button 
            onClick={() => setActiveTab('challenges')}
            className={cn(
              "px-4 sm:px-8 py-2 sm:py-2.5 rounded-xl font-space font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] transition-all",
              activeTab === 'challenges' ? 'bg-white text-black shadow-2xl' : 'text-white/40 hover:text-white'
            )}
          >
            OPERATIONS
          </button>
        </div>
      </motion.header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-40 sm:pt-32 px-4 sm:px-6 md:px-8 lg:px-12 w-full max-w-7xl mx-auto space-y-12 md:space-y-16 relative z-10"
      >
        {/* Community Header */}
        <motion.section variants={itemVariants} className="space-y-4 w-full">
          <h1 className="font-space text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-tight break-words whitespace-normal px-1">
            ELITE <br />
            <span className="text-secondary italic">COHORT</span>
          </h1>
          <p className="text-white/40 font-lexend text-xs sm:text-sm uppercase tracking-[0.4em] font-bold max-w-2xl">
            Sychronized performance indexing across the global neural network.
          </p>
        </motion.section>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-[50vh] flex-col items-center justify-center gap-6"
            >
              <div className="w-20 h-20 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
              <p className="font-space font-black text-[10px] text-secondary uppercase tracking-[0.6em] animate-pulse">Scanning Bio-Archive...</p>
            </motion.div>
          ) : activeTab === 'leaderboard' ? (
            <motion.section 
              key="leaderboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-10"
            >
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  <Trophy size={32} className="text-secondary" />
                  <h3 className="text-4xl font-space font-black text-white uppercase tracking-tighter italic">Global Rankings</h3>
                </div>
                <div className="glass-card px-8 py-3 rounded-2xl flex items-center gap-4 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[10px] font-space font-black text-white/60 uppercase tracking-[0.4em]">SEASON_ALPHA_04</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {leaderboard.map((user, index) => (
                  <motion.div 
                    key={user._id} 
                    variants={itemVariants}
                    whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.02)' }}
                    className="glass-card p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 border border-white/5 hover:border-secondary/30 transition-all group relative overflow-hidden"
                  >
                    {/* Rank Indicator */}
                    <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center gap-10">
                      <div className={cn(
                        "w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] sm:rounded-[32px] flex-shrink-0 flex items-center justify-center font-space font-black text-2xl sm:text-4xl transition-all shadow-2xl",
                        index === 0 ? "bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-black" :
                        index === 1 ? "bg-gradient-to-br from-[#C0C0C0] to-[#808080] text-black" :
                        index === 2 ? "bg-gradient-to-br from-[#CD7F32] to-[#8B4513] text-black" :
                        "bg-white/[0.03] text-white/20 border border-white/5"
                      )}>
                        {index + 1}
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-2xl sm:text-3xl font-space font-black text-white uppercase tracking-tighter group-hover:text-secondary transition-colors italic">{user.name}</h4>
                        <div className="flex items-center gap-3">
                          <ShieldCheck size={14} className="text-secondary/60" />
                          <span className="text-[10px] font-space font-black text-white/30 uppercase tracking-[0.3em]">LEVEL 42_OPERATIVE</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 sm:gap-16 lg:pr-10">
                      <div className="text-right space-y-1">
                        <span className="text-[9px] sm:text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em] block">MISSIONS</span>
                        <span className="text-2xl sm:text-3xl font-space font-black text-white tracking-tighter italic">{user.workoutCount}</span>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-[9px] sm:text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em] block">ENERGY</span>
                        <div className="flex items-center gap-2 sm:gap-3 justify-end">
                          <Flame size={18} className="text-secondary" />
                          <span className="text-2xl sm:text-3xl font-space font-black text-secondary tracking-tighter italic">{user.totalCalories} <span className="text-[10px] font-normal text-white/20 not-italic uppercase ml-1">KCAL</span></span>
                        </div>
                      </div>
                      <motion.div 
                        whileHover={{ x: 5, scale: 1.1 }}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-white group-hover:bg-secondary group-hover:text-black transition-all"
                      >
                        <ArrowRight size={20} />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section 
              key="challenges"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 gap-4">
                <div className="flex items-center gap-4">
                  <Target size={32} className="text-[#6C63FF]" />
                  <h3 className="text-3xl sm:text-4xl font-space font-black text-white uppercase tracking-tighter italic">Tactical Operations</h3>
                </div>
                <div className="glass-card px-6 sm:px-8 py-2 sm:py-3 rounded-2xl flex items-center gap-4 border border-white/10">
                  <Users size={14} className="text-[#6C63FF]" />
                  <span className="text-[10px] font-space font-black text-white/60 uppercase tracking-[0.4em]">842 ACTIVE IN SECTOR</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {challenges.map((challenge) => (
                  <motion.div 
                    key={challenge._id} 
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className="glass-card p-8 sm:p-12 rounded-[40px] sm:rounded-[60px] flex flex-col justify-between group relative overflow-hidden border border-white/5 shadow-3xl h-auto min-h-[440px]"
                  >
                    {/* Background Visualizer */}
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:scale-125 group-hover:-rotate-12">
                      <Zap size={240} className="text-[#6C63FF]" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                        <div className="space-y-4">
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20">
                            <Sparkles size={12} className="text-[#6C63FF]" />
                            <span className="text-[9px] font-space font-black text-[#6C63FF] uppercase tracking-[0.3em]">PRIORITY_LEVEL_ALPHA</span>
                          </div>
                          <h4 className="text-2xl sm:text-3xl lg:text-4xl font-space font-black text-white uppercase tracking-tighter leading-tight max-w-full group-hover:text-[#6C63FF] transition-colors italic break-words whitespace-normal">{challenge.challengeName}</h4>
                        </div>
                        <div className="glass-strong px-4 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl flex flex-col items-center gap-1 border border-white/10 flex-shrink-0">
                          <span className="text-[8px] sm:text-[10px] font-space font-black text-white/20 uppercase">ENROLLED</span>
                          <div className="flex items-center gap-2">
                            <Users size={12} className="text-secondary" />
                            <span className="text-lg sm:text-xl font-space font-black text-white tracking-tighter">{challenge.participant_count || 0}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-lg sm:text-xl text-white/50 font-lexend leading-relaxed mb-10 line-clamp-3 group-hover:text-white/70 transition-colors">
                        {challenge.description || `Tactical Objective: Reach ${challenge.goalValue} ${challenge.goalType} before extraction.`}
                      </p>
                    </div>
                    
                    <div className="space-y-10 relative z-10">
                      <div className="flex items-center gap-4 text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em]">
                        <Calendar size={16} />
                        EXTRACT_DATE: {new Date(challenge.endDate).toLocaleDateString()}
                      </div>
                      
                      {challenge.is_joined ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="w-full bg-secondary/10 border border-secondary/20 py-6 rounded-3xl flex items-center justify-center gap-4 shadow-2xl shadow-secondary/10"
                        >
                          <ShieldCheck size={24} className="text-secondary" />
                          <span className="font-space font-black text-xs text-secondary uppercase tracking-[0.4em]">DEPLOYMENT_ACTIVE</span>
                        </motion.div>
                      ) : (
                        <motion.button 
                          whileHover={{ scale: 1.02, backgroundColor: '#7C73FF' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleJoinChallenge(challenge._id)}
                          className="w-full bg-[#6C63FF] text-white py-6 rounded-3xl font-space font-black text-xs transition-all shadow-3xl shadow-[#6C63FF]/30 uppercase tracking-[0.4em]"
                        >
                          INITIALIZE OPERATION
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
