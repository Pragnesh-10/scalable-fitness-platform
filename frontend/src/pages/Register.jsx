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
      console.log('🚀 Attempting registration with:', { email: data.email, name: data.name });
      const result = await register(data);
      console.log('✅ Registration successful:', result);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Registration error:', err);
      console.log('Response data:', err.response?.data);
      const message = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || err.message || 'Registration failed';
      console.log('Extracted message:', message);
      setError(message);
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
