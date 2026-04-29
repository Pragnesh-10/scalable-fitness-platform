import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { SignIn2 } from '../components/ui/SignIn2';

export default function Login() {
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSignIn = async (email, password) => {
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Invalid credentials';
      throw new Error(message);
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
          <Link to="/register" className="text-[#6C63FF] hover:text-white transition-colors underline underline-offset-8">
            INITIALIZE ENROLLMENT
          </Link>
        </p>
      </div>
    </div>
  );
}
