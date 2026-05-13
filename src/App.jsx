import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Home from './pages/Home';
import PlayZone from './pages/PlayZone';
import Leaderboard from './pages/Leaderboard';
import MaterialView from './pages/MaterialView';
import Login from './pages/Login';
import Tutorial from './pages/Tutorial';
import LevelSelection from './pages/LevelSelection';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';

// Protected Route Wrapper for Main App
const ProtectedRoute = ({ children }) => {
  const { user, hasSeenTutorial, initialLevel, sessionChecked } = useStore();
  
  if (!sessionChecked) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!hasSeenTutorial) return <Navigate to="/tutorial" replace />;
  if (initialLevel === null) return <Navigate to="/assessment" replace />;
  return children;
};

// Simple Auth Wrapper for Onboarding (Tutorial & Assessment)
const RequireAuth = ({ children }) => {
  const { user, sessionChecked } = useStore();
  
  if (!sessionChecked) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { setUser, setSessionChecked, isDarkMode } = useStore();

  // Apply initial theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) useStore.getState().fetchStats();
      setSessionChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) useStore.getState().fetchStats();
      setSessionChecked(true);
    });
    return () => subscription.unsubscribe();
  }, [setUser, setSessionChecked]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Onboarding Routes */}
        <Route path="/tutorial" element={<RequireAuth><Tutorial /></RequireAuth>} />
        <Route path="/assessment" element={<RequireAuth><LevelSelection /></RequireAuth>} />

        {/* Protected Dashboard Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="bg-background min-h-screen relative font-body-md text-on-background flex transition-colors duration-300">
              {/* Desktop Sidebar */}
              <Sidebar />
              
              {/* Main Content Area (shifted on desktop) */}
              <div className="flex-1 md:ml-20 lg:ml-64 flex flex-col min-h-screen">
                <Header />
                
                <div className="flex-1 pb-24 md:pb-8 pt-20 px-4 md:px-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/material/:phaseId/:chapterId" element={<MaterialView />} />
                    <Route path="/play" element={<PlayZone />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                  </Routes>
                </div>
                
                <BottomNav />
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;

