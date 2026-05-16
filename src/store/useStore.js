import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// ─── i18n translations ────────────────────────────────────────────────────────
export const i18n = {
  id: {
    profile: 'Profil',
    settings: 'Pengaturan',
    myProfile: 'Profil Saya',
    settingsTitle: 'Pengaturan',
    fontSize: 'Ukuran Font',
    fontSmall: 'Kecil',
    fontMedium: 'Sedang',
    fontLarge: 'Besar',
    displayMode: 'Mode Tampilan',
    darkMode: 'Mode Gelap',
    lightMode: 'Mode Terang',
    language: 'Bahasa',
    logout: 'Keluar',
    logoutDesc: 'Keluar dari akun ini',
    switchAccount: 'Ganti Akun',
    switchAccountDesc: 'Masuk dengan akun lain',
    saveProfile: 'Simpan Profil',
    saved: '✅ Tersimpan!',
    chooseCharacter: 'Pilih Karakter',
    personalInfo: 'Informasi Pribadi',
    name: 'Nama',
    namePlaceholder: 'Nama panggilanmu...',
    province: 'Asal Provinsi',
    provincePlaceholder: 'Contoh: Jawa Barat, Banten...',
    country: 'Negara',
    totalPoints: 'Total Poin',
    bestStreak: 'Best Streak',
    badges: 'Lencana',
    home: 'Beranda',
    material: 'Materi',
    play: 'Main',
    leaderboard: 'Peringkat',
    games: 'Mini Game',
    evaluation: 'Evaluasi',
    timeline: 'Timeline',
    globalRankings: 'Global Rankings',
    compareDesc: 'Bandingkan pencapaianmu dengan pelajar sejarah lainnya.',
    rank: 'Rank',
    student: 'Pelajar',
    totalPoin: 'Total Poin',
    bestStreakCol: 'Streak Terbaik',
    noLeaderboard: 'Belum ada data di Leaderboard. Ayo mulai evaluasi!',
    overallProgress: 'Progres Keseluruhan',
    progressDesc: 'Pencapaian dari total {n} Sub-bab sejarah.',
    you: 'Kamu',
    currentStreak: 'Current Streak',
    historian: 'Level {n} Historian',
    completed: 'Selesai',
  },
  en: {
    profile: 'Profile',
    settings: 'Settings',
    myProfile: 'My Profile',
    settingsTitle: 'Settings',
    fontSize: 'Font Size',
    fontSmall: 'Small',
    fontMedium: 'Medium',
    fontLarge: 'Large',
    displayMode: 'Display Mode',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    logout: 'Log Out',
    logoutDesc: 'Sign out from this account',
    switchAccount: 'Switch Account',
    switchAccountDesc: 'Sign in with another account',
    saveProfile: 'Save Profile',
    saved: '✅ Saved!',
    chooseCharacter: 'Choose Character',
    personalInfo: 'Personal Info',
    name: 'Name',
    namePlaceholder: 'Your nickname...',
    province: 'Province / Region',
    provincePlaceholder: 'e.g. West Java, Banten...',
    country: 'Country',
    totalPoints: 'Total Points',
    bestStreak: 'Best Streak',
    badges: 'Badges',
    home: 'Home',
    material: 'Material',
    play: 'Play',
    leaderboard: 'Leaderboard',
    games: 'Mini Games',
    evaluation: 'Evaluation',
    timeline: 'Timeline',
    globalRankings: 'Global Rankings',
    compareDesc: 'Compare your progress with other history learners.',
    rank: 'Rank',
    student: 'Student',
    totalPoin: 'Total Points',
    bestStreakCol: 'Best Streak',
    noLeaderboard: 'No leaderboard data yet. Start an evaluation!',
    overallProgress: 'Overall Progress',
    progressDesc: 'Progress from {n} total history chapters.',
    you: 'You',
    currentStreak: 'Current Streak',
    historian: 'Level {n} Historian',
    completed: 'Done',
  },
};

// ─── Font size helpers ────────────────────────────────────────────────────────
function applyFontSize(size) {
  document.documentElement.setAttribute('data-font-size', size);
  localStorage.setItem('fontSize', size);
}

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

  // Font Size: 'sm' | 'md' | 'lg'
  fontSize: localStorage.getItem('fontSize') || 'md',
  setFontSize: (size) => {
    applyFontSize(size);
    set({ fontSize: size });
  },

  // Language: 'id' | 'en'
  language: localStorage.getItem('language') || 'id',
  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    set({ language: lang });
  },

  // Convenience: get current translation object
  t: (key) => {
    const lang = get().language;
    return i18n[lang]?.[key] ?? i18n['id'][key] ?? key;
  },

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
    { id: 1, title: 'Buka 1 Materi Baru', isCompleted: false, current: 0, target: 1, reward: 100 },
    { id: 2, title: 'Jawab Benar 5 Soal (Streak)', isCompleted: false, current: 0, target: 5, reward: 300 },
    { id: 3, title: 'Jawab Benar 10 Soal (Streak)', isCompleted: false, current: 0, target: 10, reward: 600 },
    { id: 4, title: 'Selesaikan Flashcards', isCompleted: false, current: 0, target: 1, reward: 200 },
  ],
  unlockedBadges: [],

  updateQuestProgress: (questId, increment = 1) => set((state) => {
    let pointsEarned = 0;
    const updatedQuests = state.dailyQuests.map(q => {
      if (q.id === questId && !q.isCompleted) {
        const newCurrent = q.current + increment;
        const isCompleted = newCurrent >= q.target;
        if (isCompleted) pointsEarned += q.reward;
        return { ...q, current: Math.min(newCurrent, q.target), isCompleted };
      }
      return q;
    });

    const completedCount = updatedQuests.filter(q => q.isCompleted).length;
    let newBadges = [...state.unlockedBadges];
    if (completedCount === state.dailyQuests.length && !newBadges.includes('Pahlawan Harian')) {
      newBadges.push('Pahlawan Harian');
    }

    if (pointsEarned > 0) {
      setTimeout(() => get().syncStats(), 100);
    }

    return { 
      dailyQuests: updatedQuests, 
      unlockedBadges: newBadges,
      points: state.points + pointsEarned
    };
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
        const moduleProgress = typeof data.module_progress === 'string'
          ? JSON.parse(data.module_progress)
          : (data.module_progress ?? get().moduleProgress);
        const completedPhases = typeof data.completed_phases === 'string'
          ? JSON.parse(data.completed_phases)
          : (data.completed_phases ?? []);

        set({
          points: data.points ?? 0,
          gamePoints: data.game_points ?? 0,
          bestStreak: data.best_streak ?? 0,
          profileName: data.profile_name ?? '',
          profileProvince: data.profile_province ?? '',
          profileCountry: data.profile_country ?? 'Indonesia',
          profileAvatar: data.profile_avatar ?? 'cat',
          hasSeenTutorial: data.has_seen_tutorial ?? false,
          initialLevel: data.initial_level ?? null,
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

  // Sign out current session only
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, sessionChecked: false });
  },

  // Switch account = same as signOut (navigates to login)
  switchAccount: async () => {
    await supabase.auth.signOut();
    set({ user: null, sessionChecked: false });
  },
}));

// Apply saved font size on initial load
const savedFontSize = localStorage.getItem('fontSize') || 'md';
document.documentElement.setAttribute('data-font-size', savedFontSize);
