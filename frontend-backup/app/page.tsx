"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Zap, 
  Activity, 
  Target, 
  Trophy, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Globe
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#6C63FF]/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-8 flex justify-between items-center bg-gradient-to-b from-[#030303] to-transparent">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center shadow-lg shadow-[#6C63FF]/20 group-hover:scale-110 transition-transform">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="text-2xl font-space font-black tracking-tighter uppercase italic">FITPULSE</span>
        </div>
        
        <div className="hidden md:flex items-center gap-12 text-[10px] font-space font-black tracking-[0.3em] text-white/40 uppercase">
          <Link href="#features" className="hover:text-[#6C63FF] transition-colors">CAPABILITIES</Link>
          <Link href="#tech" className="hover:text-secondary transition-colors">TECHNOLOGY</Link>
          <Link href="#community" className="hover:text-white transition-colors">COHORT</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="px-6 py-3 rounded-xl font-space font-black text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors">
              RECALL SESSION
            </button>
          </Link>
          <Link href="/register">
            <button className="px-8 py-3.5 rounded-xl bg-white text-black font-space font-black text-[10px] uppercase tracking-widest hover:bg-[#6C63FF] hover:text-white transition-all shadow-xl shadow-white/5">
              ENROLL NOW
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Realistic Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/Users/ypragnesh/.gemini/antigravity/brain/debf5f57-01ca-4acb-bef9-0c4062a6d7b3/realistic_fitness_hero_1777436506277.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-[#030303]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-transparent to-[#030303]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#6C63FF] animate-pulse" />
              <span className="text-[10px] font-space font-black uppercase tracking-[0.3em] text-white/60">SQUADRON STATUS: ACTIVE</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-space font-black tracking-tighter uppercase mb-6 leading-[0.85]">
              BEYOND<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-[#6C63FF]">LIMITS</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl font-lexend text-white/40 leading-relaxed mb-12">
              Next-generation operational intelligence for elite athletes. 
              Track, optimize, and dominate your mission with real-time biometric analysis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 rounded-2xl bg-[#6C63FF] text-white font-space font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#6C63FF]/20 flex items-center gap-3 group"
                >
                  INITIALIZE ACCOUNT
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <button className="px-12 py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-space font-black text-xs uppercase tracking-[0.3em] backdrop-blur-md hover:bg-white/10 transition-all">
                VIEW CAPABILITIES
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Data Stats */}
        <div className="absolute bottom-20 left-0 w-full z-20 hidden lg:block px-12">
          <div className="max-w-7xl mx-auto flex justify-between items-end">
            <div className="flex gap-20">
              {[
                { label: 'ACTIVE USERS', val: '42.8K', sub: '+12% TODAY' },
                { label: 'SESSIONS COMPLETED', val: '1.2M', sub: 'WORLDWIDE' },
                { label: 'COACHES READY', val: '840+', sub: 'VETTED' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="text-[10px] font-space font-black text-white/20 uppercase tracking-[0.3em]">{stat.label}</span>
                  <span className="text-4xl font-space font-black tracking-tighter">{stat.val}</span>
                  <span className="text-[9px] font-space font-bold text-secondary uppercase tracking-widest">{stat.sub}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right">
                <p className="text-[10px] font-space font-black text-white/20 uppercase tracking-[0.3em]">SYSTEM STATUS</p>
                <p className="text-xs font-space font-black text-white uppercase tracking-widest">OPTIMAL PERFORMANCE</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#6C63FF] transition-all">
                <Smartphone size={20} className="text-white/40 group-hover:text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-[10px] font-space font-black text-[#6C63FF] uppercase tracking-[0.5em]">CORE CAPABILITIES</h2>
                <h3 className="text-5xl md:text-7xl font-space font-black uppercase tracking-tighter leading-none">
                  TACTICAL<br />INTELLIGENCE
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-12">
                {[
                  { 
                    icon: Activity, 
                    title: "BIOMETRIC SYNC", 
                    desc: "Seamlessly integrate wearable data for real-time performance tracking and recovery analysis." 
                  },
                  { 
                    icon: Target, 
                    title: "ADAPTIVE PLANS", 
                    desc: "AI-driven workout adjustments based on your current energy levels and long-term targets." 
                  },
                  { 
                    icon: ShieldCheck, 
                    title: "ENCRYPTED COACHING", 
                    desc: "Direct, secure communication channels with elite commanders for personalized strategy." 
                  }
                ].map((feat, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#6C63FF] group-hover:border-[#6C63FF] transition-all">
                      <feat.icon size={24} className="text-[#6C63FF] group-hover:text-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-space font-black uppercase tracking-tight">{feat.title}</h4>
                      <p className="text-white/40 font-lexend leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[40px] glass-strong border-white/5 relative overflow-hidden p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6C63FF]/20 to-transparent" />
                {/* Mock UI Element */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-space font-black text-white/20 uppercase tracking-widest">MISSION LOAD</p>
                      <p className="text-4xl font-space font-black tracking-tighter italic text-secondary">ACTIVE</p>
                    </div>
                    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center">
                      <Activity size={24} className="text-secondary animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="h-px bg-white/10 w-full" />
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[9px] font-space font-black text-white/20 uppercase tracking-widest mb-1">INTENSITY</p>
                        <p className="text-2xl font-space font-black tracking-tight">88%</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-space font-black text-white/20 uppercase tracking-widest mb-1">STABILITY</p>
                        <p className="text-2xl font-space font-black tracking-tight">OPTIMAL</p>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ width: ['40%', '80%', '60%'] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="h-full bg-secondary" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6C63FF] rounded-full blur-[100px] opacity-20" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary rounded-full blur-[120px] opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <Zap size={24} className="text-[#6C63FF]" />
            <span className="text-xl font-space font-black tracking-tighter uppercase italic text-white/40">FITPULSE v2.4</span>
          </div>
          
          <div className="flex gap-10 text-[10px] font-space font-black text-white/20 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">SECURITY PROTOCOL</Link>
            <Link href="#" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
            <Link href="#" className="hover:text-white transition-colors">TERMS OF MISSION</Link>
          </div>

          <p className="text-[10px] font-space font-bold text-white/10 uppercase tracking-[0.2em]">
            © 2026 FITPULSE OPERATIONAL COMMAND. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
