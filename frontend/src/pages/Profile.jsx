import { useState, useEffect } from 'react';
import api from '../lib/api';
import { 
  Sparkles,
  Activity,
  User, 
  Shield, 
  Watch, 
  LogOut, 
  ChevronRight, 
  TrendingUp, 
  Trophy, 
  Sun, 
  Hash, 
  Flame,
  Zap,
  Target,
  Settings,
  ShieldCheck,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const WEARABLES = [
    { id: 'apple_health', name: 'Apple Health Pro', icon: <Sun size={20} />, color: 'text-[#4ECDC4]' },
    { id: 'google_fit', name: 'Google Fit Neural', icon: <TrendingUp size={20} />, color: 'text-[#6C63FF]' },
    { id: 'fitbit', name: 'Fitbit Core', icon: <Watch size={20} />, color: 'text-[#FF6B6B]' },
    { id: 'garmin', name: 'Garmin Tactical', icon: <Trophy size={20} />, color: 'text-secondary' }
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

  const handleDeviceToggle = async (deviceId) => {
    const existingConnections = profile.deviceConnections || [];
    const isConnected = existingConnections.some((d) => d.deviceType === deviceId && d.isActive);
    
    let newConnections;
    if (isConnected) {
      newConnections = existingConnections.map((d) => 
        d.deviceType === deviceId ? { ...d, isActive: false } : d
      );
    } else {
      const exists = existingConnections.some((d) => d.deviceType === deviceId);
      if (exists) {
        newConnections = existingConnections.map((d) => 
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#030303] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent" />
        <p className="font-space font-black text-[10px] text-secondary uppercase tracking-[0.6em] animate-pulse relative z-10">Syncing Identity...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#e5e2e1] pb-32 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      {/* Top Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 z-[60] flex justify-between items-center w-full px-12 py-6 bg-black/40 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <User size={20} className="text-white/40" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-white font-space uppercase">ATHLETE PROFILE</span>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, color: '#FF6B6B' }}
          whileTap={{ scale: 0.95 }}
          onClick={logout} 
          className="font-space font-black text-[11px] uppercase tracking-[0.3em] text-[#6C63FF] transition-all flex items-center gap-3"
        >
          LOGOUT <LogOut size={16} />
        </motion.button>
      </motion.header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-32 px-12 max-w-4xl mx-auto space-y-20 relative z-10"
      >
        {/* User Profile Header */}
        <motion.section variants={itemVariants} className="flex flex-col items-center text-center space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#6C63FF] via-[#4ECDC4] to-[#6C63FF] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
            <div className="w-48 h-48 rounded-full p-1.5 bg-gradient-to-tr from-white/10 to-transparent relative z-10 overflow-hidden">
              <div className="w-full h-full rounded-full border-4 border-[#030303] overflow-hidden relative">
                <img 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNjdhLA_377YHf72Z-1HCblF3jl5FYDCx_0UgCzHZHnu7fZfv0oLezgoHspwNXoW2ogumHvZS0Wli7Bk-pqFaqonp6cP_ZUtnYa4viN5-RC_e-Ryd5FDdXkhq2NT9asUx48-FSbkboLSUr44q2QVdt3AKQIXSQRR4zwa--tB5PvFLLQzIeq_VWZo4hvJUA8zGsVLTD901qEYZY-QluSg45UjpaiRomuGXxoGjLSVKoYjNYdCwtosiKjIrNiPM4VXbYH_31dzHPLcaX" 
                  alt="Profile" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-2xl text-[10px] font-space font-black shadow-2xl uppercase tracking-[0.4em] z-20"
            >
              LEVEL 42
            </motion.div>
          </div>
          <div className="space-y-2">
            <h2 className="font-space text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none px-1">{user.name}</h2>
            <div className="flex items-center justify-center gap-4">
              <span className="font-space text-[11px] text-secondary tracking-[0.4em] uppercase font-black">ELITE OPERATIVE</span>
              <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
              <span className="font-space text-[11px] text-white/30 tracking-[0.4em] uppercase font-black">ID: FP-8492-X</span>
            </div>
          </div>
        </motion.section>

        {/* Personal Records (PRs) */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Trophy size={24} className="text-secondary" />
              <h3 className="font-space text-3xl font-black text-white uppercase tracking-tighter italic">BIO-BENCHMARKS</h3>
            </div>
            <span className="text-[10px] font-space font-black text-white/20 uppercase tracking-[0.4em]">PEAK PERFORMANCE VALUES</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'BENCH PRESS', value: '120', unit: 'KG', color: 'text-[#6C63FF]' },
              { label: 'DEADLIFT', value: '180', unit: 'KG', color: 'text-secondary' },
              { label: 'SQUAT', value: '150', unit: 'KG', color: 'text-[#FF6B6B]' }
            ].map((pr, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card rounded-[40px] p-10 flex flex-col items-center justify-center space-y-4 border border-white/5 relative overflow-hidden group shadow-2xl"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-[10px] font-space font-black text-white/30 uppercase tracking-[0.4em] relative z-10">{pr.label}</p>
                <div className="flex items-end gap-2 relative z-10">
                  <span className="text-6xl font-space font-black text-white tracking-tighter">{pr.value}</span>
                  <span className={cn("text-xs font-black mb-2 tracking-[0.2em]", pr.color)}>{pr.unit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Strength Index Visualization */}
        <motion.section variants={itemVariants} className="glass-strong rounded-[56px] p-12 relative overflow-hidden border border-white/5 shadow-3xl group">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_98%,rgba(255,255,255,0.02)_98%)] bg-[size:100%_40px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <TrendingUp size={16} className="text-secondary" />
                <span className="text-[10px] font-space font-black text-secondary uppercase tracking-[0.4em]">STRENGTH ARCHIVE</span>
              </div>
              <h3 className="text-4xl font-space font-black text-white uppercase tracking-tighter italic">+12.4% <span className="text-white/20 text-xl font-normal not-italic tracking-normal">CURRENT_MONTH</span></h3>
            </div>
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:rotate-45 transition-all">
              <Activity className="w-8 h-8 text-white/40" />
            </div>
          </div>
          
          <div className="h-48 w-full relative flex items-end justify-between px-4">
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="drop-shadow-[0_0_15px_rgba(78,205,196,0.3)]" 
                d="M 0 140 Q 150 120, 300 130 T 600 40 T 900 20" 
                fill="none" 
                stroke="url(#profile-gradient)" 
                strokeLinecap="round" 
                strokeWidth="6" 
              />
              <defs>
                <linearGradient id="profile-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="50%" stopColor="#4ECDC4" />
                  <stop offset="100%" stopColor="#6C63FF" />
                </linearGradient>
              </defs>
            </svg>
            {['OCT', 'NOV', 'DEC'].map(m => (
              <div key={m} className="text-[11px] text-white/20 font-space font-black tracking-[0.4em] relative z-10 mb-2">{m}</div>
            ))}
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section variants={itemVariants} className="space-y-10">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Sparkles size={24} className="text-[#6C63FF]" />
              <h3 className="font-space text-3xl font-black text-white uppercase tracking-tighter italic">HONOR REEL</h3>
            </div>
          </div>
          
          <div className="flex overflow-x-auto gap-8 pb-10 hide-scrollbar -mx-12 px-12">
            {[
              { id: 'early_bird', name: 'EARLY STRIKE', icon: <Sun size={28} />, color: 'text-[#4ECDC4]', bg: 'bg-secondary/10' },
              { id: 'century', name: 'CENTURY HUB', icon: <Cpu size={28} />, color: 'text-[#6C63FF]', bg: 'bg-[#6C63FF]/10' },
              { id: 'streak', name: '5-DAY PULSE', icon: <Flame size={28} />, color: 'text-[#FF6B6B]', bg: 'bg-rose-500/10' },
              { id: 'guardian', name: 'SECURE CORE', icon: <Shield size={28} />, color: 'text-white', bg: 'bg-white/10' }
            ].map(achievement => (
              <motion.div 
                key={achievement.id} 
                whileHover={{ scale: 1.05, y: -10 }}
                className="flex-shrink-0 w-44 h-60 glass-card rounded-[40px] flex flex-col items-center justify-center space-y-6 border border-white/5 relative overflow-hidden group shadow-2xl"
              >
                {/* Holographic background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform", achievement.bg, achievement.color)}>
                  {achievement.icon}
                </div>
                <div className="space-y-1 text-center px-4">
                  <p className="text-[10px] font-space font-black text-white uppercase tracking-[0.3em] leading-tight">{achievement.name}</p>
                  <p className="text-[8px] font-space font-black text-white/20 uppercase tracking-[0.2em]">VERIFIED</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tactical Config */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex items-center gap-4 px-4">
            <Settings size={24} className="text-white/40" />
            <h3 className="text-3xl font-space font-black text-white uppercase tracking-tighter italic">Tactical Config</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Primary Settings */}
            <div className="glass-card rounded-[48px] overflow-hidden border border-white/5 shadow-2xl">
              {[
                { id: 'profile', label: 'BIO-DATA INTEGRITY', icon: <User size={20} />, color: 'text-white/50' },
                { id: 'security', label: 'NEURAL SECURITY', icon: <ShieldCheck size={20} />, color: 'text-secondary' },
                { id: 'notifications', label: 'OPS COMMS', icon: <Target size={20} />, color: 'text-[#6C63FF]' }
              ].map(item => (
                <button key={item.id} className="w-full flex items-center justify-between p-10 hover:bg-white/[0.03] transition-all border-b border-white/5 last:border-0 group">
                  <div className="flex items-center gap-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110">
                      <span className={item.color}>{item.icon}</span>
                    </div>
                    <span className="font-space font-black text-[11px] text-white uppercase tracking-[0.4em]">{item.label}</span>
                  </div>
                  <ChevronRight size={20} className="text-white/10 group-hover:text-white transition-all group-hover:translate-x-2" />
                </button>
              ))}
            </div>
            
            {/* Wearable Connectivity */}
            <div className="glass-strong p-10 rounded-[48px] border border-white/5 shadow-3xl space-y-10 relative overflow-hidden">
               {/* Grid Background */}
               <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none opacity-30" />
               
               <div className="flex items-center justify-between relative z-10">
                 <div className="space-y-1">
                   <span className="text-[10px] font-space font-black text-secondary uppercase tracking-[0.6em]">BIO-SYNC HUB</span>
                   <p className="text-white/30 text-[9px] font-space font-black uppercase tracking-[0.3em]">ACTIVE SENSOR LINK</p>
                 </div>
                 <div className="w-12 h-12 rounded-3xl bg-secondary/10 flex items-center justify-center animate-pulse border border-secondary/20">
                   <Zap size={20} className="text-secondary" />
                 </div>
               </div>
               
               <div className="space-y-4 relative z-10">
                 {WEARABLES.map(wearable => {
                   const isActive = profile.deviceConnections?.some((d) => d.deviceType === wearable.id && d.isActive);
                   return (
                     <motion.button 
                       key={wearable.id}
                       whileHover={{ x: 5 }}
                       onClick={() => handleDeviceToggle(wearable.id)}
                       className={cn(
                         "w-full flex items-center justify-between p-6 rounded-[32px] border transition-all group",
                         isActive 
                           ? 'border-secondary/30 bg-secondary/10' 
                           : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                       )}
                     >
                       <div className="flex items-center gap-6">
                         <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                           isActive ? "bg-secondary text-black" : "bg-white/5 text-white/40"
                         )}>
                           {wearable.icon}
                         </div>
                         <div className="text-left">
                           <span className={cn("font-space font-black text-[11px] uppercase tracking-[0.2em] block", isActive ? 'text-white' : 'text-white/40')}>
                             {wearable.name}
                           </span>
                           {isActive && <span className="text-[8px] font-space font-black text-secondary uppercase tracking-[0.3em]">SYNCHRONIZED</span>}
                         </div>
                       </div>
                       <div className={cn(
                         "px-4 py-2 rounded-xl text-[9px] font-space font-black uppercase tracking-[0.2em] transition-all",
                         isActive ? 'bg-secondary/20 text-secondary border border-secondary/20' : 'bg-white/5 text-white/20 border border-white/5'
                       )}>
                         {isActive ? 'ACTIVE' : 'LINK_DEVICE'}
                       </div>
                     </motion.button>
                   );
                 })}
               </div>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}
