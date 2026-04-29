'use client';

import { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Brain, HeartPulse, Activity } from 'lucide-react';

type ChartPoint = { day: string; heartRate: number; steps: number; calories: number };

export default function Analytics() {
  const [metricType, setMetricType] = useState('heartRate'); // 'heartRate', 'steps', 'calories'

  const chartData: ChartPoint[] = [
    { day: 'Mon', heartRate: 110, steps: 6000, calories: 1800 },
    { day: 'Tue', heartRate: 125, steps: 8500, calories: 2300 },
    { day: 'Wed', heartRate: 115, steps: 7200, calories: 2100 },
    { day: 'Thu', heartRate: 140, steps: 11000, calories: 2800 },
    { day: 'Fri', heartRate: 120, steps: 6500, calories: 1950 },
    { day: 'Sat', heartRate: 145, steps: 14000, calories: 3100 },
    { day: 'Sun', heartRate: 118, steps: 5800, calories: 1750 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">
      <header className="mb-10">
         <h1 className="text-4xl font-extrabold tracking-tight mb-2">Deep Analytics</h1>
         <p className="text-white/60">Visualize your endurance, volume, and physiological stress.</p>
      </header>

      {/* Metric Selector */}
      <div className="flex gap-4 mb-8 bg-[#121212] p-2 rounded-2xl w-fit border border-white/10">
        <button 
          onClick={() => setMetricType('heartRate')} 
          className={`px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition ${metricType === 'heartRate' ? 'bg-rose-500/20 text-rose-400' : 'text-white/50 hover:bg-white/5'}`}
        >
          <HeartPulse className="w-4 h-4" /> Heart Rate
        </button>
        <button 
          onClick={() => setMetricType('steps')} 
          className={`px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition ${metricType === 'steps' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/50 hover:bg-white/5'}`}
        >
          <Activity className="w-4 h-4" /> Daily Volume
        </button>
        <button 
          onClick={() => setMetricType('calories')} 
          className={`px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition ${metricType === 'calories' ? 'bg-amber-500/20 text-amber-400' : 'text-white/50 hover:bg-white/5'}`}
        >
          <Brain className="w-4 h-4" /> Metabolic Output
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#121212] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <h2 className="text-xl font-bold mb-6">
            {metricType === 'heartRate' ? 'Cardiovascular Stress' : metricType === 'steps' ? 'Movement Volume' : 'Caloric Expenditure'}
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metricType === 'heartRate' ? '#f43f5e' : metricType === 'steps' ? '#10b981' : '#f59e0b'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={metricType === 'heartRate' ? '#f43f5e' : metricType === 'steps' ? '#10b981' : '#f59e0b'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={metricType} 
                  stroke={metricType === 'heartRate' ? '#f43f5e' : metricType === 'steps' ? '#10b981' : '#f59e0b'} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMetric)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-gradient-to-b from-indigo-900/40 to-[#121212] border border-indigo-500/20 rounded-2xl p-8 flex flex-col items-start relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />
          <Brain className="w-10 h-10 text-indigo-400 mb-6" />
          <h3 className="text-2xl font-bold mb-4">AI Insight</h3>
          <p className="text-white/70 leading-relaxed mb-6">
            Your cardiovascular load is 12% higher on Thursdays. Consider shifting high-intensity sessions to Tuesday to balance physical stress across the week.
          </p>
          <div className="mt-auto pt-6 border-t border-white/10 w-full">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Recommendation</span>
            <p className="font-semibold">Optimize Work-Rest Ratio &rarr;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
