'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Activity, Flame, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

interface Analytics {
  summary: { avgHR: number; totalSteps: number };
  dailyMetrics: any[];
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
    return <div className="flex h-[80vh] items-center justify-center text-white/50">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">{user?.name?.split(' ')[0] || 'Athlete'}</span>
        </h1>
        <p className="text-white/60 text-lg">Here is your performance snapshot for the week.</p>
      </header>

      {user?.role === 'coach' && (
        <div className="mb-8 bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-semibold text-indigo-200">Coach Dashboard Alert</h3>
          </div>
          <p className="text-indigo-200/70 mt-2 ml-9">
            You have 3 clients missing their workouts this week.{' '}
            <Link href="/community" className="text-white underline font-medium hover:text-indigo-300 transition">Review their logs</Link>.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#121212] border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-rose-500/50 transition duration-500">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition duration-500">
            <Activity className="w-24 h-24 text-rose-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-1">Avg Heart Rate</h3>
            <p className="text-5xl font-bold text-white mb-2">{Math.round(data?.summary?.avgHR || 112)} <span className="text-xl font-normal text-rose-500">bpm</span></p>
            <p className="text-sm text-green-400 flex items-center gap-1">+2% from last week</p>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition duration-500">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition duration-500">
            <TrendingUp className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-1">Total Steps</h3>
            <p className="text-5xl font-bold text-white mb-2">{(data?.summary?.totalSteps || 42050).toLocaleString()} <span className="text-xl font-normal text-emerald-500">steps</span></p>
            <p className="text-sm text-rose-400 flex items-center gap-1">-5% from last week</p>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-amber-500/50 transition duration-500">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition duration-500">
            <Flame className="w-24 h-24 text-amber-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-1">Workouts Logged</h3>
            <p className="text-5xl font-bold text-white mb-2">{data?.dailyMetrics?.length || 4} <span className="text-xl font-normal text-amber-500">sessions</span></p>
            <p className="text-sm text-green-400 flex items-center gap-1">On track for goal</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Activity</h2>
          <Link href="/workouts" className="text-indigo-400 hover:text-indigo-300 font-medium text-sm transition">View Full Log &rarr;</Link>
        </div>
        
        <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#1a1a1a] border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-white/50">Date</th>
                <th className="px-6 py-4 text-sm font-medium text-white/50">Activity</th>
                <th className="px-6 py-4 text-sm font-medium text-white/50">Duration</th>
                <th className="px-6 py-4 text-sm font-medium text-white/50">Intensity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { date: 'Today', type: 'Endurance Run', duration: '45 min', intensity: 'High' },
                { date: 'Yesterday', type: 'Upper Body Strength', duration: '60 min', intensity: 'Medium' },
                { date: 'Friday', type: 'Active Recovery', duration: '30 min', intensity: 'Low' },
                { date: 'Wednesday', type: 'HIIT Circuit', duration: '25 min', intensity: 'Max' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition">
                  <td className="px-6 py-4 text-white font-medium">{row.date}</td>
                  <td className="px-6 py-4 text-white/80">{row.type}</td>
                  <td className="px-6 py-4 text-white/80">{row.duration}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md backdrop-blur-md border ${
                      row.intensity === 'Low' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                      row.intensity === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                      'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                      {row.intensity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
