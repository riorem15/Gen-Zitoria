import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, LogOut, Save, User, MapPin, Globe,
  Settings, Type, Languages, RefreshCw
} from 'lucide-react';

const AVATARS = [
  { id: 'cat', name: 'Kucing', emoji: '🐱', color: 'from-orange-400 to-amber-500',
    svg: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="55" r="32" fill="#F97316"/><ellipse cx="50" cy="65" rx="20" ry="16" fill="#FED7AA"/><circle cx="38" cy="45" r="8" fill="#F97316"/><circle cx="62" cy="45" r="8" fill="#F97316"/><polygon points="36,38 42,28 44,42" fill="#F97316"/><polygon points="64,38 58,28 56,42" fill="#F97316"/><circle cx="43" cy="52" r="6" fill="#1e1e1e"/><circle cx="57" cy="52" r="6" fill="#1e1e1e"/><circle cx="45" cy="50" r="2" fill="white"/><circle cx="59" cy="50" r="2" fill="white"/><ellipse cx="50" cy="62" rx="4" ry="3" fill="#FDA4AF"/><line x1="30" y1="60" x2="48" y2="62" stroke="#1e1e1e" strokeWidth="1.5"/><line x1="70" y1="60" x2="52" y2="62" stroke="#1e1e1e" strokeWidth="1.5"/><line x1="28" y1="64" x2="48" y2="63" stroke="#1e1e1e" strokeWidth="1.5"/><line x1="72" y1="64" x2="52" y2="63" stroke="#1e1e1e" strokeWidth="1.5"/></svg> },
  { id: 'dog', name: 'Anjing', emoji: '🐶', color: 'from-amber-500 to-yellow-600',
    svg: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="55" r="32" fill="#B45309"/><ellipse cx="30" cy="40" rx="10" ry="14" fill="#92400E"/><ellipse cx="70" cy="40" rx="10" ry="14" fill="#92400E"/><ellipse cx="50" cy="68" rx="22" ry="14" fill="#D97706"/><circle cx="43" cy="52" r="6" fill="#1e1e1e"/><circle cx="57" cy="52" r="6" fill="#1e1e1e"/><circle cx="45" cy="50" r="2" fill="white"/><circle cx="59" cy="50" r="2" fill="white"/><ellipse cx="50" cy="64" rx="8" ry="6" fill="#F87171"/><line x1="34" y1="60" x2="48" y2="63" stroke="#1e1e1e" strokeWidth="1.5"/><line x1="66" y1="60" x2="52" y2="63" stroke="#1e1e1e" strokeWidth="1.5"/></svg> },
  { id: 'rhino', name: 'Badak', emoji: '🦏', color: 'from-slate-500 to-gray-600',
    svg: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="55" r="32" fill="#64748B"/><ellipse cx="50" cy="60" rx="24" ry="18" fill="#94A3B8"/><ellipse cx="50" cy="38" rx="8" ry="5" fill="#94A3B8"/><polygon points="46,30 54,30 50,18" fill="#CBD5E1"/><circle cx="43" cy="52" r="6" fill="#1e1e1e"/><circle cx="57" cy="52" r="6" fill="#1e1e1e"/><circle cx="45" cy="50" r="2" fill="white"/><circle cx="59" cy="50" r="2" fill="white"/><ellipse cx="50" cy="65" rx="5" ry="3" fill="#475569"/></svg> },
  { id: 'fox', name: 'Rubah', emoji: '🦊', color: 'from-orange-500 to-red-500',
    svg: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="55" r="32" fill="#EA580C"/><ellipse cx="50" cy="65" rx="20" ry="14" fill="#FED7AA"/><polygon points="34,38 26,20 44,40" fill="#EA580C"/><polygon points="66,38 74,20 56,40" fill="#EA580C"/><polygon points="35,38 29,22 43,40" fill="white"/><polygon points="65,38 71,22 57,40" fill="white"/><circle cx="43" cy="52" r="6" fill="#1e1e1e"/><circle cx="57" cy="52" r="6" fill="#1e1e1e"/><circle cx="45" cy="50" r="2" fill="white"/><circle cx="59" cy="50" r="2" fill="white"/><ellipse cx="50" cy="62" rx="4" ry="3" fill="#F87171"/></svg> },
  { id: 'owl', name: 'Burung Hantu', emoji: '🦉', color: 'from-amber-700 to-yellow-800',
    svg: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="55" r="32" fill="#92400E"/><ellipse cx="50" cy="62" rx="22" ry="18" fill="#D97706"/><circle cx="43" cy="50" r="11" fill="white"/><circle cx="57" cy="50" r="11" fill="white"/><circle cx="43" cy="50" r="7" fill="#1e1e1e"/><circle cx="57" cy="50" r="7" fill="#1e1e1e"/><circle cx="45" cy="48" r="2.5" fill="white"/><circle cx="59" cy="48" r="2.5" fill="white"/><polygon points="47,56 53,56 50,62" fill="#F59E0B"/><polygon points="36,32 44,40 42,26" fill="#92400E"/><polygon points="64,32 56,40 58,26" fill="#92400E"/></svg> },
  { id: 'panda', name: 'Panda', emoji: '🐼', color: 'from-gray-700 to-slate-800',
    svg: <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="55" r="32" fill="white"/><circle cx="36" cy="45" r="13" fill="#1e1e1e"/><circle cx="64" cy="45" r="13" fill="#1e1e1e"/><circle cx="43" cy="52" r="6" fill="white"/><circle cx="57" cy="52" r="6" fill="white"/><circle cx="43" cy="52" r="4" fill="#1e1e1e"/><circle cx="57" cy="52" r="4" fill="#1e1e1e"/><circle cx="44" cy="51" r="1.5" fill="white"/><circle cx="58" cy="51" r="1.5" fill="white"/><ellipse cx="50" cy="63" rx="5" ry="3.5" fill="#FDA4AF"/><ellipse cx="38" cy="38" rx="7" ry="10" fill="#1e1e1e"/><ellipse cx="62" cy="38" rx="7" ry="10" fill="#1e1e1e"/></svg> },
];

