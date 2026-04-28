'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Target, Activity, Users, UserCircle, LogOut, Flame, Brain, LayoutGrid, ClipboardEdit, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loadFromStorage, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadFromStorage();
    setMounted(true);
  }, [loadFromStorage]);

  if (!mounted) return null; // prevent hydration mismatch

  const NAV_ITEMS = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/workouts', icon: Flame, label: 'Workouts' },
    { href: '/analytics', icon: Activity, label: 'Analytics' },
    { href: '/plans', icon: ClipboardEdit, label: 'My Plans' },
    { href: '/community', icon: Users, label: 'Community' },
    { href: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-white/10 h-screen fixed left-0 top-0 overflow-y-auto flex flex-col shadow-2xl z-50">
      <div className="flex items-center justify-center py-8 mb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="bg-indigo-500/20 p-2 rounded-xl group-hover:bg-indigo-500/30 transition">
            <Trophy className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight">FitPulse</h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-white/50 hover:bg-white/5 hover:text-white/90"
              )}
            >
              <Icon className={cn("mr-3 w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-indigo-400" : "text-white/40 group-hover:text-white/70")} />
              {item.label}
            </Link>
          );
        })}

        {user?.role === 'coach' && (
          <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Coach Tools</p>
            <Link 
              href="/coach" 
              className={cn(
                "flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                pathname.startsWith('/coach') ? "bg-amber-500/10 text-amber-400" : "text-white/50 hover:bg-white/5 hover:text-white/90"
              )}
            >
              <Target className={cn("mr-3 w-5 h-5 transition-transform group-hover:scale-110", pathname.startsWith('/coach') ? "text-amber-400" : "text-white/40 group-hover:text-white/70")} />
              Client Roster
            </Link>
          </div>
        )}
      </nav>

      {user && (
        <div className="mt-auto p-4 bg-gradient-to-t from-black/40 to-transparent">
          <div className="flex items-center px-3 py-3 mb-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg mr-3 shadow-md">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-white/90 truncate">{user.name}</p>
              <p className="text-xs text-white/40 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="w-full flex items-center justify-center px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl text-sm font-semibold transition-all group"
          >
            <LogOut className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
