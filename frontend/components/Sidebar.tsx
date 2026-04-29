'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useEffect } from 'react';
import { LayoutDashboard, Target, Activity, Users, UserCircle, LogOut, Flame, ClipboardEdit, Trophy, Zap, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loadFromStorage, logout } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const NAV_ITEMS = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
    { href: '/workouts', icon: Flame, label: 'WORKOUTS' },
    { href: '/analytics', icon: Activity, label: 'ANALYTICS' },
    { href: '/plans', icon: ClipboardEdit, label: 'TACTICAL PLANS' },
    { href: '/community', icon: Users, label: 'COMMUNITY' },
    { href: '/profile', icon: UserCircle, label: 'PROFILE' },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-[#030303] border-r border-white/5 h-screen fixed left-0 top-0 overflow-y-auto flex-col z-[100] p-6">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" fill="currentColor" />
        </div>
        <span className="text-xl font-black italic tracking-tighter text-white font-space uppercase">FITPULSE</span>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-space font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-2">MAIN OPS</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "flex items-center px-4 py-3 rounded-2xl font-space font-bold text-[11px] tracking-widest transition-all duration-300 group",
                isActive 
                  ? "bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("mr-3 w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-[#6C63FF]" : "text-white/20 group-hover:text-white/60")} />
              {item.label}
            </Link>
          );
        })}

        {user?.role === 'coach' && (
          <div className="pt-8">
            <p className="text-[10px] font-space font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-2">COMMAND</p>
            <Link 
              href="/coach" 
              className={cn(
                "flex items-center px-4 py-3 rounded-2xl font-space font-bold text-[11px] tracking-widest transition-all duration-300 group",
                pathname.startsWith('/coach') ? "bg-secondary/10 text-secondary border border-secondary/20" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <Target className={cn("mr-3 w-4 h-4 transition-transform group-hover:scale-110", pathname.startsWith('/coach') ? "text-secondary" : "text-white/20 group-hover:text-white/60")} />
              ROSTER
            </Link>
          </div>
        )}
      </nav>

      <div className="mt-auto pt-8">
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#6C63FF]/30 p-0.5">
              <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center font-space font-black text-[#6C63FF]">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-space font-black text-white truncate uppercase tracking-tighter">{user?.name || 'ATHLETE'}</p>
              <p className="text-[9px] font-space font-bold text-secondary uppercase tracking-widest">LEVEL 42</p>
            </div>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4]" />
          </div>
        </div>
        
        <button 
          onClick={logout} 
          className="w-full flex items-center justify-center gap-2 font-space font-bold text-[10px] text-white/40 hover:text-[#6C63FF] transition-colors uppercase tracking-[0.2em]"
        >
          <LogOut className="w-3 h-3" />
          TERMINATE SESSION
        </button>
      </div>
    </aside>
  );
}