const COUNTRIES = [
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapura', flag: '🇸🇬' },
  { code: 'US', name: 'Amerika Serikat', flag: '🇺🇸' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'JP', name: 'Jepang', flag: '🇯🇵' },
];

const FONT_SIZES = [
  { id: 'sm', label: null }, // filled dynamically from i18n
  { id: 'md', label: null },
  { id: 'lg', label: null },
];

export default function Profile() {
  const {
    user, isDarkMode, toggleTheme, signOut, switchAccount,
    profileName, profileProvince, profileAvatar, profileCountry, setProfile,
    syncStats, points, bestStreak, unlockedBadges,
    fontSize, setFontSize, language, setLanguage, t,
  } = useStore();

  const [name, setName] = useState(profileName || user?.email?.split('@')[0] || '');
  const [province, setProvince] = useState(profileProvince || '');
  const [country, setCountry] = useState(profileCountry || 'Indonesia');
  const [avatar, setAvatar] = useState(profileAvatar || 'cat');
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const selectedAvatar = AVATARS.find(a => a.id === avatar) || AVATARS[0];
  const selectedCountry = COUNTRIES.find(c => c.name === country) || COUNTRIES[0];

  const fontSizeIndex = { sm: 0, md: 1, lg: 2 };
  const fontSizeKeys = ['sm', 'md', 'lg'];

  const handleSave = () => {
    setProfile({ profileName: name, profileProvince: province, profileCountry: country, profileAvatar: avatar });
    syncStats();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: t('profile'), icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: t('settings'), icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5 pt-2 pb-24 px-4 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-black">
          {activeTab === 'profile' ? t('myProfile') : t('settingsTitle')}
        </h2>
      </div>

      {/* Tab Switcher */}
      <div className="glass-panel p-1.5 flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                : 'opacity-60 hover:opacity-90'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Avatar Card */}
            <div className="glass-panel p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  key={avatar}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`w-28 h-28 rounded-full bg-gradient-to-br ${selectedAvatar.color} p-1 shadow-xl ring-4 ring-primary/30`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white/10">
                    {selectedAvatar.svg}
                  </div>
                </motion.div>
                <div className="text-center">
                  <p className="font-black text-xl">{name || 'Penjelajah Sejarah'}</p>
                  <p className="text-sm opacity-60">{selectedCountry.flag} {country} {province && `• ${province}`}</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: t('totalPoints'), value: points },
                  { label: t('bestStreak'), value: bestStreak },
                  { label: t('badges'), value: unlockedBadges.length },
                ].map(s => (
                  <div key={s.label} className="bg-surface/50 p-3 rounded-xl text-center border border-glass-border">
                    <div className="text-2xl font-black text-primary">{s.value}</div>
                    <div className="text-xs opacity-60 font-bold">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Avatar Picker */}
            <div className="glass-panel p-5">
              <h3 className="font-bold text-sm uppercase tracking-widest opacity-60 mb-4">{t('chooseCharacter')}</h3>
              <div className="grid grid-cols-3 gap-3">
                {AVATARS.map(av => (
                  <motion.button
                    key={av.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAvatar(av.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                      avatar === av.id
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-glass-border hover:border-primary/40 bg-surface/30'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${av.color} p-0.5 shadow-md`}>
                      <div className="w-full h-full rounded-full overflow-hidden bg-white/10">
                        {av.svg}
                      </div>
                    </div>
                    <span className="text-xs font-bold">{av.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="glass-panel p-5 space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest opacity-60">{t('personalInfo')}</h3>
              <div>
                <label className="text-xs font-bold opacity-60 flex items-center gap-1 mb-1">
                  <User className="w-3 h-3"/>{t('name')}
                </label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder={t('namePlaceholder')}
                  className="w-full bg-surface/50 border border-glass-border rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold opacity-60 flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3"/>{t('province')}
                </label>
                <input value={province} onChange={e => setProvince(e.target.value)}
                  placeholder={t('provincePlaceholder')}
                  className="w-full bg-surface/50 border border-glass-border rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold opacity-60 flex items-center gap-1 mb-1">
                  <Globe className="w-3 h-3"/>{t('country')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COUNTRIES.map(c => (
                    <button key={c.code} onClick={() => setCountry(c.name)}
                      className={`flex items-center gap-2 p-2 rounded-xl border-2 text-sm font-bold transition-all ${
                        country === c.name ? 'border-primary bg-primary/10' : 'border-glass-border hover:border-primary/40'
                      }`}>
                      <span className="text-xl">{c.flag}</span>
                      <span className="text-xs truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleSave}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                <Save className="w-5 h-5" />
                {saved ? t('saved') : t('saveProfile')}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Font Size */}
            <div className="glass-panel p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-primary" />
                <h3 className="font-bold">{t('fontSize')}</h3>
              </div>

              {/* Slider track with 3 stops */}
              <div className="px-2">
                {/* Labels */}
                <div className="flex justify-between mb-2">
                  <span className={`text-xs font-bold transition-colors ${fontSize === 'sm' ? 'text-primary' : 'opacity-40'}`}>A</span>
                  <span className={`text-sm font-bold transition-colors ${fontSize === 'md' ? 'text-primary' : 'opacity-40'}`}>A</span>
                  <span className={`text-base font-bold transition-colors ${fontSize === 'lg' ? 'text-primary' : 'opacity-40'}`}>A</span>
                </div>

                {/* Custom Slider */}
                <div className="relative h-8 flex items-center">
                  {/* Track */}
                  <div className="w-full h-2 bg-surface/60 rounded-full border border-glass-border relative">
                    {/* Active fill */}
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                      style={{ width: fontSizeIndex[fontSize] === 0 ? '0%' : fontSizeIndex[fontSize] === 1 ? '50%' : '100%' }}
                    />
                    {/* Stop dots */}
                    {[0, 1, 2].map(i => (
                      <button
                        key={i}
                        onClick={() => setFontSize(fontSizeKeys[i])}
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                          fontSizeIndex[fontSize] >= i
                            ? 'bg-primary border-primary shadow-md shadow-primary/40 scale-110'
                            : 'bg-surface border-glass-border hover:border-primary/50'
                        }`}
                        style={{ left: i === 0 ? '0%' : i === 1 ? '50%' : '100%' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Labels row */}
                <div className="flex justify-between mt-1">
                  <span className="text-xs opacity-50">{t('fontSmall')}</span>
                  <span className="text-xs opacity-50">{t('fontMedium')}</span>
                  <span className="text-xs opacity-50">{t('fontLarge')}</span>
                </div>
              </div>
            </div>

            {/* Display Mode */}
            <div className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                {isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                <h3 className="font-bold">{t('displayMode')}</h3>
              </div>
              <button onClick={toggleTheme}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-glass-border hover:border-primary/40 transition-all">
                <div className="flex items-center gap-3 font-bold">
                  {isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                  <span>{isDarkMode ? t('darkMode') : t('lightMode')}</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-primary' : 'bg-glass-border'} relative`}>
                  <div className={`absolute w-5 h-5 rounded-full bg-white shadow top-0.5 transition-all ${isDarkMode ? 'left-6' : 'left-0.5'}`} />
                </div>
              </button>
            </div>

            {/* Language */}
            <div className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <Languages className="w-5 h-5 text-primary" />
                <h3 className="font-bold">{t('language')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { code: 'id', flag: '🇮🇩', name: 'Indonesia' },
                  { code: 'en', flag: '🇺🇸', name: 'English' },
                ].map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 font-bold transition-all ${
                      language === lang.code
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-glass-border hover:border-primary/40 bg-surface/30'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Account Actions */}
            <div className="glass-panel p-5 space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-widest opacity-60">Akun</h3>

              {/* Switch Account */}
              <button onClick={switchAccount}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-surface/50 border border-glass-border hover:border-primary/40 transition-all text-left">
                <div className="w-10 h-10 rounded-xl bg-surface-variant/50 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5 opacity-70" />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{t('switchAccount')}</p>
                  <p className="text-xs opacity-60">{t('switchAccountDesc')}</p>
                </div>
              </button>

              {/* Logout */}
              <button onClick={signOut}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-red-500/30 hover:bg-red-500/10 transition-all text-left">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-red-500">{t('logout')}</p>
                  <p className="text-xs opacity-60">{t('logoutDesc')}</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
