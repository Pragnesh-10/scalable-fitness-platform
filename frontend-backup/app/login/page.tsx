'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store';
import { SignIn2 } from '@/components/ui/clean-minimal-sign-in';

export default function LoginPage() {
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSignIn = async (email: string, password: string) => {
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const maybeErr = err as { response?: { data?: { errors?: Array<{ msg?: string }>; error?: string } } };
      if (!maybeErr.response) {
        throw new Error('Network error: Cannot connect to the server.');
      }
      const data = maybeErr.response?.data;
      if (data?.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]?.msg || 'Invalid credentials');
      } else {
        throw new Error(data?.error || 'Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6C63FF]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
      
      <div className="relative z-10 w-full flex items-center justify-center">
        <SignIn2 
          onSubmit={handleSignIn} 
          isLoading={isLoading}
          error={error}
        />
      </div>
      <div className="absolute bottom-8 text-center text-[10px] font-space font-bold uppercase tracking-widest text-white/20">
        <p>
          NEW OPERATIVE?{' '}
          <Link href="/register" className="text-[#6C63FF] hover:text-white transition-colors underline underline-offset-8">
            INITIALIZE ENROLLMENT
          </Link>
        </p>
      </div>
    </div>
  );
}
