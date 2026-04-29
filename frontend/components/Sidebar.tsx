'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Target, Activity, Users, UserCircle, 
  LogOut, Flame, ClipboardEdit, Trophy, Zap, Info, 
  Menu, X, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loadFromStorage, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Sync collapsed state with document for layout adjustment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDesktop = window.innerWidth >= 768;
      document.documentElement.style.setProperty(
        '--sidebar-width', 
        isDesktop ? (isCollapsed ? '80px' : '256px') : '0px'
      );
    }
  }, [isCollapsed]);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const NAV_ITEMS = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
    { href: '/workouts', icon: Flame, label: 'WORKOUTS' },
    { href: '/analytics', icon: Activity, label: 'ANALYTICS' },
    { href: '/plans', icon: ClipboardEdit, label: 'TACTICAL PLANS' },
    { href: '/community', icon: Users, label: 'COMMUNITY' },
    { href: '/profile', icon: UserCircle, label: 'PROFILE' },
  ];

  const SidebarContent = ({ collapsed = false }) => (
    <div className="flex flex-col h-full overflow-x-hidden">
      <div className={cn("flex items-center gap-3 mb-12 px-2", collapsed ? "justify-center" : "")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex-shrink-0 flex items-center justify-center shadow-lg shadow-[#6C63FF]/20">
          <Zap className="w-5 h-5 text-white" fill="currentColor" />
        </div>
        {!collapsed && <span className="text-xl font-black italic tracking-tighter text-white font-space uppercase">FITPULSE</span>}
      </div>

      <nav className="flex-1 space-y-1">
        {!collapsed && <p className="text-[10px] font-space font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-2">MAIN OPS</p>}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "flex items-center rounded-2xl font-space font-bold text-[11px] tracking-widest transition-all duration-300 group",
                collapsed ? "justify-center p-3 mb-2" : "px-4 py-3 mb-1",
                isActive 
                  ? "bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
              title={collapsed ? item.label : ""}
            >
              <Icon className={cn("transition-transform group-hover:scale-110 flex-shrink-0", collapsed ? "w-5 h-5" : "mr-3 w-4 h-4", isActive ? "text-[#6C63FF]" : "text-white/20 group-hover:text-white/60")} />
              {!collapsed && item.label}
            </Link>
          );
        })}

        {user?.role === 'coach' && (
          <div className={collapsed ? "pt-4" : "pt-8"}>
            {!collapsed && <p className="text-[10px] font-space font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-2">COMMAND</p>}
            <Link 
              href="/coach" 
              className={cn(
                "flex items-center rounded-2xl font-space font-bold text-[11px] tracking-widest transition-all duration-300 group",
                collapsed ? "justify-center p-3" : "px-4 py-3",
                pathname.startsWith('/coach') ? "bg-secondary/10 text-secondary border border-secondary/20" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
              title={collapsed ? "ROSTER" : ""}
            >
              <Target className={cn("transition-transform group-hover:scale-110 flex-shrink-0", collapsed ? "w-5 h-5" : "mr-3 w-4 h-4", pathname.startsWith('/coach') ? "text-secondary" : "text-white/20 group-hover:text-white/60")} />
              {!collapsed && "ROSTER"}
            </Link>
          </div>
        )}
      </nav>

      <div className="mt-auto pt-8">
        <div className={cn("glass-card rounded-2xl p-4 mb-6", collapsed ? "p-2" : "p-4")}>
          <div className={cn("flex items-center gap-3", collapsed ? "justify-center mb-0" : "mb-3")}>
            <div className={cn("rounded-full border-2 border-[#6C63FF]/30 p-0.5 flex-shrink-0", collapsed ? "w-8 h-8" : "w-10 h-10")}>
              <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center font-space font-black text-[#6C63FF] text-[10px]">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-[11px] font-space font-black text-white truncate uppercase tracking-tighter">{user?.name || 'ATHLETE'}</p>
                <p className="text-[9px] font-space font-bold text-secondary uppercase tracking-widest">LEVEL 42</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] animate-pulse" />
            </div>
          )}
        </div>
        
        <button 
          onClick={logout} 
          className={cn(
            "w-full flex items-center justify-center gap-2 font-space font-bold text-[10px] text-white/40 hover:text-[#6C63FF] transition-colors uppercase tracking-[0.2em]",
            collapsed ? "p-2" : ""
          )}
          title={collapsed ? "LOGOUT" : ""}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "TERMINATE SESSION"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex bg-[#030303] border-r border-white/5 h-screen fixed left-0 top-0 overflow-y-auto flex-col z-[100] transition-all duration-500 ease-in-out group/sidebar",
        isCollapsed ? "w-20 p-4" : "w-64 p-6"
      )}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#6C63FF] text-white flex items-center justify-center shadow-lg opacity-0 group-hover/sidebar:opacity-100 transition-opacity z-[110]"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-[110] p-3 rounded-2xl glass-strong border border-white/10 text-white shadow-xl"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[101] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={cn(
        "md:hidden fixed top-0 left-0 h-screen w-72 bg-[#030303] border-r border-white/10 z-[105] p-6 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>
    </>
  );
}
