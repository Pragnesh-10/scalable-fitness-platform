'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../lib/store';
import { useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/workouts', icon: '🏋️', label: 'Log Workout' },
  { href: '/analytics', icon: '📊', label: 'Analytics' },
  { href: '/plans', icon: '📋', label: 'My Plans' },
  { href: '/community', icon: '👥', label: 'Community' },
  { href: '/profile', icon: '👤', label: 'Profile' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, loadFromStorage } = useAuthStore();

  useEffect(() => { loadFromStorage(); }, []);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚡</div>
        <span className="sidebar-logo-text">
          <span className="gradient-text">FitPulse</span>
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <Link key={item.href} href={item.href} className={`nav-item ${pathname.startsWith(item.href) ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      {user && (
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
            <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.9rem', background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user.role === 'coach' ? '🎯 Coach' : '🏃 Member'}
              </div>
            </div>
          </div>
          <button id="sidebar-logout" onClick={logout} className="nav-item" style={{ color: '#FF6B6B', width: '100%' }}>
            <span className="nav-icon">🚪</span>
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
