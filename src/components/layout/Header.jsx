import { useStore } from '../../store/useStore';
import { Flame, Moon, Sun } from 'lucide-react';

export default function Header() {
  const { streak, user, isDarkMode, toggleTheme } = useStore();

  return (
    <>
      {/* TopAppBar (Desktop) */}
      <header className="hidden md:flex bg-surface/50 backdrop-blur-xl border-b border-glass-border px-8 py-4 justify-between items-center shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <p className="text-on-surface font-medium text-sm border-l-4 border-primary pl-4 py-1">
            Masa Lalu untuk Masa Depan.
          </p>
        </div>
        <div className="flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">{user.email?.split('@')[0]}</span>
                <span className="text-xs opacity-70">Pelajar Gen Zitoria</span>
              </div>
            </div>
          )}
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-surface-variant/50 hover:bg-surface-variant text-on-surface transition-colors border border-glass-border shadow-sm"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
          
          {/* Streak Indicator */}
          <div className={`flex items-center gap-1.5 glass-panel px-4 py-2 relative overflow-hidden group ${streak > 0 ? 'ring-1 ring-orange-500/50' : ''}`}>
            {streak >= 5 && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 animate-pulse"></div>
            )}
            <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-400'}`} />
            <div className={`text-xl font-black ${streak > 0 ? 'text-orange-500 drop-shadow-md' : 'text-slate-400'}`}>
              {streak}
            </div>
          </div>
        </div>
      </header>

      {/* TopAppBar (Mobile) */}
      <header className="md:hidden bg-surface/80 backdrop-blur-xl border-b border-glass-border fixed top-0 w-full z-40 flex justify-between items-center px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl text-primary">hourglass_top</span>
          <h1 className="text-xl font-bold">
            <span className="text-gen">Gen</span> <span className="text-zitoria">Zitoria</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-1.5 rounded-full bg-surface-variant/50 text-on-surface transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
          <div className={`flex items-center gap-1 glass-panel px-3 py-1 ${streak > 0 ? 'ring-1 ring-orange-500/50' : ''}`}>
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-400'}`} />
            <span className={`text-sm font-bold ${streak > 0 ? 'text-orange-500' : 'text-slate-400'}`}>{streak}</span>
          </div>
        </div>
      </header>
    </>
  );
}
