'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Target, Zap, Clock, ShieldCheck, ChevronRight, BrainCircuit, Calendar, ListChecks } from 'lucide-react';

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

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#030303] text-[#6C63FF]/50 animate-pulse font-space text-2xl uppercase tracking-widest">Constructing Tactical Plan...</div>;

  const planSchedule = activePlan?.schedule || {};

  return (
    <div className="min-h-screen bg-[#030303] text-[#e5e2e1] pb-32">
      {/* Top Header */}
      <header className="fixed top-0 z-50 flex justify-between items-center w-full px-6 py-4 bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black italic tracking-tighter text-white font-space uppercase">FITPULSE</span>
        </div>
        <button 
          onClick={handleGeneratePlan} 
          disabled={generating}
          className="bg-[#6C63FF] hover:bg-[#5a52e0] text-white px-6 py-2 rounded-full font-space font-bold text-sm shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all flex items-center gap-2 uppercase tracking-widest disabled:opacity-50"
        >
          {generating ? <Zap className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
          {activePlan ? 'RECALIBRATE' : 'GENERATE MISSION'}
        </button>
      </header>

      <main className="pt-24 px-6 max-w-5xl mx-auto space-y-12">
        {/* Plans Header */}
        <section>
          <h1 className="font-space text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
            TACTICAL <span className="text-secondary">PLAN</span>
          </h1>
          <p className="text-lg text-white/60 font-lexend mt-2 max-w-md">AI-generated mission directives for extreme physical optimization.</p>
        </section>

        {!activePlan ? (
          <section className="h-[60vh] glass-card rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 rounded-full bg-[#6C63FF]/10 flex items-center justify-center mb-6">
              <BrainCircuit className="w-12 h-12 text-[#6C63FF]" />
            </div>
            <h3 className="text-2xl font-space font-bold text-white uppercase mb-4 tracking-tight">System Ready for Deployment</h3>
            <p className="text-white/40 font-lexend max-w-md mb-10 leading-relaxed">Our AI engine will analyze your biometrics and history to construct a high-intensity 4-week tactical program.</p>
            <button onClick={handleGeneratePlan} className="bg-white text-black px-10 py-4 rounded-full font-space font-black text-sm uppercase tracking-widest hover:bg-secondary hover:text-white transition-all">
              INITIALIZE PROTOCOL
            </button>
          </section>
        ) : (
          <div className="space-y-12">
            {/* Mission Stats */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-3xl neo-shadow">
                <span className="text-[10px] font-space font-bold text-[#6C63FF] uppercase tracking-widest block mb-1">FOCUS</span>
                <span className="text-2xl font-space font-black text-white uppercase">{activePlan.planType.replace('_', ' ')}</span>
              </div>
              <div className="glass-card p-6 rounded-3xl neo-shadow border-secondary/20">
                <span className="text-[10px] font-space font-bold text-secondary uppercase tracking-widest block mb-1">INTENSITY</span>
                <span className="text-2xl font-space font-black text-white uppercase">{activePlan.difficulty}</span>
              </div>
              <div className="glass-card p-6 rounded-3xl neo-shadow">
                <span className="text-[10px] font-space font-bold text-[#6C63FF] uppercase tracking-widest block mb-1">DURATION</span>
                <span className="text-2xl font-space font-black text-white uppercase">{activePlan.durationWeeks} WEEKS</span>
              </div>
              <div className="glass-card p-6 rounded-3xl bg-secondary/10 border-secondary/30 flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <span className="font-space font-bold text-secondary uppercase tracking-widest">MISSION ACTIVE</span>
              </div>
            </section>

            {/* Tactical Directives */}
            <section className="glass-card p-8 rounded-[40px] relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-6">
                <ListChecks className="w-6 h-6 text-secondary" />
                <h3 className="text-2xl font-space font-bold text-white uppercase">MISSION DIRECTIVES</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePlan.recommendations?.map((rec: string, i: number) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-secondary/20 transition-all">
                    <div className="mt-1 w-2 h-2 rounded-full bg-secondary"></div>
                    <p className="text-sm text-white/70 font-lexend leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Weekly Timeline */}
            <section>
              <h3 className="text-2xl font-space font-bold text-white mb-8 uppercase tracking-tight">TRAINING SCHEDULE</h3>
              <div className="space-y-6">
                {Object.keys(planSchedule).map((weekKey) => (
                  <div key={weekKey} className="glass-card p-8 rounded-[40px] relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8">
                      <Calendar className="w-5 h-5 text-[#6C63FF]" />
                      <h4 className="text-xl font-space font-bold text-white uppercase">{weekKey.replace('_', ' ')}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {planSchedule[weekKey].map((day: PlanDay, i: number) => (
                        <div key={i} className={`p-5 rounded-3xl border transition-all ${day.type === 'Rest' ? 'bg-white/2 border-white/5' : 'bg-white/5 border-white/10 hover:border-[#6C63FF]/30'}`}>
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest">{day.day}</span>
                            {day.duration > 0 && <span className="text-[10px] font-space font-bold text-secondary uppercase tracking-widest">{day.duration} MIN</span>}
                          </div>
                          <span className={`text-lg font-space font-black uppercase ${day.type === 'Rest' ? 'text-white/20' : 'text-white'}`}>{day.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
