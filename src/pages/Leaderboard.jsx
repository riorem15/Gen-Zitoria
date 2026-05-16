import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Trophy, Flame, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AVATAR_COLORS = {
  cat: 'from-orange-400 to-amber-500',
  dog: 'from-amber-500 to-yellow-600',
  rhino: 'from-slate-500 to-gray-600',
  fox: 'from-orange-500 to-red-500',
  owl: 'from-amber-700 to-yellow-800',
  panda: 'from-gray-700 to-slate-800',
};
const AVATAR_EMOJI = { cat:'🐱', dog:'🐶', rhino:'🦏', fox:'🦊', owl:'🦉', panda:'🐼' };

export default function Leaderboard() {
  const { streak, points, initialLevel, user, moduleProgress, profileAvatar, profileName } = useStore();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data, error } = await supabase
          .from('user_stats')
          .select('email, points, best_streak, profile_name, profile_avatar')
          .order('points', { ascending: false })
          .limit(50);
          
        if (error) throw error;
        
        if (data) {
          const formatted = data.map(item => ({
            name: item.profile_name || (item.email ? item.email.split('@')[0] : 'Anonymous'),
            points: item.points || 0,
            bestStreak: item.best_streak || 0,
            email: item.email,
            avatar: item.profile_avatar || 'cat',
          }));
          setLeaderboardData(formatted);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeaderboard();
  }, []);

  const rankedLeaderboard = leaderboardData.map((item, index) => ({ 
    ...item, 
    rank: index + 1,
    isUser: user && item.email === user.email 
  }));

  const top3 = rankedLeaderboard.slice(0, 3);
  const remainingList = rankedLeaderboard.slice(3);

  // Calculate overall progress for the side panel
  const completedChapters = Object.values(moduleProgress).filter(m => m.isCompleted).length;
  const totalChapters = 14; 
  const overallProgress = Math.round((completedChapters / totalChapters) * 100);

  return (
    <main className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 relative">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-secondary rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row gap-6 items-start relative z-10">
        
        {/* Kolom Kiri: Tabel Leaderboard & Podium */}
        <div className="lg:w-2/3 glass-panel overflow-hidden w-full flex flex-col">
          <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-glass-border flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-3xl font-black mb-1 flex items-center gap-2 sm:gap-3">
                <Trophy className="text-yellow-500 w-6 h-6 sm:w-8 sm:h-8" />
                Global Rankings
              </h2>
              <p className="opacity-70 font-medium text-sm">Bandingkan pencapaianmu dengan pelajar sejarah lainnya.</p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="p-20 text-center opacity-60">Belum ada data di Leaderboard. Ayo mulai evaluasi!</div>
          ) : (
            <div className="px-4 sm:px-8 pb-0">
              {/* TOP 3 PODIUM */}
              <div className="flex justify-center items-end gap-2 sm:gap-4 mb-8 h-48 sm:h-60 mt-6">
                {/* Rank 2 (Silver) */}
                {top3[1] && (
                  <div className="flex flex-col items-center justify-end h-[80%] w-1/3 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="relative mb-2">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${AVATAR_COLORS[top3[1].avatar]||'from-slate-400 to-slate-600'} border-4 border-slate-300 shadow-lg flex items-center justify-center text-2xl`}>
                        {AVATAR_EMOJI[top3[1].avatar]||'👤'}
                      </div>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl drop-shadow-md">🥈</div>
                    </div>
                    <div className="bg-gradient-to-t from-slate-200/20 to-slate-200/50 dark:from-slate-800/50 dark:to-slate-700/80 w-full h-full rounded-t-xl flex flex-col items-center pt-4 border border-glass-border border-b-0">
                      <span className="font-bold text-sm sm:text-base text-center truncate w-11/12">{top3[1].name}</span>
                      <span className="text-primary font-black text-sm sm:text-base">{top3[1].points.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                
                {/* Rank 1 (Gold) */}
                {top3[0] && (
                  <div className="flex flex-col items-center justify-end h-full w-1/3 z-10 animate-in slide-in-from-bottom-12 duration-700">
                    <div className="relative mb-2">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${AVATAR_COLORS[top3[0].avatar]||'from-yellow-400 to-yellow-600'} border-4 border-yellow-400 shadow-xl flex items-center justify-center text-3xl sm:text-4xl`}>
                        {AVATAR_EMOJI[top3[0].avatar]||'👤'}
                      </div>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-4xl drop-shadow-lg animate-bounce">
                        <Crown className="text-yellow-500 fill-yellow-400 w-10 h-10" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-t from-yellow-500/10 to-yellow-400/30 dark:from-yellow-900/30 dark:to-yellow-700/50 w-full h-full rounded-t-xl flex flex-col items-center pt-4 border-2 border-yellow-400/50 border-b-0 shadow-[0_-10px_30px_rgba(234,179,8,0.15)]">
                      <span className="font-black text-base sm:text-lg text-center truncate w-11/12">{top3[0].name}</span>
                      <span className="text-yellow-600 dark:text-yellow-400 font-black text-lg sm:text-xl drop-shadow-sm">{top3[0].points.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                
                {/* Rank 3 (Bronze) */}
                {top3[2] && (
                  <div className="flex flex-col items-center justify-end h-[70%] w-1/3 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                    <div className="relative mb-2">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${AVATAR_COLORS[top3[2].avatar]||'from-amber-600 to-amber-800'} border-4 border-amber-600 shadow-md flex items-center justify-center text-xl sm:text-2xl`}>
                        {AVATAR_EMOJI[top3[2].avatar]||'👤'}
                      </div>
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xl drop-shadow-md">🥉</div>
                    </div>
                    <div className="bg-gradient-to-t from-amber-600/10 to-amber-600/20 dark:from-amber-900/40 dark:to-amber-800/60 w-full h-full rounded-t-xl flex flex-col items-center pt-4 border border-glass-border border-b-0">
                      <span className="font-bold text-sm sm:text-base text-center truncate w-11/12">{top3[2].name}</span>
                      <span className="text-primary font-black text-xs sm:text-sm">{top3[2].points.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* REMAINING LIST */}
              {remainingList.length > 0 && (
                <div className="w-full overflow-x-auto pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <table className="w-full min-w-[420px] text-left border-collapse">
                    <thead>
                      <tr className="text-xs font-bold opacity-60 uppercase tracking-wider bg-surface/30 border-b border-t border-glass-border">
                        <th className="px-3 sm:px-6 py-3 w-12 sm:w-16">Rank</th>
                        <th className="px-3 sm:px-6 py-3">Pelajar</th>
                        <th className="px-3 sm:px-6 py-3 text-center">Poin</th>
                        <th className="px-3 sm:px-6 py-3 text-right"><span className="hidden sm:inline">Streak </span>🔥</th>
                      </tr>
                    </thead>
                    <tbody>
                      {remainingList.map((student) => (
                        <tr 
                          key={student.name + student.rank} 
                          className={`border-b border-glass-border/50 hover:bg-glass transition-colors ${
                            student.isUser
                              ? 'bg-primary/10 border-l-4 border-l-primary'
                              : 'border-l-4 border-l-transparent'
                          }`}
                        >
                          <td className="px-3 sm:px-6 py-3">
                            <span className="font-bold text-sm sm:text-base opacity-60">#{student.rank}</span>
                          </td>
                          <td className="px-3 sm:px-6 py-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-xl shrink-0 bg-gradient-to-br ${AVATAR_COLORS[student.avatar]||'from-primary to-secondary'} ${student.isUser ? 'ring-2 ring-primary shadow-md' : ''}`}>
                                {AVATAR_EMOJI[student.avatar]||'👤'}
                              </div>
                              <div className="min-w-0">
                                <span className={`font-bold text-sm block truncate max-w-[100px] sm:max-w-none ${student.isUser ? 'text-primary' : ''}`}>
                                  {student.name}
                                </span>
                                {student.isUser && (
                                  <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Kamu</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 text-center">
                            <span className="font-black text-sm sm:text-base bg-surface/50 px-2 sm:px-3 py-1 rounded-full border border-glass-border">
                              {student.points.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className="font-bold text-sm sm:text-base opacity-80">{student.bestStreak}</span>
                              <Flame className="text-orange-500 w-4 h-4" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Stats Panel */}
        <div className="lg:w-1/3 flex flex-col gap-6 w-full">
          {/* Current Scholar Card */}
          <div className="glass-panel p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-[50px] opacity-20 rounded-full pointer-events-none"></div>
            
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${AVATAR_COLORS[profileAvatar]||'from-primary to-secondary'} flex items-center justify-center text-5xl mb-4 shadow-lg ring-4 ring-background z-10`}>
              {AVATAR_EMOJI[profileAvatar]||'👤'}
            </div>
            <h3 className="text-xl font-black mb-1 z-10">{profileName || user?.email?.split('@')[0] || 'Pelajar Gen Zitoria'}</h3>
            <p className="text-sm font-semibold text-primary mb-8 z-10">Level {initialLevel || '?'} Historian</p>

            <div className="flex w-full justify-between bg-surface/50 rounded-2xl p-4 mb-6 border border-glass-border z-10">
              <div className="flex flex-col items-center w-1/2 border-r border-glass-border">
                <span className="text-xs font-bold opacity-60 uppercase tracking-wider mb-1">Current Streak</span>
                <div className="flex items-center gap-1 font-black text-2xl text-orange-500">
                  {streak} <Flame className="w-6 h-6" />
                </div>
              </div>
              <div className="flex flex-col items-center w-1/2">
                <span className="text-xs font-bold opacity-60 uppercase tracking-wider mb-1">Total Poin</span>
                <div className="font-black text-2xl">
                  {points.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Era Mastery Card */}
          <div className="glass-panel p-8">
            <h3 className="text-xl font-black mb-2">Progres Keseluruhan</h3>
            <p className="text-sm opacity-70 mb-6">Pencapaian dari total {totalChapters} Sub-bab sejarah.</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>{completedChapters} / {totalChapters} Selesai</span>
                <span className="text-primary">{overallProgress}%</span>
              </div>
              <div className="w-full bg-surface/50 rounded-full h-3 border border-glass-border overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-secondary to-primary h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
