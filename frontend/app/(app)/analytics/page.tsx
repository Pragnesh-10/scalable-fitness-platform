'use client';

import { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Brain, HeartPulse, Activity, Zap, TrendingUp, Info } from 'lucide-react';
import { motion } from 'framer-motion';

type ChartPoint = { day: string; heartRate: number; steps: number; calories: number };

export default function Analytics() {
  const [metricType, setMetricType] = useState('heartRate');

  const chartData: ChartPoint[] = [
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

  return (
    <div className="min-h-screen bg-[#030303] text-[#e5e2e1] pb-32">
      {/* Top Header */}
      <header className="fixed top-0 z-50 flex justify-between items-center w-full px-6 py-4 bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black italic tracking-tighter text-white font-space uppercase">FITPULSE</span>
        </div>
        <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full border border-white/10">
          <TrendingUp className="w-4 h-4 text-secondary" />
          <span className="text-[10px] font-space font-bold text-white/60 uppercase tracking-widest">PERFORMANCE DELTA: +12.4%</span>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-7xl mx-auto space-y-12">
        {/* Page Title */}
        <section>
          <h1 className="font-space text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
            DEEP <span className="text-secondary">ANALYTICS</span>
          </h1>
          <p className="text-lg text-white/60 font-lexend mt-2 max-w-md">Multi-dimensional telemetry for tactical physical dominance.</p>
        </section>

        {/* Metric Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m) => (
            <button 
              key={m.id}
              onClick={() => setMetricType(m.id)}
              className={`glass-card p-8 rounded-[40px] text-left transition-all border ${metricType === m.id ? 'border-white/20 bg-white/5' : 'border-white/5 opacity-50 hover:opacity-100'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10" style={{ backgroundColor: `${m.color}10` }}>
                  <m.icon className="w-6 h-6" style={{ color: m.color }} />
                </div>
                <div className={`w-2 h-2 rounded-full ${metricType === m.id ? 'animate-pulse' : ''}`} style={{ backgroundColor: m.color }} />
              </div>
              <h3 className="text-xl font-space font-black text-white uppercase mb-1 tracking-tight">{m.label}</h3>
              <p className="text-[10px] font-space font-bold text-white/30 uppercase tracking-widest">{m.sub}</p>
            </button>
          ))}
        </section>

        {/* Chart Visualization */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-10 rounded-[50px] border border-white/10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-space font-black text-white uppercase tracking-tight">TELEMTRY FEED</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metrics.find(m => m.id === metricType)?.color }} />
                  <span className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest">LIVE DATA</span>
                </div>
              </div>
            </div>

            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metrics.find(m => m.id === metricType)?.color} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={metrics.find(m => m.id === metricType)?.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="rgba(255,255,255,0.2)" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontFamily: 'Space Grotesk', fontWeight: 700 }} 
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.2)" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontFamily: 'Space Grotesk', fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', fontFamily: 'Lexend' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={metricType} 
                    stroke={metrics.find(m => m.id === metricType)?.color} 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorMetric)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            {/* AI Intelligence Card */}
            <div className="glass-card p-10 rounded-[50px] border border-secondary/20 bg-secondary/5 relative overflow-hidden flex flex-col group h-full">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full group-hover:bg-secondary/30 transition-all" />
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center mb-8">
                <Brain className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-3xl font-space font-black text-white uppercase tracking-tighter mb-6">NEURAL <br/>INSIGHT</h3>
              <p className="text-white/60 font-lexend leading-relaxed mb-10 text-sm">
                Biological telemetry indicates elevated cardiovascular stress levels during Thursday cycles. Neural engine recommends increasing recovery window by 15% to avoid overtraining syndrome.
              </p>
              <div className="mt-auto">
                <button className="w-full bg-white text-black py-4 rounded-2xl font-space font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all">
                  RECALIBRATE PROTOCOL
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Global Stats Footer */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-[40px] flex items-center gap-6 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Info className="w-5 h-5 text-white/40" />
            </div>
            <div>
              <p className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest mb-1">TOTAL WORKOUT TIME</p>
              <p className="text-2xl font-space font-black text-white uppercase">242.5 HOURS</p>
            </div>
          </div>
          <div className="glass-card p-8 rounded-[40px] flex items-center gap-6 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest mb-1">VO2 MAX ESTIMATE</p>
              <p className="text-2xl font-space font-black text-white uppercase">52.4 ML/KG/MIN</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
