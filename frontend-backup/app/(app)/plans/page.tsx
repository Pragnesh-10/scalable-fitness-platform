'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Target, 
  Zap, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  BrainCircuit, 
  Calendar, 
  ListChecks,
  Activity,
  Cpu,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type PlanDay = { day: string; type: string; duration: number };
type ActivePlan = {
  planType: string;
  difficulty: string;
  durationWeeks: number;
  recommendations?: string[];
  schedule?: Record<string, PlanDay[]>;
};

export default function Plans() {
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchActivePlan = async () => {
    try {
      const { data } = await api.get('/plans/active');
      setActivePlan(data.plan);
    } catch (err) {
      console.error('Failed to fetch plan');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivePlan();
  }, []);

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post('/plans/generate', { duration_weeks: 4 });
      setActivePlan(data.plan);
    } catch (err) {
      console.error('Failed to generate plan');
    }
    setGenerating(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#030303] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent" />
        <div className="flex flex-col items-center gap-8 relative z-10">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 rounded-full border-2 border-secondary flex items-center justify-center shadow-[0_0_40px_rgba(78,205,196,0.3)]"
          >
            <BrainCircuit className="w-12 h-12 text-secondary" />
          </motion.div>
          <div className="space-y-2 text-center">
            <p className="font-space text-[10px] font-black text-secondary uppercase tracking-[0.6em] animate-pulse">SYNTHESIZING STRATEGY</p>
            <p className="font-space text-[12px] font-black text-white/20 uppercase tracking-[0.2em]">ACCESSING NEURAL ARCHIVES</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#e5e2e1] pb-32 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      {/* Top Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 z-[60] flex justify-between items-center w-full px-12 py-6 bg-black/40 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/30">
            <Target className="w-6 h-6 text-black" fill="currentColor" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-white font-space uppercase">STRATEGIC COMMAND</span>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGeneratePlan} 
          disabled={generating}
          className="bg-[#6C63FF] text-white px-10 py-3 rounded-2xl font-space font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center gap-3 group disabled:opacity-50"
        >
          {generating ? <Zap size={18} className="animate-spin" /> : <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />}
          {activePlan ? 'RE-OPTIMIZE PLAN' : 'INITIATE NEURAL DRAFT'}
        </motion.button>
      </motion.header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-32 px-12 max-w-7xl mx-auto space-y-16 relative z-10"
      >
        {/* Plans Header */}
        <motion.section variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="space-y-4">
            <h1 className="font-space text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8]">
              TACTICAL <br />
              <span className="text-secondary italic">DIRECTIVES</span>
            </h1>
            <p className="text-white/40 font-lexend text-sm uppercase tracking-[0.4em] font-bold max-w-lg">
              Neural-synthetic training programs engineered for metabolic dominance.
            </p>
          </div>
          
          <AnimatePresence>
            {activePlan && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card flex items-center gap-6 px-10 py-6 rounded-[32px] border border-secondary/20 shadow-2xl"
              >
                <div className="relative">
                  <div className="w-3 h-3 bg-secondary rounded-full animate-pulse shadow-[0_0_15px_#4ECDC4]" />
                  <div className="absolute inset-0 w-3 h-3 bg-secondary rounded-full blur-md opacity-50" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-space font-black uppercase tracking-widest text-white">PLAN ACTIVE</span>
                  <span className="text-[9px] font-space font-bold text-secondary uppercase tracking-[0.3em]">VERSION 2.4.0_DELTA</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {!activePlan ? (
          <motion.section 
            variants={itemVariants}
            className="h-[60vh] glass-strong rounded-[60px] border border-white/5 relative overflow-hidden flex flex-col items-center justify-center text-center p-20 shadow-3xl"
          >
            {/* Background Commander */}
            <div className="absolute inset-0 bg-[url('/assets/generated/ai_commander_tactical_1777436865732.png')] bg-cover opacity-20 grayscale pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent" />
            
            <div className="relative z-10 max-w-2xl space-y-10">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-32 h-32 rounded-[40px] bg-secondary/10 border border-secondary/30 flex items-center justify-center mx-auto shadow-3xl"
              >
                <BrainCircuit className="w-16 h-16 text-secondary" />
              </motion.div>
              <div className="space-y-4">
                <h3 className="text-5xl font-space font-black text-white uppercase tracking-tighter">Command System Offline</h3>
                <p className="text-white/40 font-lexend text-lg leading-relaxed px-10">
                  The neural core requires biometric input to synthesize a custom tactical program. Authorize the draft to begin mission planning.
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGeneratePlan} 
                className="bg-white text-black px-16 py-6 rounded-3xl font-space font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:bg-secondary hover:text-white transition-all"
              >
                INITIATE DRAFT PROTOCOL
              </motion.button>
            </div>
          </motion.section>
        ) : (
          <div className="space-y-16">
            {/* Mission Stats */}
            <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { label: 'OPERATIONAL FOCUS', val: activePlan.planType.replace('_', ' '), icon: Target, color: 'text-[#6C63FF]', bg: 'bg-[#6C63FF]/10' },
                { label: 'INTENSITY LEVEL', val: activePlan.difficulty, icon: Activity, color: 'text-secondary', bg: 'bg-secondary/10' },
                { label: 'MISSION DURATION', val: `${activePlan.durationWeeks} WEEKS`, icon: Clock, color: 'text-white/60', bg: 'bg-white/5' },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -10 }}
                  className="glass-card p-10 rounded-[48px] border border-white/5 relative overflow-hidden group shadow-2xl"
                >
                  <div className={cn("absolute -top-10 -right-10 w-40 h-40 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20", stat.color.replace('text-', 'bg-'))} />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center transition-all group-hover:scale-110", stat.bg)}>
                      <stat.icon className={cn("w-8 h-8", stat.color)} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-space font-black text-white/30 uppercase tracking-[0.3em]">{stat.label}</span>
                      <h4 className="text-3xl font-space font-black text-white uppercase tracking-tighter">{stat.val}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.section>

            {/* Tactical Directives */}
            <motion.section variants={itemVariants} className="glass-strong p-12 rounded-[64px] relative overflow-hidden border border-white/5 shadow-3xl group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#6C63FF]/10 via-transparent to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-12">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <ListChecks size={28} className="text-secondary" />
                  </div>
                  <h3 className="text-4xl font-space font-black text-white uppercase tracking-tighter">NEURAL RECOMMENDATIONS</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {activePlan.recommendations?.map((rec: string, i: number) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 10 }}
                      className="flex items-start gap-6 p-8 bg-white/[0.02] rounded-[32px] border border-white/5 hover:border-secondary/30 transition-all group/rec"
                    >
                      <div className="mt-1 w-6 h-6 rounded-full border-2 border-secondary/20 flex items-center justify-center flex-shrink-0 group-hover/rec:bg-secondary group-hover/rec:border-secondary transition-all">
                        <span className="text-[10px] font-space font-black text-secondary group-hover/rec:text-black">{i+1}</span>
                      </div>
                      <p className="text-lg text-white/60 font-lexend leading-relaxed group-hover/rec:text-white transition-colors">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Weekly Timeline */}
            <motion.section variants={itemVariants} className="space-y-12">
              <div className="flex items-center gap-5 px-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Calendar size={24} className="text-[#6C63FF]" />
                </div>
                <h3 className="text-3xl font-space font-black text-white uppercase tracking-tighter">MISSION TIMELINE</h3>
              </div>
              
              <div className="space-y-10">
                {activePlan.schedule && Object.keys(activePlan.schedule).map((weekKey, idx) => (
                  <motion.div 
                    key={weekKey} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-12 rounded-[56px] relative overflow-hidden border border-white/5 shadow-2xl group"
                  >
                    <div className="absolute top-0 right-0 p-8">
                      <span className="text-8xl font-space font-black text-white/[0.02] leading-none">0{idx + 1}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-12 relative z-10">
                      <div className="w-2 h-10 bg-[#6C63FF] rounded-full shadow-[0_0_15px_#6C63FF]" />
                      <h4 className="text-3xl font-space font-black text-white uppercase tracking-tighter">{weekKey.replace('_', ' ')}</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                      {activePlan.schedule![weekKey].map((day: PlanDay, i: number) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ scale: 1.05, y: -5 }}
                          className={cn(
                            "p-8 rounded-[36px] border transition-all flex flex-col justify-between h-56",
                            day.type === 'Rest' 
                              ? 'bg-white/[0.01] border-white/5 grayscale' 
                              : 'bg-white/[0.03] border-white/10 hover:border-[#6C63FF]/40 hover:bg-white/[0.05]'
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em]">{day.day}</span>
                            {day.duration > 0 && (
                              <div className="flex items-center gap-1 text-secondary">
                                <Timer size={12} />
                                <span className="text-[10px] font-space font-black uppercase">{day.duration}M</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-4">
                            <span className={cn(
                              "text-2xl font-space font-black uppercase tracking-tight block leading-tight",
                              day.type === 'Rest' ? 'text-white/10' : 'text-white'
                            )}>
                              {day.type}
                            </span>
                            {day.type !== 'Rest' && (
                              <div className="flex items-center gap-2 text-[#6C63FF]">
                                <span className="text-[9px] font-space font-black uppercase tracking-widest">INITIALIZE</span>
                                <ArrowRight size={12} />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        )}
      </motion.main>
    </div>
  );
}
