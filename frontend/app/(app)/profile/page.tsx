'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { User, Shield, Watch, LogOut, ChevronRight, TrendingUp, Trophy, Sun, Hash, Flame } from 'lucide-react';

type UserProfile = {
  _id?: string;
  name?: string;
  role?: string;
};

type DeviceConnection = {
  deviceType: string;
  accessToken?: string;
  connectedAt?: Date;
  isActive?: boolean;
  status?: string;
};

type ProfileData = {
  age?: number | string;
  weight?: number | string;
  height?: number | string;
  fitnessGoals?: string;
  experienceLevel?: string;
  deviceConnections?: DeviceConnection[];
};

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<ProfileData>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const WEARABLES = [
    { id: 'apple_health', name: 'Apple Health', icon: <Sun className="w-5 h-5" /> },
    { id: 'google_fit', name: 'Google Fit', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'fitbit', name: 'Fitbit', icon: <Watch className="w-5 h-5" /> },
    { id: 'garmin', name: 'Garmin', icon: <Trophy className="w-5 h-5" /> }
  ];

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/user/profile');
      setUser(data.user);
      setProfile(data.profile || { deviceConnections: [] });
    } catch (err) {
      console.error('Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDeviceToggle = async (deviceId: string) => {
    const existingConnections = profile.deviceConnections || [];
    const isConnected = existingConnections.some((d: DeviceConnection) => d.deviceType === deviceId && d.isActive);
    
    let newConnections;
    if (isConnected) {
      newConnections = existingConnections.map((d: DeviceConnection) => 
        d.deviceType === deviceId ? { ...d, isActive: false } : d
      );
    } else {
      const exists = existingConnections.some((d: DeviceConnection) => d.deviceType === deviceId);
      if (exists) {
        newConnections = existingConnections.map((d: DeviceConnection) => 
          d.deviceType === deviceId ? { ...d, isActive: true } : d
        );
      } else {
        newConnections = [
           ...existingConnections, 
           { 
             deviceType: deviceId, 
             accessToken: `pending_auth_${deviceId}`,
             connectedAt: new Date(), 
             isActive: true,
             status: 'awaiting_auth'
           }
        ];
      }
    }

    try {
      await api.put('/user/profile', { deviceConnections: newConnections });
      setProfile({ ...profile, deviceConnections: newConnections });
    } catch (err) {
      console.error('Failed to toggle device sync');
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (!user) return <div className="flex h-screen items-center justify-center bg-[#030303] text-[#6C63FF]/50 animate-pulse font-space text-2xl uppercase tracking-widest">Loading Athlete Profile...</div>;

  return (
    <div className="min-h-screen bg-[#030303] text-[#e5e2e1] pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 w-full bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black italic tracking-tighter text-white font-space uppercase">FITPULSE</span>
        </div>
        <button onClick={logout} className="font-space font-bold tracking-tight text-[#6C63FF] hover:text-[#4ECDC4] transition-colors flex items-center gap-2">
          LOGOUT <LogOut className="w-4 h-4" />
        </button>
      </header>

      <main className="px-6 max-w-2xl mx-auto space-y-12 pt-8">
        {/* User Profile Header */}
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] purple-glow shadow-[0_0_20px_rgba(108,99,255,0.2)]">
              <div className="w-full h-full rounded-full border-4 border-[#030303] overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNjdhLA_377YHf72Z-1HCblF3jl5FYDCx_0UgCzHZHnu7fZfv0oLezgoHspwNXoW2ogumHvZS0Wli7Bk-pqFaqonp6cP_ZUtnYa4viN5-RC_e-Ryd5FDdXkhq2NT9asUx48-FSbkboLSUr44q2QVdt3AKQIXSQRR4zwa--tB5PvFLLQzIeq_VWZo4hvJUA8zGsVLTD901qEYZY-QluSg45UjpaiRomuGXxoGjLSVKoYjNYdCwtosiKjIrNiPM4VXbYH_31dzHPLcaX" 
                  alt="Profile" 
                />
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#4ECDC4] text-[#00201e] px-3 py-1 rounded-full text-[10px] font-space font-bold shadow-lg uppercase tracking-widest">
              LEVEL 42
            </div>
          </div>
          <div>
            <h2 className="font-space text-4xl font-black text-white">{user.name}</h2>
            <p className="font-space text-[10px] text-secondary tracking-widest uppercase mt-1 font-bold">Elite Athlete</p>
          </div>
        </section>

        {/* Personal Records (PRs) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-space text-2xl font-bold text-white uppercase tracking-tight">Personal Records</h3>
            <Trophy className="w-5 h-5 text-secondary" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Bench', value: '120', unit: 'kg' },
              { label: 'Deadlift', value: '180', unit: 'kg' },
              { label: 'Squat', value: '150', unit: 'kg' }
            ].map((pr, i) => (
              <div key={i} className="glass-card rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
                <p className="text-[10px] font-space font-bold text-white/50 uppercase tracking-widest">{pr.label}</p>
                <p className="text-xl font-space font-black text-white">{pr.value}<span className="text-xs text-secondary ml-0.5 font-normal">{pr.unit}</span></p>
              </div>
            ))}
          </div>
        </section>

        {/* Monthly Gains Chart */}
        <section className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-space font-bold text-white/60 uppercase tracking-widest">Strength Index</p>
              <h3 className="text-2xl font-space font-bold text-white">+12.4% <span className="text-secondary text-sm font-normal">this month</span></h3>
            </div>
            <div className="bg-secondary/10 px-3 py-3 rounded-full border border-secondary/20">
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <div className="h-32 w-full relative flex items-end justify-between px-2">
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              <path 
                className="drop-shadow-[0_0_8px_rgba(78,205,196,0.4)]" 
                d="M 0 100 Q 50 80, 100 90 T 200 40 T 300 10" 
                fill="none" 
                stroke="url(#cyan-gradient)" 
                strokeLinecap="round" 
                strokeWidth="4" 
              />
              <defs>
                <linearGradient id="cyan-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#4ECDC4" />
                </linearGradient>
              </defs>
            </svg>
            {['OCT', 'NOV', 'DEC'].map(m => (
              <div key={m} className="text-[10px] text-white/30 font-space font-bold mt-36">{m}</div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h3 className="text-2xl font-space font-bold text-white mb-4 uppercase tracking-tight">Achievements</h3>
          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar -mx-6 px-6">
            {[
              { id: 'early_bird', name: 'Early Bird', icon: <Sun className="w-6 h-6" />, color: 'text-[#4ECDC4]', bg: 'bg-[#4ECDC4]/10' },
              { id: 'century', name: 'Century Club', icon: <Hash className="w-6 h-6" />, color: 'text-[#6C63FF]', bg: 'bg-[#6C63FF]/10' },
              { id: 'streak', name: '5-Day Streak', icon: <Flame className="w-6 h-6" />, color: 'text-rose-500', bg: 'bg-rose-500/10' }
            ].map(achievement => (
              <div key={achievement.id} className="flex-shrink-0 w-28 h-36 glass-card rounded-2xl flex flex-col items-center justify-center space-y-3">
                <div className={`w-12 h-12 rounded-full ${achievement.bg} flex items-center justify-center ${achievement.color}`}>
                  {achievement.icon}
                </div>
                <p className="text-[10px] font-space font-bold text-center px-2 text-white uppercase leading-tight">{achievement.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section className="space-y-4">
          <h3 className="text-2xl font-space font-bold text-white mb-2 uppercase tracking-tight">Settings</h3>
          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/5">
            {[
              { id: 'profile', label: 'Personal Data', icon: <User className="w-5 h-5" />, color: 'text-white/50' },
              { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" />, color: 'text-white/50' }
            ].map(item => (
              <button key={item.id} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <span className={`${item.color} group-active:text-secondary`}>{item.icon}</span>
                  <span className="font-lexend text-white">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20" />
              </button>
            ))}
            
            {/* Device Toggle */}
            <div className="p-5 space-y-4">
              <span className="text-[10px] font-space font-bold text-secondary uppercase tracking-widest block">Connected Devices</span>
              <div className="space-y-3">
                {WEARABLES.map(wearable => {
                  const isActive = profile.deviceConnections?.some((d: DeviceConnection) => d.deviceType === wearable.id && d.isActive);
                  return (
                    <button 
                      key={wearable.id}
                      onClick={() => handleDeviceToggle(wearable.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isActive 
                          ? 'border-secondary/30 bg-secondary/10' 
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-secondary' : 'text-white/40'}>{wearable.icon}</span>
                        <span className={`font-lexend text-sm ${isActive ? 'text-white' : 'text-white/60'}`}>{wearable.name}</span>
                      </div>
                      <span className={`text-[10px] font-space font-bold uppercase tracking-widest ${isActive ? 'text-secondary' : 'text-white/30'}`}>
                        {isActive ? 'Active' : 'Link'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
