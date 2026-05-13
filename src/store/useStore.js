import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useStore = create((set, get) => ({
  // Theme
  isDarkMode: localStorage.getItem('theme') === 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = !state.isDarkMode;
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    if (newTheme) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return { isDarkMode: newTheme };
  }),

  // Auth
  user: null,
  sessionChecked: false,
  setUser: (user) => set({ user }),
  setSessionChecked: (value) => set({ sessionChecked: value }),

  // Onboarding
  hasSeenTutorial: false,
  setHasSeenTutorial: async (value) => {
    set({ hasSeenTutorial: value });
    await get().syncStats();
  },

  // Level Assessment
  initialLevel: null,
  setInitialLevel: async (level) => {
    set({ initialLevel: level });
    await get().syncStats();
  },

  // ZPD & Game Stats
  streak: 0,
  bestStreak: 0,
  zpdLevel: 1,
  points: 0,
  gamePoints: 0,

  // Profile
  profileName: '',
  profileProvince: '',
  profileCountry: 'Indonesia',
  profileAvatar: 'cat',
  setProfile: async (data) => {
    set({ ...data });
    await get().syncStats();
  },

  // Phase Completion
  completedPhases: [],
  markPhaseComplete: async (phaseId) => {
    const state = get();
    if (!state.completedPhases.includes(phaseId)) {
      const updated = [...state.completedPhases, phaseId];
      set({ completedPhases: updated });
      await get().syncStats();
    }
  },

  // Module Progress — persisted to DB
  moduleProgress: {
    chap_1: { isCompleted: false, progress: 0 },
    chap_2: { isCompleted: false, progress: 0 },
    chap_3: { isCompleted: false, progress: 0 },
    chap_4: { isCompleted: false, progress: 0 },
    chap_5: { isCompleted: false, progress: 0 },
    chap_6: { isCompleted: false, progress: 0 },
    chap_7: { isCompleted: false, progress: 0 },
    chap_8: { isCompleted: false, progress: 0 },
    chap_9: { isCompleted: false, progress: 0 },
    chap_10: { isCompleted: false, progress: 0 },
    chap_11: { isCompleted: false, progress: 0 },
    chap_12: { isCompleted: false, progress: 0 },
    chap_13: { isCompleted: false, progress: 0 },
    chap_14: { isCompleted: false, progress: 0 },
  },

  // Daily Quests
  dailyQuests: [
    { id: 1, title: 'Buka 1 Materi Baru', isCompleted: false, current: 0, target: 1 },
    { id: 2, title: 'Jawab Benar 3 Soal', isCompleted: false, current: 0, target: 3 },
    { id: 3, title: 'Selesaikan Flashcards', isCompleted: false, current: 0, target: 1 },
  ],
  unlockedBadges: [],

  updateQuestProgress: (questId, increment = 1) => set((state) => {
    const updatedQuests = state.dailyQuests.map(q => {
      if (q.id === questId && !q.isCompleted) {
        const newCurrent = q.current + increment;
        const isCompleted = newCurrent >= q.target;
        return { ...q, current: Math.min(newCurrent, q.target), isCompleted };
      }
      return q;
    });
    const completedCount = updatedQuests.filter(q => q.isCompleted).length;
    let newBadges = [...state.unlockedBadges];
    if (completedCount === 3 && !newBadges.includes('Pahlawan Harian')) {
      newBadges.push('Pahlawan Harian');
    }
    return { dailyQuests: updatedQuests, unlockedBadges: newBadges };
  }),

  unlockBadge: (badgeName) => set((state) => {
    if (!state.unlockedBadges.includes(badgeName)) {
      return { unlockedBadges: [...state.unlockedBadges, badgeName] };
    }
    return state;
  }),

  addGamePoints: (amount) => {
    set((state) => ({ gamePoints: state.gamePoints + amount, points: state.points + amount }));
    get().syncStats();
  },

  // ─── DATABASE SYNC ───────────────────────────────────────────

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
        // Parse JSON fields safely
        const moduleProgress = data.module_progress
          ? JSON.parse(data.module_progress)
          : get().moduleProgress;
        const completedPhases = data.completed_phases
          ? JSON.parse(data.completed_phases)
          : [];

        set({
          points: data.points || 0,
          gamePoints: data.game_points || 0,
          bestStreak: data.best_streak || 0,
          profileName: data.profile_name || '',
          profileProvince: data.profile_province || '',
          profileCountry: data.profile_country || 'Indonesia',
          profileAvatar: data.profile_avatar || 'cat',
          hasSeenTutorial: data.has_seen_tutorial || false,
          initialLevel: data.initial_level || null,
          moduleProgress,
          completedPhases,
        });
      }
    } catch (err) {
      console.error('fetchStats error:', err);
    }
  },

  syncStats: async () => {
    const {
      user, points, gamePoints, bestStreak,
      profileName, profileProvince, profileCountry, profileAvatar,
      hasSeenTutorial, initialLevel, moduleProgress, completedPhases,
    } = get();
    if (!user) return;
    try {
      await supabase.from('user_stats').upsert({
        id: user.id,
        email: user.email,
        points,
        game_points: gamePoints,
        best_streak: bestStreak,
        profile_name: profileName,
        profile_province: profileProvince,
        profile_country: profileCountry,
        profile_avatar: profileAvatar,
        has_seen_tutorial: hasSeenTutorial,
        initial_level: initialLevel,
        module_progress: JSON.stringify(moduleProgress),
        completed_phases: JSON.stringify(completedPhases),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    } catch (err) {
      console.error('syncStats error:', err);
    }
  },

  // ─── ACTIONS ─────────────────────────────────────────────────

  completeModule: async (chapterId) => {
    set((state) => ({
      moduleProgress: {
        ...state.moduleProgress,
        [chapterId]: { isCompleted: true, progress: 100 },
      },
    }));
    get().updateQuestProgress(1);
    await get().syncStats();
  },

  updateModuleProgress: async (chapterId, progress) => {
    set((state) => ({
      moduleProgress: {
        ...state.moduleProgress,
        [chapterId]: {
          ...state.moduleProgress[chapterId],
          progress: Math.max(state.moduleProgress[chapterId]?.progress || 0, progress),
          isCompleted: progress >= 100 ? true : state.moduleProgress[chapterId]?.isCompleted,
        },
      },
    }));
    await get().syncStats();
  },

  addStreak: () => {
    const state = get();
    const newStreak = state.streak + 1;
    let newLevel = state.zpdLevel;
    if (newStreak % 5 === 0 && newLevel < 3) newLevel += 1;
    const newPoints = state.points + (10 * newLevel * (newStreak > 3 ? 2 : 1));
    const newBestStreak = Math.max(state.bestStreak || 0, newStreak);
    set({ streak: newStreak, points: newPoints, zpdLevel: newLevel, bestStreak: newBestStreak });
    get().updateQuestProgress(2);
    if (newStreak >= 5) get().unlockBadge('Penguasa Streak');
    if (newLevel === 3) get().unlockBadge('Master HOTS');
    get().syncStats();
  },

  resetStreak: () => {
    const state = get();
    let newLevel = state.zpdLevel;
    if (state.streak === 0 && newLevel > 1) newLevel -= 1;
    set({ streak: 0, zpdLevel: newLevel });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, sessionChecked: false });
  },
}));
