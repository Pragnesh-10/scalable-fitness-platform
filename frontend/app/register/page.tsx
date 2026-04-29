'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store';
import SignupForm from '@/components/ui/registration';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleRegister = async (data: any) => {
    setError('');
    try {
      await register(data);
      router.push('/dashboard');
    } catch (err: unknown) {
      const maybeErr = err as {
        code?: string;
        message?: string;
        response?: { data?: { errors?: Array<{ msg?: string }>; error?: string } };
      };
      
      if (maybeErr?.code === 'ECONNABORTED' || String(maybeErr?.message || '').toLowerCase().includes('timeout')) {
        throw new Error('Connection timeout. Server is stabilizing. Retry required.');
      }
      
      if (!maybeErr.response) {
        throw new Error('Network error: Sector connection unstable.');
      }
      
      const dataResponse = maybeErr.response.data;
      if (dataResponse?.errors && dataResponse.errors.length > 0) {
        throw new Error(dataResponse.errors[0]?.msg || 'Registration failed');
      } else {
        throw new Error(dataResponse?.error || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6C63FF]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
      
      <div className="relative z-10 w-full">
        <SignupForm 
          onSubmit={handleRegister} 
          isLoading={isLoading} 
          error={error} 
        />
      </div>
    </div>
  );
}
