import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Home from './pages/Home';
import MaterialsDashboard from './pages/MaterialsDashboard';
import Timeline from './pages/Timeline';
import PlayZone from './pages/PlayZone';
import Leaderboard from './pages/Leaderboard';
import MaterialView from './pages/MaterialView';
import Login from './pages/Login';
import Tutorial from './pages/Tutorial';
import LevelSelection from './pages/LevelSelection';
import Profile from './pages/Profile';
import GameHub from './pages/GameHub';
import FlashcardsGame from './pages/games/FlashcardsGame';
import MatchingGame from './pages/games/MatchingGame';
import WordBuilderGame from './pages/games/WordBuilderGame';
import ChronologyGame from './pages/games/ChronologyGame';
import EvaluationHub from './pages/evaluation/EvaluationHub';
import PhaseEvaluation from './pages/evaluation/PhaseEvaluation';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';

const ProtectedRoute = ({ children }) => {
  const { user, hasSeenTutorial, initialLevel, sessionChecked } = useStore();
  if (!sessionChecked) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"/></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!hasSeenTutorial) return <Navigate to="/tutorial" replace />;
  if (initialLevel === null) return <Navigate to="/assessment" replace />;
  return children;
};

const RequireAuth = ({ children }) => {
  const { user, sessionChecked } = useStore();
  if (!sessionChecked) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"/></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function PhaseEvalWrapper() {
  const { phaseId } = useParams();
  return <PhaseEvaluation phaseId={phaseId} />;
}

function App() {
  const { setUser, setSessionChecked, isDarkMode } = useStore();

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
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
        <Route path="/login" element={<Login />} />
        <Route path="/tutorial" element={<RequireAuth><Tutorial /></RequireAuth>} />
        <Route path="/assessment" element={<RequireAuth><LevelSelection /></RequireAuth>} />

        <Route path="/*" element={
          <ProtectedRoute>
            <div className="bg-background min-h-screen relative font-body-md text-on-background flex transition-colors duration-300">
              <Sidebar />
              <div className="flex-1 md:ml-20 lg:ml-64 flex flex-col min-h-screen">
                <Header />
                <div className="flex-1 pb-24 md:pb-8 pt-20 px-4 md:px-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/materi" element={<MaterialsDashboard />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/material/:phaseId/:chapterId" element={<MaterialView />} />
                    <Route path="/play" element={<PlayZone />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/games" element={<GameHub />} />
                    <Route path="/games/flashcards" element={<FlashcardsGame />} />
                    <Route path="/games/matching" element={<MatchingGame />} />
                    <Route path="/games/wordbuilder" element={<WordBuilderGame />} />
                    <Route path="/games/chronology" element={<ChronologyGame />} />
                    <Route path="/evaluation" element={<EvaluationHub />} />
                    <Route path="/evaluation/:phaseId" element={<PhaseEvalWrapper />} />
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
