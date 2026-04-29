import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import SignupForm from '../components/ui/SignupForm';

export default function Register() {
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRegister = async (data) => {
    setError('');
    try {
      await register(data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      const message = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      throw new Error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 relative overflow-hidden">
      <SignupForm 
        onSubmit={handleRegister} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}
