import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/materi', icon: 'auto_stories', label: 'Materi' },
    { path: '/games', icon: 'sports_esports', label: 'Game' },
    { path: '/evaluation', icon: 'school', label: 'Evaluasi' },
    { path: '/leaderboard', icon: 'leaderboard', label: 'Rank' },
    { path: '/profile', icon: 'person', label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-1 py-2 md:hidden glass-panel rounded-b-none border-x-0 border-b-0 pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-primary scale-110'
                : 'text-on-surface opacity-60 hover:opacity-100 hover:bg-glass'
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
