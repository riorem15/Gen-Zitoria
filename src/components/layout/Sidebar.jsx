import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export default function Sidebar() {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/materi', label: 'Materi', icon: 'auto_stories' },
    { path: '/games', label: 'Play Game', icon: 'sports_esports' },
    { path: '/evaluation', label: 'Evaluasi', icon: 'school' },
    { path: '/leaderboard', label: 'Rank', icon: 'leaderboard' },
    { path: '/profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-surface/50 backdrop-blur-xl border-r border-glass-border h-screen fixed left-0 top-0 transition-all duration-300 z-50 shadow-glass ${isHovered ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5 flex items-center gap-3 border-b border-glass-border h-20">
        <span className="material-symbols-outlined text-4xl text-primary drop-shadow-md">hourglass_top</span>
        {isHovered && (
          <h1 className="text-2xl font-bold tracking-wider whitespace-nowrap">
            <span className="text-gen">Gen</span> <span className="text-zitoria">Zitoria</span>
          </h1>
        )}
      </div>

      <nav className="flex-1 py-6 overflow-hidden">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-6 py-3 transition-all mx-2 rounded-xl ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                      : 'text-on-surface hover:bg-glass hover:text-primary'
                  }`}
                  title={!isHovered ? item.label : ''}
                >
                  <span className="material-symbols-outlined text-2xl shrink-0"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                  {isHovered && <span className="font-bold text-sm whitespace-nowrap">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
