'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BarChart3, Users, Target, Zap, ShieldCheck, ArrowRight, BrainCircuit, Activity, HeartPulse } from 'lucide-react';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden font-lexend">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-black italic tracking-tighter text-white font-space uppercase">FITPULSE</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-[10px] font-space font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">CAPABILITIES</Link>
          <Link href="#intel" className="text-[10px] font-space font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">INTELLIGENCE</Link>
          <Link href="/login" className="text-[10px] font-space font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">ACCESS PROTOCOL</Link>
          <Link href="/register" className="bg-white text-black px-6 py-2 rounded-full font-space font-bold text-[10px] uppercase tracking-widest hover:bg-[#6C63FF] hover:text-white transition-all shadow-lg shadow-white/5">
            INITIALIZE
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroGeometric 
        badge="ELITE PERFORMANCE INTERFACE V2.0" 
        title1="ASCEND YOUR" 
        title2="PHYSICAL LIMITS" 
      />
      
      {/* Tactical Stats Overview */}
      <section className="relative z-10 -mt-32 pb-32 px-6">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'ACTIVE OPS', value: '4.2K+', icon: Activity, color: '#6C63FF' },
            { label: 'ENERGY OUTPUT', value: '1.8M+', icon: Zap, color: '#4ECDC4' },
            { label: 'COACH NETWORK', value: '850+', icon: Users, color: '#FF6B6B' },
            { label: 'ACCURACY', value: '99.9%', icon: ShieldCheck, color: '#6C63FF' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={fadeIn}
              className="glass-card p-8 rounded-[40px] border border-white/5 group hover:border-white/10 transition-all cursor-default"
            >
              <div className="flex justify-between items-start mb-4">
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                <span className="text-[10px] font-space font-bold text-white/20 uppercase tracking-widest">LIVE FEED</span>
              </div>
              <h3 className="text-4xl font-space font-black text-white mb-1">{stat.value}</h3>
              <p className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Feature Section: Active Operations */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-space font-bold uppercase tracking-widest">
              <span className="flex h-2 w-2 rounded-full bg-[#6C63FF] mr-3 animate-pulse"></span>
              NEURAL INTERFACE LOADED
            </div>
            <h2 className="text-5xl md:text-7xl font-space font-black tracking-tighter leading-[0.9] uppercase text-white">
              DATA DRIVEN <br/>
              <span className="text-secondary italic">PERFORMANCE</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed max-w-lg font-lexend">
              Connect your biological telemetry to our high-frequency analytical engine. Every set, every beat, every breath—quantified for absolute optimization.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row gap-6">
              <Link href="/register" className="inline-flex items-center justify-center gap-3 bg-[#6C63FF] text-white font-space font-black px-10 py-5 rounded-3xl hover:scale-105 transition-all duration-300 shadow-[0_20px_50px_rgba(108,99,255,0.3)] uppercase text-xs tracking-widest">
                ENROLL NOW
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex -space-x-3 items-center">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#030303] bg-white/10 overflow-hidden relative">
                    <Image src={`https://ui-avatars.com/api/?name=User+${i}&background=121212&color=fff`} alt="User" fill />
                  </div>
                ))}
                <span className="ml-6 text-[10px] font-space font-bold text-white/40 uppercase tracking-widest">+12K ATHLETES</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-[60px] overflow-hidden group border border-white/5 shadow-2xl"
          >
            <Image 
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1470" 
              alt="Elite Athlete" 
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            {/* Real-time HUD Mockup */}
            <div className="absolute top-8 left-8 flex gap-4">
              <div className="glass-card px-4 py-3 rounded-2xl flex items-center gap-3">
                <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-space font-bold text-white/40 uppercase tracking-widest">HR</span>
                  <span className="text-sm font-space font-black text-white">142 BPM</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-12 left-12 right-12 glass-strong p-8 rounded-[40px] border border-white/10 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="w-5 h-5 text-secondary" />
                <span className="text-[10px] font-space font-bold text-secondary uppercase tracking-widest">AI COACH ADVISORY</span>
              </div>
              <p className="text-white/80 font-lexend text-sm leading-relaxed italic">
                &ldquo;Vascular recruitment is currently at 84%. Increase resistance by 2.5kg for the next cycle to trigger hypertrophy threshold.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-48">
          {[
            { title: 'DEEP ANALYTICS', icon: BarChart3, color: '#6C63FF', desc: 'Surgical precision in data tracking. Heart rate variability, metabolic load, and sleep architecture analyzed in real-time.' },
            { title: 'MISSION PROTOCOLS', icon: Target, color: '#FF6B6B', desc: 'Custom 4-week tactical plans designed by elite human coaches and refined by neural network predictions.' },
            { title: 'SECTOR ROSTER', icon: Users, color: '#4ECDC4', desc: 'Join global fitness circles. Competitive leaderboards and synchronized operations with elite squads.' }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-12 rounded-[50px] border border-white/5 hover:border-white/20 transition-all group cursor-pointer overflow-hidden relative"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: feature.color }} />
              <div className="w-16 h-16 rounded-[24px] flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: `${feature.color}10` }}>
                <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
              </div>
              <h3 className="text-2xl font-space font-black mb-6 text-white uppercase tracking-tighter">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed font-lexend">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-48 px-6 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#6C63FF]/[0.02] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-space font-black text-white uppercase tracking-tighter mb-12">
            READY FOR <br/><span className="text-secondary italic">ASCENSION?</span>
          </h2>
          <button className="bg-white text-black px-12 py-6 rounded-full font-space font-black text-sm uppercase tracking-[0.3em] hover:bg-[#6C63FF] hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            INITIALIZE ENROLLMENT
          </button>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[10px] font-space font-bold text-white/20 uppercase tracking-[0.5em]">FITPULSE SYSTEMS © 2026 // ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
}
