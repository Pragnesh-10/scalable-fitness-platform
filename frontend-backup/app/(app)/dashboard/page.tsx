'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { 
  Activity, 
  Flame, 
  Timer, 
  Footprints, 
  Zap, 
  Target, 
  TrendingUp, 
  ChevronRight, 
  MoreHorizontal,
  Shield,
  Cpu,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Analytics {
  summary: { 
    avgHR: number; 
    totalSteps: number;
    totalCalories: number;
    activeMinutes: number;
  };
  dailyMetrics: Array<{ date: string; intensity: number }>;
}

export default function Dashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const { user, loadFromStorage } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
    api.get('/analytics/weekly')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [loadFromStorage]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#030303] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#6C63FF]/10 via-transparent to-transparent" />
        <div className="flex flex-col items-center gap-6 relative z-10">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center shadow-2xl shadow-[#6C63FF]/30"
          >
            <Zap className="w-10 h-10 text-white" fill="currentColor" />
          </motion.div>
          <div className="space-y-2 text-center">
            <p className="font-space text-[10px] font-black text-[#6C63FF] uppercase tracking-[0.6em] animate-pulse">INITIALIZING CORE</p>
            <p className="font-space text-[12px] font-black text-white/20 uppercase tracking-[0.2em]">SYNCHRONIZING TELEMETRY</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'HEART RATE', value: data?.summary?.avgHR || 124, unit: 'BPM', color: 'text-secondary', icon: Activity, trend: '+4%', bg: 'bg-secondary/5' },
    { label: 'ENERGY BURN', value: data?.summary?.totalCalories || 842, unit: 'KCAL', color: 'text-[#6C63FF]', icon: Flame, trend: '-2%', bg: 'bg-[#6C63FF]/5' },
    { label: 'ACTIVE MINS', value: data?.summary?.activeMinutes || 45, unit: 'MINS', color: 'text-secondary', icon: Timer, trend: '+12%', bg: 'bg-secondary/5' },
    { label: 'TOTAL STEPS', value: (data?.summary?.totalSteps || 8432).toLocaleString(), unit: 'STEPS', color: 'text-[#6C63FF]', icon: Footprints, trend: '+1%', bg: 'bg-[#6C63FF]/5' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#e5e2e1] pb-32 relative">
      {/* Background Grid - Added for Realism */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-16 px-8 max-w-7xl mx-auto space-y-16 relative z-10"
      >
        {/* Welcome Section */}
        <motion.section variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-end gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[10px] font-space font-black text-white/40 uppercase tracking-[0.3em]">OPERATIONAL STATUS: OPTIMAL</span>
            </div>
            <h1 className="font-space text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
              DOMINATE, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] via-[#4ECDC4] to-[#6C63FF] bg-[length:200%_auto] animate-gradient">
                {user?.name?.split(' ')[0] || 'OPERATIVE'}.
              </span>
            </h1>
            <p className="text-white/40 font-lexend text-sm uppercase tracking-[0.2em] font-bold max-w-md">
              Bio-telemetry stream integrated. Tactical systems primed for peak performance.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="glass-strong flex items-center gap-5 px-8 py-5 rounded-[28px] border border-white/5 shadow-2xl relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <Cpu className="w-8 h-8 text-secondary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-ping opacity-50" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-space font-black uppercase tracking-widest text-white">Neural Hub</span>
                <span className="text-[9px] font-space font-bold text-white/40 uppercase tracking-[0.2em]">LIVE CONNECTION ACTIVE</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={i} 
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-10 rounded-[40px] group relative overflow-hidden cursor-pointer"
              >
                {/* Internal Glow */}
                <div className={cn("absolute -top-20 -right-20 w-40 h-40 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20", stat.color.replace('text-', 'bg-'))} />
                
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className={cn("p-4 rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors", stat.bg)}>
                    <Icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-space font-black text-white/20 uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                    <div className="flex items-center justify-end gap-2 text-[10px] font-space font-black text-secondary">
                      <TrendingUp size={14} />
                      {stat.trend}
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-6xl font-space font-black text-white block tracking-tighter mb-1">{stat.value}</h3>
                  <p className="text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em]">{stat.unit}</p>
                </div>

                {/* Tactical Decor */}
                <div className="absolute bottom-6 right-6 opacity-5 group-hover:opacity-20 transition-opacity duration-700">
                  <BarChart3 size={48} className={stat.color} />
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Performance Visualization */}
          <motion.section variants={itemVariants} className="lg:col-span-2 glass-strong p-12 rounded-[56px] border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent" />
            
            <div className="flex justify-between items-start mb-16 relative z-10">
              <div>
                <h2 className="text-4xl font-space font-black text-white uppercase tracking-tighter mb-2">Performance Load</h2>
                <p className="text-[10px] font-space font-black text-white/40 uppercase tracking-[0.4em]">Operational intensity across the current cycle</p>
              </div>
              <div className="flex gap-4">
                {['D', 'W', 'M'].map((p) => (
                  <button key={p} className={cn(
                    "w-10 h-10 rounded-xl font-space font-black text-[10px] flex items-center justify-center transition-all border",
                    p === 'W' ? "bg-white text-black border-white" : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                  )}>{p}</button>
                ))}
              </div>
            </div>
            
            <div className="h-80 flex items-end justify-between gap-6 relative z-10">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => {
                const height = [60, 45, 85, 30, 55, 90, 40][i];
                const isPeak = height > 80;
                return (
                  <div key={day} className="flex-1 group/bar relative h-full flex flex-col justify-end">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all transform translate-y-2 group-hover/bar:translate-y-0">
                      <div className="bg-white text-black px-3 py-1.5 rounded-xl font-space font-black text-[11px] shadow-xl">
                        {height}%
                      </div>
                      <div className="w-2 h-2 bg-white rotate-45 mx-auto -mt-1 shadow-xl" />
                    </div>
                    
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                      className={cn(
                        "w-full rounded-2xl relative overflow-hidden group-hover/bar:scale-x-105 transition-transform",
                        isPeak 
                          ? 'bg-gradient-to-t from-secondary/40 to-secondary shadow-[0_0_40px_rgba(78,205,196,0.3)]' 
                          : 'bg-gradient-to-t from-[#6C63FF]/40 to-[#6C63FF]'
                      )}
                    >
                      {/* Scanline Effect on Bars */}
                      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px]" />
                    </motion.div>
                    
                    <span className="block mt-6 text-center text-[10px] font-space font-black text-white/20 group-hover/bar:text-white transition-colors tracking-[0.3em]">{day}</span>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Tactical Objectives */}
          <motion.section variants={itemVariants} className="space-y-8">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-space font-black text-white uppercase tracking-tighter">Tactical Brief</h2>
              <button className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all text-white/40 hover:text-white">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <div className="space-y-5">
              {[
                { title: 'HYPERTROPHY PHASE', duration: '45m', kcal: '600', icon: Zap, color: 'text-[#6C63FF]', bg: 'bg-[#6C63FF]/10' },
                { title: 'V02 MAX SPRINT', duration: '30m', kcal: '450', icon: Activity, color: 'text-secondary', bg: 'bg-secondary/10' },
                { title: 'NEURAL RECOVERY', duration: '20m', kcal: '120', icon: Shield, color: 'text-white/40', bg: 'bg-white/5' },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 10 }}
                  className="glass-card p-6 rounded-[32px] flex items-center gap-6 group cursor-pointer border border-white/5 hover:border-[#6C63FF]/30 transition-all"
                >
                  <div className={cn("w-16 h-16 rounded-[22px] flex items-center justify-center transition-all group-hover:scale-110", item.bg)}>
                    <item.icon className={cn("w-7 h-7", item.color)} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-space font-black text-white uppercase tracking-tight mb-1">{item.title}</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Timer size={12} className="text-white/20" />
                        <span className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest">{item.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Flame size={12} className="text-white/20" />
                        <span className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest">{item.kcal} KCAL</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#6C63FF] transition-all">
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white" />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-strong p-8 rounded-[40px] border border-[#6C63FF]/30 bg-gradient-to-br from-[#6C63FF]/20 to-transparent relative overflow-hidden"
            >
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[size:100%_2px] pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse shadow-[0_0_10px_#6C63FF]" />
                <span className="text-[10px] font-space font-black text-[#6C63FF] uppercase tracking-[0.4em]">NEURAL CORE INSIGHT</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed font-lexend italic">
                "Subject shows optimal cardiovascular efficiency. Recommended: Increase load by 15% for the upcoming Hypertrophy mission."
              </p>
            </motion.div>
          </motion.section>
        </div>
      </motion.main>
    </div>
  );
}
