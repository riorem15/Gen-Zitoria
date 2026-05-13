import { create } from 'zustand';
import { supabase } from '../lib/supabase';
export const useStore = create((set, get) => ({
  // Theme State
  isDarkMode: localStorage.getItem('theme') === 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = !state.isDarkMode;
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Update document class
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return { isDarkMode: newTheme };
  }),

  // Auth State
  user: null,
  sessionChecked: false,
  setUser: (user) => set({ user }),
  setSessionChecked: (value) => set({ sessionChecked: value }),
  
  // Onboarding State
  hasSeenTutorial: false,
  setHasSeenTutorial: (value) => set({ hasSeenTutorial: value }),
  
  // Level Assessment State (0: None, 1: Little, 2: Understand, 3: Deep)
  initialLevel: null, 
  setInitialLevel: (level) => set({ initialLevel: level }),

  // Evaluation & ZPD Progress
  streak: 0,
  bestStreak: 0,
  zpdLevel: 1, // 1 (LOTS), 2 (MOTS), 3 (HOTS)
  points: 0,
  
  // Chronological Module Progress
  // For each chapter, we store progress (0 to 100), and isCompleted
  moduleProgress: {
    // Fase E Awal
    chap_1: { isCompleted: false, progress: 0 },
    chap_2: { isCompleted: false, progress: 0 },
    chap_3: { isCompleted: false, progress: 0 },
    chap_4: { isCompleted: false, progress: 0 },
    chap_5: { isCompleted: false, progress: 0 },
    // Fase E Akhir & F Awal
    chap_6: { isCompleted: false, progress: 0 },
    chap_7: { isCompleted: false, progress: 0 },
    chap_8: { isCompleted: false, progress: 0 },
    chap_9: { isCompleted: false, progress: 0 },
    // Fase F Akhir
    chap_10: { isCompleted: false, progress: 0 },
    chap_11: { isCompleted: false, progress: 0 },
    chap_12: { isCompleted: false, progress: 0 },
    chap_13: { isCompleted: false, progress: 0 },
    chap_14: { isCompleted: false, progress: 0 },
  },

  // Database Sync Actions
  fetchStats: async () => {
    const { user } = get();
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (data && !error) {
        set({
          points: data.points || 0,
          bestStreak: data.best_streak || 0,
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  },

  syncStats: async () => {
    const { user, points, bestStreak } = get();
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_stats')
        .upsert({ 
          id: user.id, 
          email: user.email,
          points: points,
          best_streak: bestStreak,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
        
      if (error) console.error('Error syncing stats:', error);
    } catch (err) {
      console.error('Failed to sync stats', err);
    }
  },

  // Actions
  completeModule: (chapterId) => {
    set((state) => ({
      moduleProgress: {
        ...state.moduleProgress,
        [chapterId]: { isCompleted: true, progress: 100 }
      }
    }));
    // Note: If you want to sync module progress, we'd need another table. 
    // For now we just sync points and streak.
  },

  addStreak: () => {
    const state = get();
    const newStreak = state.streak + 1;
    let newLevel = state.zpdLevel;

    // Naik level (LOTS -> MOTS -> HOTS) setiap 5 streak
    if (newStreak % 5 === 0 && newLevel < 3) {
      newLevel += 1;
    }

    const newPoints = state.points + (10 * newLevel * (newStreak > 3 ? 2 : 1));
    const newBestStreak = Math.max(state.bestStreak || 0, newStreak);

    set({ 
      streak: newStreak, 
      points: newPoints, 
      zpdLevel: newLevel,
      bestStreak: newBestStreak
    });
    
    // Sync after setting local state
    get().syncStats();
  },

  resetStreak: () => {
    const state = get();
    let newLevel = state.zpdLevel;
    // Turun level jika streak putus beruntun
    if (state.streak === 0 && newLevel > 1) {
      newLevel -= 1; 
    }
    set({ streak: 0, zpdLevel: newLevel });
  },

  // Auth actions
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  }
}));
