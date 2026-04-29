"use client" 

import * as React from "react"
import { useState } from "react";
import { LogIn, Lock, Mail, Activity, Zap } from "lucide-react";

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
 
  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    
    if (onSubmit) {
      try {
        await onSubmit(email, password);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign in failed");
      }
    } else {
      alert("Sign in successful! (Demo)");
    }
  };
 
  return (
    <div className="w-full max-w-md">
      <div className="glass-strong border-white/10 shadow-2xl p-10 flex flex-col items-center text-white rounded-[40px]">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] mb-6 shadow-lg shadow-[#6C63FF]/20">
          <Zap className="w-8 h-8 text-white" fill="currentColor" />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-space font-black uppercase tracking-tighter mb-1">
            MISSION <span className="text-secondary">ACCESS</span>
          </h2>
          <p className="text-white/40 font-lexend text-[10px] uppercase font-bold tracking-[0.2em]">
            Re-establish protocol connection
          </p>
        </div>

        <div className="w-full space-y-4 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest ml-2">CREDENTIAL ID</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#6C63FF] transition-colors">
                <Mail className="w-4 h-4" />
              </span>
              <input
                placeholder="EMAIL@PROTOCOL.COM"
                type="email"
                value={email}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-[#6C63FF]/50 focus:bg-white/10 transition-all font-space font-bold placeholder:text-white/10 uppercase"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-space font-bold text-white/40 uppercase tracking-widest ml-2">ACCESS KEY</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#6C63FF] transition-colors">
                <Lock className="w-4 h-4" />
              </span>
              <input
                placeholder="••••••••"
                type="password"
                value={password}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-[#6C63FF]/50 focus:bg-white/10 transition-all font-space font-bold placeholder:text-white/10"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {(error || externalError) && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <Activity className="w-4 h-4 text-rose-500" />
              <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide leading-tight">
                {error || externalError}
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <button className="text-[10px] font-space font-bold text-white/20 uppercase tracking-widest hover:text-[#6C63FF] transition-colors">
              FORGOT KEY?
            </button>
          </div>
        </div>

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full bg-white text-black font-space font-black py-4 rounded-2xl shadow-xl hover:bg-[#6C63FF] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-2 group"
        >
          {isLoading ? "AUTHORIZING..." : "INITIALIZE SESSION"}
          {!isLoading && <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </button>

        <div className="flex items-center w-full my-8">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="mx-4 text-[10px] font-space font-bold text-white/10 uppercase tracking-widest">External Links</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <div className="flex gap-4 w-full justify-center">
          {[
            { name: 'Google', icon: 'https://www.svgrepo.com/show/475656/google-color.svg' },
            { name: 'Apple', icon: 'https://www.svgrepo.com/show/511330/apple-173.svg' }
          ].map((provider) => (
            <button key={provider.name} className="flex items-center justify-center w-14 h-14 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all grow group">
              <img
                src={provider.icon}
                alt={provider.name}
                className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export { SignIn2 };
