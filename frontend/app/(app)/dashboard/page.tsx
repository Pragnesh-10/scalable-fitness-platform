'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Activity, Flame, Timer, Footprints, Bell, MoreHorizontal, ChevronRight, Zap, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

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
        <div className="orb orb-1 opacity-10 animate-pulse" />
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center animate-spin-slow shadow-lg shadow-[#6C63FF]/20">
            <Zap className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <p className="font-space text-sm font-black text-white/40 uppercase tracking-[0.4em] animate-pulse">Initialising Pulse...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'HEART RATE', value: data?.summary?.avgHR || 124, unit: 'BPM', color: 'text-secondary', icon: Activity, trend: '+4%' },
    { label: 'ENERGY BURN', value: data?.summary?.totalCalories || 842, unit: 'KCAL', color: 'text-[#6C63FF]', icon: Flame, trend: '-2%' },
    { label: 'ACTIVE DURATION', value: data?.summary?.activeMinutes || 45, unit: 'MINS', color: 'text-secondary', icon: Timer, trend: '+12%' },
    { label: 'MVT STEPS', value: (data?.summary?.totalSteps || 8432).toLocaleString(), unit: 'STEPS', color: 'text-[#6C63FF]', icon: Footprints, trend: '+1%' },
  ];

  return (
    <div className="min-h-screen bg-transparent text-[#e5e2e1] pb-32">
      <main className="pt-12 px-8 max-w-7xl mx-auto space-y-12">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-space font-bold text-[#6C63FF] uppercase tracking-[0.3em]">
              <Target className="w-3 h-3" />
              Operational Status: Active
            </div>
            <h1 className="font-space text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              READY, <span className="gradient-text">{user?.name?.split(' ')[0] || 'ATHLETE'}.</span>
            </h1>
            <p className="text-white/40 font-lexend text-sm uppercase tracking-widest font-bold">Synchronizing biological telemetry...</p>
          </div>
          
          <div className="glass-strong flex items-center gap-4 px-6 py-3 rounded-2xl border border-white/5 shadow-xl shadow-black/40">
            <div className="relative">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-secondary rounded-full blur-sm opacity-50"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-space font-bold uppercase tracking-widest text-white">Apple Watch Pro</span>
              <span className="text-[9px] font-space font-bold text-white/40 uppercase tracking-widest">LIVE SYNC ACTIVE</span>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="glass-card p-8 rounded-[32px] group relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#6C63FF]/30 transition-colors`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-space font-bold text-white/30 uppercase tracking-widest">{stat.label}</span>
                    <div className="flex items-center gap-1 text-[10px] font-space font-bold text-secondary">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-5xl font-space font-black text-white block tracking-tighter group-hover:scale-110 transition-transform origin-left duration-500">{stat.value}</span>
                  <span className="text-[10px] font-space font-bold text-white/20 uppercase tracking-[0.2em]">{stat.unit}</span>
                </div>
                {/* Decorative background icon */}
                <Icon className="absolute -right-8 -bottom-8 w-32 h-32 text-white/[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              </div>
            );
          })}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Intensity - Takes 2 columns */}
          <section className="lg:col-span-2 glass-strong p-10 rounded-[48px] border border-white/10 relative overflow-hidden">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-3xl font-space font-black text-white uppercase tracking-tighter">Performance Load</h2>
                <p className="text-[10px] font-space font-bold text-white/40 uppercase tracking-[0.2em]">Weekly biological intensity trend</p>
              </div>
              <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-white/40" />
              </button>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-4">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => {
                const height = [60, 45, 85, 30, 55, 90, 40][i];
                const isPeak = height > 80;
                return (
                  <div key={day} className="flex-1 group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-space font-black text-white bg-white/10 px-2 py-1 rounded-md">{height}%</span>
                    </div>
                    <div 
                      className={`w-full rounded-2xl transition-all duration-1000 ease-out cursor-pointer ${
                        isPeak 
                          ? 'bg-gradient-to-t from-secondary/20 to-secondary shadow-[0_0_30px_rgba(78,205,196,0.3)]' 
                          : 'bg-gradient-to-t from-[#6C63FF]/20 to-[#6C63FF]'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="block mt-4 text-center text-[10px] font-space font-bold text-white/20 group-hover:text-white transition-colors tracking-widest">{day}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tactical Recommendations */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-space font-black text-white uppercase tracking-tighter">Ops Briefing</h2>
              <button className="text-[9px] font-space font-bold text-[#6C63FF] uppercase tracking-widest border-b border-[#6C63FF]/30 pb-0.5 hover:text-white transition-colors">Tactical View</button>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'HYPERTROPHY PHASE', duration: '45m', kcal: '600', icon: Zap, color: 'text-[#6C63FF]' },
                { title: 'V02 MAX INTERVALS', duration: '30m', kcal: '450', icon: Activity, color: 'text-secondary' },
                { title: 'RECOVERY FLOW', duration: '20m', kcal: '120', icon: Timer, color: 'text-white/40' },
              ].map((item, i) => (
                <div key={i} className="glass-card p-5 rounded-3xl flex items-center gap-4 group cursor-pointer border border-white/5 hover:border-white/10 transition-all">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-space font-black text-white uppercase tracking-wider">{item.title}</h4>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[9px] font-space font-bold text-white/30 uppercase tracking-widest">{item.duration}</span>
                      <span className="text-[9px] font-space font-bold text-white/30 uppercase tracking-widest">{item.kcal} KCAL</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>

            <div className="glass-strong p-6 rounded-3xl border border-[#6C63FF]/20 bg-gradient-to-br from-[#6C63FF]/10 to-transparent">
              <p className="text-[10px] font-space font-black text-[#6C63FF] uppercase tracking-widest mb-2">NEURAL INSIGHT</p>
              <p className="text-xs text-white/60 leading-relaxed font-lexend italic">"Your recovery index is at 92%. Optimal conditions for high-intensity power output detected."</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
