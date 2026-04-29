"use client" 

import * as React from "react"
import { useState } from "react";
import { LogIn, Lock, Mail, Activity, Zap, ChevronRight, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface SignIn2Props {
  onSubmit?: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}
 
const SignIn2 = ({ onSubmit, isLoading = false, error: externalError = "" }: SignIn2Props = {}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(externalError);
 
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
 
  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      setError("PLEASE ENTER BOTH ID AND ACCESS KEY.");
      return;
    }
    if (!validateEmail(email)) {
      setError("INVALID COMMUNICATION LINK PROTOCOL.");
      return;
    }
    setError("");
    
    if (onSubmit) {
      try {
        await onSubmit(email, password);
      } catch (err) {
        setError(err instanceof Error ? err.message : "AUTHORIZATION FAILED");
      }
    }
  };
 
  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 relative overflow-hidden bg-[#030303]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#6C63FF] rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, -5, 0], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary rounded-full blur-[100px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-strong border-white/10 shadow-2xl p-10 flex flex-col items-center text-white rounded-[48px] relative overflow-hidden">
          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6C63FF]/50 to-transparent" />
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] mb-8 shadow-xl shadow-[#6C63FF]/30 relative group"
          >
            <Zap className="w-10 h-10 text-white relative z-10" fill="currentColor" />
            <div className="absolute inset-0 bg-white/20 blur-md rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-space font-black uppercase tracking-tighter mb-2">
              MISSION <span className="text-secondary italic">ACCESS</span>
            </h2>
            <p className="text-white/40 font-lexend text-[10px] uppercase font-bold tracking-[0.4em]">
              RE-ESTABLISH PROTOCOL CONNECTION
            </p>
          </div>

          <form onSubmit={handleSignIn} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest ml-2">CREDENTIAL ID</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#6C63FF] transition-colors">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  placeholder="EMAIL@PROTOCOL.COM"
                  type="email"
                  value={email}
                  className="w-full pl-14 pr-4 py-5 rounded-2xl border border-white/5 bg-white/[0.03] text-white text-sm focus:outline-none focus:border-[#6C63FF]/50 focus:bg-white/[0.07] transition-all font-space font-bold placeholder:text-white/10 uppercase tracking-wider"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest ml-2">ACCESS KEY</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#6C63FF] transition-colors">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  className="w-full pl-14 pr-12 py-5 rounded-2xl border border-white/5 bg-white/[0.03] text-white text-sm focus:outline-none focus:border-[#6C63FF]/50 focus:bg-white/[0.07] transition-all font-space font-bold placeholder:text-white/10"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {(error || externalError) && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4"
                >
                  <Activity className="w-5 h-5 text-rose-500 shrink-0" />
                  <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest leading-tight">
                    {error || externalError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex justify-end pt-1">
              <button type="button" className="text-[9px] font-space font-black text-white/20 uppercase tracking-widest hover:text-[#6C63FF] transition-colors underline underline-offset-4">
                FORGOT ACCESS KEY?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-white text-black font-space font-black py-5 rounded-2xl shadow-2xl hover:bg-[#6C63FF] hover:text-white transition-all uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isLoading ? "AUTHORIZING..." : "INITIALIZE SESSION"}
              {!isLoading && <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          <div className="flex items-center w-full my-10">
            <div className="flex-grow h-px bg-white/5"></div>
            <span className="mx-6 text-[9px] font-space font-black text-white/10 uppercase tracking-[0.4em]">External Hubs</span>
            <div className="flex-grow h-px bg-white/5"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            {[
              { name: 'Google', icon: 'https://www.svgrepo.com/show/475656/google-color.svg' },
              { name: 'Apple', icon: 'https://www.svgrepo.com/show/511330/apple-173.svg' }
            ].map((provider) => (
              <button key={provider.name} className="flex items-center justify-center py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all group">
                <img
                  src={provider.icon}
                  alt={provider.name}
                  className="w-5 h-5 opacity-30 group-hover:opacity-100 transition-opacity invert"
                />
              </button>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-space font-bold text-white/20 uppercase tracking-[0.2em]">
              NEW OPERATIVE?{" "}
              <Link href="/register" className="text-[#6C63FF] hover:text-white transition-colors underline underline-offset-4 ml-1">
                ENROLL NOW
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
 
export { SignIn2 };
