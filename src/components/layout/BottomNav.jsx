import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { LogOut } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const { signOut } = useStore();

  const navItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '#', icon: 'auto_stories', label: 'Materi' },
    { path: '/play', icon: 'sports_esports', label: 'Evaluasi' },
    { path: '/leaderboard', icon: 'leaderboard', label: 'Rank' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-2 py-3 md:hidden glass-panel rounded-b-none border-x-0 border-b-0 pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'text-primary scale-110' 
                : 'text-on-surface opacity-70 hover:opacity-100 hover:bg-glass'
            }`}
          >
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
            <span className="text-[10px] font-bold mt-1">{item.label}</span>
          </Link>
        );
      })}
      {/* Logout button in nav for mobile */}
      <button 
        onClick={signOut}
        className="flex flex-col items-center justify-center p-2 rounded-xl text-error opacity-70 hover:opacity-100 transition-all"
      >
        <LogOut className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-bold">Keluar</span>
      </button>
    </nav>
  );
}
