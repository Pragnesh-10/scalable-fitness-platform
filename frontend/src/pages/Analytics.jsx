import { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { 
  Brain, 
  HeartPulse, 
  Activity, 
  Zap, 
  TrendingUp, 
  Info,
  ShieldAlert,
  Cpu,
  ArrowUpRight,
  Maximize2,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Analytics() {
  const [metricType, setMetricType] = useState('heartRate');
  const [isLive, setIsLive] = useState(true);

  const chartData = [
    { day: 'MON', heartRate: 110, steps: 6000, calories: 1800 },
    { day: 'TUE', heartRate: 125, steps: 8500, calories: 2300 },
    { day: 'WED', heartRate: 115, steps: 7200, calories: 2100 },
    { day: 'THU', heartRate: 140, steps: 11000, calories: 2800 },
    { day: 'FRI', heartRate: 120, steps: 6500, calories: 1950 },
    { day: 'SAT', heartRate: 145, steps: 14000, calories: 3100 },
    { day: 'SUN', heartRate: 118, steps: 5800, calories: 1750 },
  ];

  const metrics = [
    { id: 'heartRate', label: 'HEART RATE', icon: HeartPulse, color: '#FF6B6B', sub: 'PHYSIOLOGICAL STRESS' },
    { id: 'steps', label: 'DAILY VOLUME', icon: Activity, color: '#4ECDC4', sub: 'MOVEMENT QUOTA' },
    { id: 'calories', label: 'METABOLIC', icon: Zap, color: '#6C63FF', sub: 'ENERGY EXPENDITURE' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#e5e2e1] pb-32 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Top Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 z-[60] flex justify-between items-center w-full px-12 py-6 bg-black/40 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B6B] to-[#6C63FF] flex items-center justify-center shadow-lg shadow-rose-500/20">
            <TrendingUp size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-white font-space uppercase">ANALYTICS CORE</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 glass-card px-6 py-2.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_#4ECDC4]" />
            <span className="text-[10px] font-space font-black text-white/60 uppercase tracking-[0.3em]">PERFORMANCE DELTA: +12.4%</span>
          </div>
          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white">
            <Settings size={20} />
          </button>
        </div>
      </motion.header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-32 px-12 max-w-7xl mx-auto space-y-16 relative z-10"
      >
        {/* Page Title */}
        <motion.section variants={itemVariants} className="space-y-4 text-center lg:text-left">
          <h1 className="font-space text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8]">
            DEEP <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-white/40 to-secondary bg-[length:200%_auto] animate-gradient italic">TELEMETRY</span>
          </h1>
          <p className="text-white/40 font-lexend text-sm uppercase tracking-[0.4em] font-bold max-w-xl">
            Biological data aggregation and performance synthesis for dominant physical outcomes.
          </p>
        </motion.section>

        {/* Metric Grid */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((m) => (
            <motion.button 
              key={m.id}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => setMetricType(m.id)}
              className={cn(
                "glass-card p-10 rounded-[48px] text-left transition-all border relative overflow-hidden group",
                metricType === m.id 
                  ? 'border-white/20 bg-white/[0.04] shadow-2xl' 
                  : 'border-white/5 opacity-40 hover:opacity-100'
              )}
            >
              {/* Internal Glow */}
              {metricType === m.id && (
                <div className="absolute -top-20 -right-20 w-40 h-40 blur-[80px] opacity-20 transition-opacity" style={{ backgroundColor: m.color }} />
              )}
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center border border-white/10 transition-all group-hover:scale-110 shadow-xl" style={{ backgroundColor: `${m.color}15` }}>
                  <m.icon className="w-8 h-8" style={{ color: m.color }} />
                </div>
                <div className={cn("w-3 h-3 rounded-full shadow-lg", metricType === m.id ? 'animate-pulse' : '')} style={{ backgroundColor: m.color }} />
              </div>
              <h3 className="text-3xl font-space font-black text-white uppercase mb-2 tracking-tighter">{m.label}</h3>
              <p className="text-[10px] font-space font-black text-white/20 uppercase tracking-[0.3em]">{m.sub}</p>
            </motion.button>
          ))}
        </motion.section>

        {/* Chart Visualization */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 glass-strong p-12 rounded-[64px] border border-white/5 relative overflow-hidden group shadow-3xl">
            {/* Chart Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_98%,rgba(255,255,255,0.02)_98%),linear-gradient(90deg,transparent_98%,rgba(255,255,255,0.02)_98%)] bg-[size:50px_50px] pointer-events-none" />
            
            <div className="flex justify-between items-center mb-16 relative z-10">
              <div className="space-y-1">
                <h2 className="text-4xl font-space font-black text-white uppercase tracking-tighter italic">BIO-SCAN FEED</h2>
                <p className="text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em]">REAL-TIME TELEMETRY STREAMING</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: metrics.find(m => m.id === metricType)?.color, backgroundColor: 'currentColor' }} />
                  <span className="text-[9px] font-space font-black text-white/40 uppercase tracking-widest">ENCRYPTED LINK</span>
                </div>
                <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all">
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>

            <div className="h-[450px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metrics.find(m => m.id === metricType)?.color} stopOpacity={0.6}/>
                      <stop offset="95%" stopColor={metrics.find(m => m.id === metricType)?.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="rgba(255,255,255,0.1)" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontFamily: 'Space Grotesk', fontWeight: 900, letterSpacing: '0.2em' }} 
                    dy={20}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.1)" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontFamily: 'Space Grotesk', fontWeight: 900 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 10, 12, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '24px', 
                      fontFamily: 'Lexend',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={metricType} 
                    stroke={metrics.find(m => m.id === metricType)?.color} 
                    strokeWidth={5}
                    fillOpacity={1} 
                    fill="url(#colorMetric)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-10 flex flex-col">
            {/* AI Intelligence Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-12 rounded-[64px] border border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent relative overflow-hidden flex flex-col group flex-1 shadow-3xl"
            >
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none opacity-30" />
              
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-secondary/10 blur-[100px] rounded-full group-hover:bg-secondary/20 transition-all duration-1000" />
              
              <div className="w-16 h-16 rounded-3xl bg-secondary/20 flex items-center justify-center mb-10 border border-secondary/20 shadow-xl group-hover:rotate-12 transition-transform">
                <Brain className="w-8 h-8 text-secondary" />
              </div>
              
              <h3 className="text-4xl font-space font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">NEURAL <br/>DIAGNOSTIC</h3>
              
              <p className="text-white/60 font-lexend leading-relaxed mb-12 text-lg italic">
                "Biological telemetry indicates elevated cardiovascular load during Thursday cycles. Recalibrating mission intensity to avoid overtraining syndrome."
              </p>
              
              <div className="mt-auto space-y-6 relative z-10">
                <div className="h-px bg-white/5 w-full" />
                <div className="flex justify-between items-center text-[10px] font-space font-black text-secondary uppercase tracking-[0.4em]">
                  <span>RECOVERY SCORE</span>
                  <span>92% OPTIMAL</span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-white text-black py-6 rounded-[30px] font-space font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-secondary hover:text-white transition-all"
                >
                  RE-CALIBRATE HUB
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Global Stats Footer */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            { label: 'TOTAL MISSION TIME', val: '242.5 HOURS', icon: Cpu, color: 'text-white/40' },
            { label: 'VO2 MAX INDEX', val: '52.4 ML/KG/MIN', icon: ShieldAlert, color: 'text-secondary' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.03)' }}
              className="glass-card p-10 rounded-[48px] flex items-center gap-10 border border-white/5 shadow-2xl group transition-all"
            >
              <div className="w-20 h-20 rounded-[28px] bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                <stat.icon className={cn("w-8 h-8", stat.color)} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em]">{stat.label}</p>
                <p className="text-4xl font-space font-black text-white uppercase tracking-tighter">{stat.val}</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={32} className="text-white/10" />
              </div>
            </motion.div>
          ))}
        </motion.section>
      </motion.main>
    </div>
  );
}
