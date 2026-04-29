'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BarChart3, Users, Target, Zap, ShieldCheck, ArrowRight, BrainCircuit, Activity, HeartPulse, LogIn, UserPlus } from 'lucide-react';
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
          <Link href="#features" className="text-[10px] font-space font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">FEATURES</Link>
          <Link href="/login" className="text-[10px] font-space font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">LOG IN</Link>
          <Link href="/register" className="bg-white text-black px-6 py-2 rounded-full font-space font-bold text-[10px] uppercase tracking-widest hover:bg-[#6C63FF] hover:text-white transition-all shadow-lg shadow-white/5">
            CREATE ACCOUNT
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20">
        <div className="relative z-10 w-full flex flex-col items-center">
          <HeroGeometric 
            badge="ELITE PERFORMANCE INTERFACE V2.0" 
            title1="TRANSFORM YOUR" 
            title2="FITNESS JOURNEY" 
          />
        </div>
        
        {/* Relocated CTAs: Integrated into the bottom of the hero view */}
        <div className="w-full flex flex-col items-center gap-6 mt-12 md:absolute md:bottom-20 md:left-1/2 md:-translate-x-1/2 z-[100] pb-20 md:pb-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center px-4"
          >
            <Link href="/register" className="inline-flex items-center justify-center gap-3 bg-white text-black font-space font-black px-12 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] uppercase text-xs tracking-widest group text-center whitespace-nowrap">
              <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              CREATE ACCOUNT
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-3 bg-white/5 backdrop-blur-2xl border border-white/10 text-white font-space font-black px-12 py-5 rounded-full hover:bg-white/10 transition-all duration-300 uppercase text-xs tracking-widest text-center whitespace-nowrap">
              <LogIn className="w-4 h-4" />
              LOG IN
            </Link>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.5 }}
            className="text-[10px] font-space font-bold uppercase tracking-[0.4em] text-white text-center"
          >
            AUTHORIZED PERSONNEL ONLY
          </motion.p>
        </div>
      </div>
      
      {/* Tactical Stats Overview */}
      <section className="relative z-10 -mt-16 pb-32 px-6">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {[
            { label: 'ACTIVE USERS', value: '4.2K+', icon: Activity, color: '#6C63FF' },
            { label: 'CALORIES BURNED', value: '1.8M+', icon: Zap, color: '#4ECDC4' },
            { label: 'ELITE COACHES', value: '850+', icon: Users, color: '#FF6B6B' },
            { label: 'UPTIME', value: '99.9%', icon: ShieldCheck, color: '#6C63FF' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={fadeIn}
              className="glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-white/5 group hover:border-white/10 transition-all cursor-default"
            >
              <div className="flex justify-between items-start mb-4">
                <stat.icon className="w-4 h-4 md:w-6 md:h-6" style={{ color: stat.color }} />
                <span className="text-[8px] md:text-[10px] font-space font-bold text-white/20 uppercase tracking-widest">SYSTEM DATA</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-space font-black text-white mb-1">{stat.value}</h3>
              <p className="text-[8px] md:text-[10px] font-space font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Feature Section */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-space font-bold uppercase tracking-widest">
              <span className="flex h-2 w-2 rounded-full bg-[#6C63FF] mr-3 animate-pulse"></span>
              CORE FEATURES LOADED
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-space font-black tracking-tighter leading-[0.9] uppercase text-white">
              DATA DRIVEN <br className="hidden md:block"/>
              <span className="text-secondary italic">PERFORMANCE</span>
            </h2>
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-lg font-lexend mx-auto lg:mx-0">
              Connect your biological telemetry to our high-frequency analytical engine. Every set, every beat, every breath—quantified for absolute optimization.
            </p>
            <div className="pt-4 md:pt-8 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link href="/register" className="inline-flex items-center justify-center gap-3 bg-white text-black font-space font-black px-10 py-5 rounded-3xl hover:scale-105 transition-all duration-300 uppercase text-xs tracking-widest">
                START TRAINING NOW
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[400px] md:h-[600px] rounded-[40px] md:rounded-[60px] overflow-hidden group border border-white/5 shadow-2xl"
          >
            <Image 
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1470" 
              alt="Elite Athlete" 
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 glass-strong p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <BrainCircuit className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
                <span className="text-[8px] md:text-[10px] font-space font-bold text-secondary uppercase tracking-widest">AI INSIGHTS</span>
              </div>
              <p className="text-white/80 font-lexend text-xs md:text-sm leading-relaxed italic">
                &ldquo;Real-time feedback on every rep. Build your legacy with data-driven precision.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-48 px-6 bg-[#050505] relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-space font-black text-white uppercase tracking-tighter mb-8 md:mb-12">
            READY TO <span className="text-secondary italic">START?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Link href="/register" className="bg-white text-black px-10 py-5 md:px-12 md:py-6 rounded-full font-space font-black text-xs md:text-sm uppercase tracking-[0.3em] hover:bg-[#6C63FF] hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              CREATE ACCOUNT
            </Link>
            <Link href="/login" className="bg-white/5 text-white border border-white/10 px-10 py-5 md:px-12 md:py-6 rounded-full font-space font-black text-xs md:text-sm uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
              LOG IN
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity cursor-default">
            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" fill="currentColor" />
            </div>
            <span className="text-xs font-black italic tracking-tighter text-white font-space uppercase">FITPULSE</span>
          </div>
          
          <p className="text-[8px] md:text-[10px] font-space font-bold text-white/20 uppercase tracking-[0.3em] text-center md:text-right">
            FITPULSE SYSTEMS © 2026 // NEURAL-LINKED PERFORMANCE // ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  );
}
