import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        navigate('/');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        navigate('/');
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, setUser]);

  const handleLogin = async (provider) => {
    setLoading(true);
    try {
      // Bypass Supabase jika belum ada kredensial di file .env (mode pengembangan)
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        setTimeout(() => {
          setUser({ email: 'pelajar@genzitoria.com', id: 'mock-user-123' });
          setLoading(false);
          navigate('/');
        }, 1000);
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error.message);
      alert('Error logging in. Check console for details.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Animated background bubbles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-liquid-purple rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-liquid-blue rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="glass-panel p-10 max-w-md w-full relative z-10 flex flex-col items-center">
        <div className="text-center mb-10">
          <h1 className="text-display-lg mb-2">
            <span className="text-gen block">Gen</span>
            <span className="text-zitoria">Zitoria</span>
          </h1>
          <p className="text-on-surface opacity-80">Jelajahi Waktu, Temukan Sejarahmu.</p>
        </div>

        <div className="w-full space-y-4">
          <button
            onClick={() => handleLogin('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-surface text-on-surface py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-glass-border font-bold"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Lanjutkan dengan Google
          </button>
        </div>

        <div className="mt-8 text-center text-sm opacity-70">
          Dengan masuk, kamu menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
        </div>
      </div>
    </div>
  );
};

export default Login;
