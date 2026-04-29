'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Activity, Flame, Timer, Footprints, Bell, MoreHorizontal, ChevronRight, Zap } from 'lucide-react';
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
    return <div className="flex h-screen items-center justify-center bg-[#030303] text-[#6C63FF]/50 animate-pulse font-space text-2xl uppercase tracking-widest">Initialising Pulse...</div>;
  }

  const stats = [
    { label: 'Heart Rate', value: data?.summary?.avgHR || 124, unit: 'BPM', color: 'text-secondary', glow: 'text-glow-cyan', icon: Activity },
    { label: 'Calories', value: data?.summary?.totalCalories || 842, unit: 'KCAL', color: 'text-[#6C63FF]', glow: 'text-glow-purple', icon: Flame },
    { label: 'Active', value: data?.summary?.activeMinutes || 45, unit: 'MINUTES', color: 'text-secondary', glow: 'text-glow-cyan', icon: Timer },
    { label: 'Steps', value: (data?.summary?.totalSteps || 8432).toLocaleString(), unit: 'STEPS', color: 'text-[#6C63FF]', glow: 'text-glow-purple', icon: Footprints },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-[#e5e2e1] pb-32">
      {/* Top Header */}
      <header className="fixed top-0 z-50 flex justify-between items-center w-full px-6 py-4 bg-[#030303]/60 backdrop-blur-2xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#6C63FF]/30">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl1jmkv2EYMTubdoMED-uOj29fZ5sGhp6HiLFkWuBd9ju3qrZguVhZx9PdN66RNo_3lP4yOmmqEsk3TIhmp8B-1-NJYi4cj6M-OWmLvJc6e4IbY3UzGS8l0AITIDgMZrnGtObJ-H6_o7uFd37Pj9SBA8ywnzwctoTeYXYTJPAENsgeuKYotfHKb5jRXwm1xmOBQCcUyhwu_TflJnU4e2mW4qy0gfZjn_37dUSxwAgXH_t-AHB2vf7oIUsyFpTgxAKcUAfFGQsV7LNR" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-black italic bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] bg-clip-text text-transparent font-space tracking-widest uppercase">FITPULSE</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white/70 hover:text-white transition">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-5xl mx-auto space-y-12">
        {/* Welcome & Status */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-space text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
              READY, <span className="text-[#6C63FF]">{user?.name?.split(' ')[0] || 'ATHLETE'}.</span>
            </h1>
            <p className="text-lg text-white/60 font-lexend mt-2">Fuel your ambition today.</p>
          </div>
          <div className="glass-card neo-shadow flex items-center gap-3 px-4 py-2 rounded-full border border-white/5">
            <div className="relative">
              <div className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-[#4ECDC4] rounded-full blur-sm opacity-50"></div>
            </div>
            <span className="text-[10px] font-space font-bold uppercase tracking-widest text-white/60">APPLE WATCH CONNECTED - SYNCING...</span>
          </div>
        </section>

        {/* Stats Bento Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-6 rounded-3xl flex flex-col justify-between h-40 neo-shadow group hover:scale-[1.02] transition-transform">
              <span className={`text-[10px] font-space font-bold uppercase tracking-widest ${stat.color}`}>{stat.label}</span>
              <div>
                <span className={`text-4xl font-space font-black text-white block ${stat.glow}`}>{stat.value}</span>
                <span className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest">{stat.unit}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Weekly Intensity Chart */}
        <section className="glass-card p-8 rounded-[40px] neo-shadow relative overflow-hidden">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-space font-bold text-white uppercase">Weekly Intensity</h2>
              <p className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest">7-Day Performance Trend</p>
            </div>
            <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-space font-bold text-[#4ECDC4] border border-[#4ECDC4]/20">
              PEAK: 98%
            </div>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-3 md:gap-6">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => {
              const height = [60, 45, 85, 30, 55, 90, 40][i];
              const isPeak = height > 80;
              return (
                <div key={day} className="flex-1 bg-white/5 rounded-t-xl relative group">
                  <div 
                    className={`absolute bottom-0 w-full rounded-t-xl transition-all duration-700 ${
                      isPeak 
                        ? 'bg-gradient-to-t from-[#4ECDC4]/20 to-[#4ECDC4] shadow-[0_0_20px_rgba(78,205,196,0.3)]' 
                        : 'bg-gradient-to-t from-[#6C63FF]/20 to-[#6C63FF]'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-space font-bold text-white/30">{day}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recommended Sessions */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-space font-bold text-white uppercase">Recommended Sessions</h2>
            <button className="text-[10px] font-space font-bold text-secondary uppercase tracking-widest hover:text-white transition">VIEW ALL</button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar -mx-6 px-6">
            {[
              { 
                title: 'High-Intensity Interval Training', 
                duration: '30 MIN', 
                level: 'HARD', 
                kcal: '450 KCAL',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJaMJ2zsalRy_HTv3RF_1yqL3R_kgsketWL1Us8RhYyjzqAkVgGl9JHsfHZPXUIdRo-t_q0LMw4Bdle058vZ0PEDK3U5PJn_q5DG6Zyu323Z5S8wtXNTrms91F9NDWf_kVsS5NkHknipN3VAbVYv6paP7j_uH053MFFrN0hJAfjSXMTfZ1qmZnhsLn5vVjoAKqt8K-ol06b-Xzogb_oTGtEWHw96HCpyxniNsNPe6R74csbgjDtiYOBIe169zoXnuXrhh_6go3TmJX'
              },
              { 
                title: 'Power Yoga Flow', 
                duration: '45 MIN', 
                level: 'MODERATE', 
                kcal: '220 KCAL',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv1KQsFxXmVJcdaTdbhNDLitcrUBL85LPvZJeRGTSE2tDeOIyYKYTH7i8Cg_09UrJZDylleMtxz8EiLDaEVgxdx_zw_NV8UPJGZBSrlisF6xLZy0knHvDspSbW3K494rre8fko3T0WPwogGN95cArbbCWl_8MIf9T-iD11AhGyd-BV_-KQc3Mi1gzODnexRr8X-5un5E24k1W97oAxLvzmNmDe3Da9r2S9tpVV5oBthazCU1SRrcAj3iDXbWbrrugJcBbb64Uh0a9y'
              },
              { 
                title: 'Strength Foundations', 
                duration: '50 MIN', 
                level: 'HARD', 
                kcal: '600 KCAL',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gDC8MsiTrdZ6mPRap2Z5MxWzUU1LZo3F3O2e7uSNkYDC3Mh8p4dqPznxNM24aYYFKpYh8rkoo4VRIq750Z47X265jAbuZsKG-N8nU0Yc_03QPOLUcwYU0bMq65CKeU08eCz50jRwzuRfXiTJCPB_-lLMGlAghT9vefAz94qIhoNKPwtOZKcWCnxevDgIWmUE_VUNasME5ntNsSM9FPmoq4AzpCECvb4E-fF68azlU0POacWCuvsJVQ78K2jqMQd4bmLs7S6G7Wpt'
              }
            ].map((workout, i) => (
              <div key={i} className="min-w-[280px] h-[360px] rounded-[32px] overflow-hidden relative group cursor-pointer">
                <img src={workout.img} alt={workout.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-2 mb-3">
                    <span className="glass-card px-3 py-1 rounded-full text-[10px] font-space font-bold text-secondary">{workout.duration}</span>
                    <span className="glass-card px-3 py-1 rounded-full text-[10px] font-space font-bold text-white">{workout.level}</span>
                  </div>
                  <h3 className="text-xl font-space font-bold text-white mb-2 leading-tight">{workout.title}</h3>
                  <div className="flex items-center gap-2 text-white/60">
                    <Zap className="w-3 h-3 text-secondary" />
                    <span className="text-[10px] font-space font-bold uppercase tracking-widest">{workout.kcal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
