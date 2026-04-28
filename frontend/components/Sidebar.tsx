'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../lib/store';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/workouts', icon: '🏋️', label: 'Log Workout' },
  { href: '/plans', icon: '📋', label: 'My Plans' },
  { href: '/community', icon: '👥', label: 'Community' },
  { href: '/profile', icon: '👤', label: 'Profile' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-white border-r h-screen fixed left-0 top-0 overflow-y-auto flex flex-col p-4 shadow-sm z-50">
      <div className="flex items-center mb-8 px-2 py-4">
        <span className="text-3xl mr-2">⚡</span>
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400">FitPulse</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith(item.href) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
            <span className="mr-3 text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {user?.role === 'coach' && (
          <div className="pt-4 mt-4 border-t border-gray-200 space-y-1">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Coach Tools</p>
            <Link href="/coach" className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/coach') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <span className="mr-3 text-xl">📝</span>
              Client Roster
            </Link>
          </div>
        )}
      </nav>

      {user && (
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg mr-3 shadow-md">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
            <span className="mr-3 text-lg">🚪</span>
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
