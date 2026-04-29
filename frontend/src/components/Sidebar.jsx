import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Target, Activity, Users, UserCircle, 
  LogOut, Flame, ClipboardEdit, Trophy, Zap, 
  Menu, X, ChevronLeft, ChevronRight, Settings, Shield 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, loadFromStorage, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    const updateWidth = () => {
      const isDesktop = window.innerWidth >= 768;
      document.documentElement.style.setProperty(
        '--sidebar-width', 
        isDesktop ? (isCollapsed ? '100px' : '300px') : '0px'
      );
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [isCollapsed]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const NAV_ITEMS = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD', color: 'text-secondary' },
    { href: '/workouts', icon: Flame, label: 'WORKOUTS', color: 'text-orange-500' },
    { href: '/analytics', icon: Activity, label: 'ANALYTICS', color: 'text-secondary' },
    { href: '/plans', icon: ClipboardEdit, label: 'TACTICAL PLANS', color: 'text-[#6C63FF]' },
    { href: '/community', icon: Users, label: 'COMMUNITY', color: 'text-blue-400' },
    { href: '/profile', icon: UserCircle, label: 'PROFILE', color: 'text-white/60' },
  ];

  const SidebarContent = ({ collapsed = false }) => (
    <div className="flex flex-col h-full overflow-x-hidden pt-2">
      {/* Brand Logo */}
      <div className={cn("flex items-center gap-4 mb-10 px-2 transition-all duration-500", collapsed ? "justify-center" : "")}>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex-shrink-0 flex items-center justify-center shadow-lg shadow-[#6C63FF]/20 relative group"
        >
          <Zap className="w-6 h-6 text-white relative z-10" fill="currentColor" />
          <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-2xl font-black italic tracking-tighter text-white font-space uppercase leading-none px-1">FITPULSE</span>
            <span className="text-[8px] font-space font-bold text-[#6C63FF] tracking-[0.4em] mt-1">ELITE CORE</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3">
        {!collapsed && (
          <p className="text-[9px] font-space font-black text-white/20 uppercase tracking-[0.3em] mb-4 px-3 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#6C63FF]"></span>
            MAIN OPS
          </p>
        )}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              to={item.href} 
              className={cn(
                "relative flex items-center rounded-2xl font-space font-bold text-[13px] tracking-[0.1em] transition-all duration-300 group overflow-hidden",
                collapsed ? "justify-center h-14 w-14 mx-auto" : "px-5 py-4 mx-1",
                isActive 
                  ? "bg-gradient-to-r from-[#6C63FF]/20 to-transparent text-white border-l-2 border-[#6C63FF]" 
                  : "text-white/40 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              <Icon className={cn(
                "transition-all duration-500 flex-shrink-0", 
                collapsed ? "w-6 h-6" : "mr-4 w-5 h-5", 
                isActive ? item.color : "text-white/20 group-hover:text-white/60",
                "group-hover:scale-110 group-active:scale-95"
              )} />
              {!collapsed && (
                <span className="relative z-10 transition-colors uppercase">{item.label}</span>
              )}
              {isActive && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-[#6C63FF]/5 blur-xl pointer-events-none"
                />
              )}
            </Link>
          );
        })}

        {user?.role === 'coach' && (
          <div className={collapsed ? "pt-6" : "pt-10"}>
            {!collapsed && (
              <p className="text-[10px] font-space font-black text-white/20 uppercase tracking-[0.3em] mb-4 px-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                COMMAND
              </p>
            )}
            <Link 
              to="/coach" 
              className={cn(
                "flex items-center rounded-2xl font-space font-bold text-[13px] tracking-[0.1em] transition-all duration-300 group",
                collapsed ? "justify-center h-14 w-14 mx-auto" : "px-5 py-4 mx-1",
                pathname.startsWith('/coach') ? "bg-gradient-to-r from-secondary/20 to-transparent text-white border-l-2 border-secondary" : "text-white/40 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              <Target className={cn(
                "transition-all duration-500 flex-shrink-0", 
                collapsed ? "w-6 h-6" : "mr-4 w-5 h-5", 
                pathname.startsWith('/coach') ? "text-secondary" : "text-white/20 group-hover:text-white/60",
                "group-hover:rotate-12"
              )} />
              {!collapsed && "ROSTER"}
            </Link>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="mt-auto pt-8">
        <motion.div 
          whileHover={{ y: -2 }}
          className={cn(
            "glass-strong rounded-[32px] border border-white/5 relative overflow-hidden transition-all duration-500 shadow-2xl",
            collapsed ? "p-3 mx-1" : "p-6 mx-1 mb-8"
          )}
        >
          <div className={cn("flex items-center gap-4", collapsed ? "justify-center" : "")}>
            <div className={cn(
              "rounded-xl border border-[#6C63FF]/30 p-0.5 flex-shrink-0 bg-black/40 relative", 
              collapsed ? "w-11 h-11" : "w-14 h-14"
            )}>
              <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center font-space font-black text-[#6C63FF] text-xl">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-[#030303] shadow-lg" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-space font-black text-white truncate uppercase tracking-tight">{user?.name || 'ATHLETE'}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Shield className="w-3 h-3 text-secondary" />
                  <span className="text-[10px] font-space font-bold text-secondary uppercase tracking-widest">LEVEL 42</span>
                </div>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="mt-5 space-y-2">
              <div className="flex justify-between items-center text-[9px] font-space font-bold text-white/30 uppercase tracking-widest">
                <span>XP PROGRESS</span>
                <span>84%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '84%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#6C63FF] to-secondary rounded-full shadow-[0_0_15px_rgba(108,99,255,0.4)]" 
                />
              </div>
            </div>
          )}
        </motion.div>
        
        <div className={cn("flex gap-3 mb-2", collapsed ? "flex-col items-center" : "px-2")}>
          <button 
            onClick={logout} 
            className={cn(
              "flex items-center justify-center gap-3 rounded-2xl font-space font-black text-[11px] text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all uppercase tracking-[0.2em] group",
              collapsed ? "w-14 h-14" : "flex-1 py-5"
            )}
            title="TERMINATE SESSION"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {!collapsed && "LOGOUT"}
          </button>
          
          <button 
            className={cn(
              "flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-white/20 hover:text-white hover:border-white/10 transition-all shadow-lg",
              collapsed ? "w-14 h-14" : "w-16 h-16"
            )}
            title="SETTINGS"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex bg-[#030303] border-r border-white/5 h-screen fixed left-0 top-0 overflow-y-auto flex-col z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group/sidebar",
        isCollapsed ? "w-[100px] p-5" : "w-[300px] p-8"
      )}>
        {/* Glow behind the sidebar */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#6C63FF]/20 to-transparent shadow-[0_0_20px_rgba(108,99,255,0.1)]" />
        
        <motion.button 
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-24 w-9 h-9 rounded-full bg-[#1a1a1a] border border-white/10 text-white flex items-center justify-center shadow-2xl opacity-0 group-hover/sidebar:opacity-100 transition-all z-[110] hover:bg-[#6C63FF] hover:border-[#6C63FF]"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </motion.button>
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-[110] w-12 h-12 rounded-2xl glass-strong border border-white/10 text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[101]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <aside className={cn(
        "md:hidden fixed top-0 left-0 h-screen w-[300px] bg-[#030303] border-r border-white/10 z-[105] p-6 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>
    </>
  );
}
