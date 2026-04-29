'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store';
import { Zap, ShieldCheck, ArrowRight, Info } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const maybeErr = err as { response?: { data?: { errors?: Array<{ msg?: string }>; error?: string } } };
      if (!maybeErr.response) {
        setError('Network error: Cannot connect to the server.');
        return;
      }
      const data = maybeErr.response?.data;
      if (data?.errors && data.errors.length > 0) {
        setError(data.errors[0]?.msg || 'Invalid credentials');
      } else {
        setError(data?.error || 'Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6C63FF]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] shadow-[0_0_30px_rgba(108,99,255,0.4)] mb-6">
            <Zap className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="font-space text-4xl font-black text-white uppercase tracking-tighter">
            MISSION <span className="text-secondary">ACCESS</span>
          </h1>
          <p className="text-white/40 font-lexend mt-2 uppercase tracking-widest text-[10px] font-bold">Secure biometric authentication required</p>
        </div>

        <div className="glass-strong p-8 rounded-[40px] border border-white/10 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3">
              <Info className="w-4 h-4 text-rose-500" />
              <p className="text-xs text-rose-500 font-bold uppercase tracking-wide">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-space font-bold text-white/40 uppercase tracking-[0.2em] ml-2">CREDENTIAL ID</label>
              <input 
                type="email" 
                placeholder="EMAIL@PROTOCOL.COM"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-space font-bold text-sm focus:border-[#6C63FF]/50 focus:bg-white/10 transition-all outline-none uppercase placeholder:text-white/10"
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-space font-bold text-white/40 uppercase tracking-[0.2em] ml-2">ACCESS KEY</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-space font-bold text-sm focus:border-[#6C63FF]/50 focus:bg-white/10 transition-all outline-none uppercase placeholder:text-white/10"
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white text-black py-5 rounded-2xl font-space font-black text-xs uppercase tracking-[0.3em] hover:bg-[#6C63FF] hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? 'VERIFYING...' : (
                <>
                  INITIALIZE SESSION
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-space font-bold text-white/20 uppercase tracking-widest">
              NEW OPERATIVE?{' '}
              <Link href="/register" className="text-[#6C63FF] hover:text-white transition-colors">ENROLL HERE</Link>
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 opacity-20">
          <ShieldCheck className="w-5 h-5 text-white" />
          <span className="h-px w-12 bg-white/20" />
          <p className="text-[8px] font-space font-bold text-white uppercase tracking-[0.4em]">ENCRYPTED PROTOCOL 2.0</p>
          <span className="h-px w-12 bg-white/20" />
        </div>
      </div>
    </div>
  );
}
