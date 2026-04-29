import "./index.css";
import { useState, useEffect } from "react";
import { supabase } from './supabaseClient';
import Dashboard from './pages/Dashboard';
import GuestView from './pages/GuestView';


function getGuestRoomCode() {
  const match = window.location.pathname.match(/^\/room\/([A-Z0-9]+)$/i);
  return match ? match[1].toUpperCase() : null;
}

function App() {
  const [session, setSession] = useState(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const guestCode = getGuestRoomCode() || sessionStorage.getItem('pendingJoinCode');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoaded(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    if (guestCode) sessionStorage.setItem('pendingJoinCode', guestCode);

    const redirectTo = import.meta.env.DEV
      ? window.location.origin
      : import.meta.env.VITE_REDIRECT_URL;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) alert(error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error.message);
  };

  if (!sessionLoaded) return null;

  // Logged-in: Dashboard handles both normal use and join-from-link
  if (session) {
    return <Dashboard session={session} callback={handleLogout} joinCode={guestCode} />;
  }

  // Not logged in on a /room/:code — guest read-only view
  if (guestCode) {
    return <GuestView inviteCode={guestCode} onLogin={handleGoogleLogin} />;
  }

	// Login page
	return (
		<div className="relative w-screen h-screen flex items-center justify-center overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(120deg, #1E221D, #0E100E)' }} />
      {/* Noise overlay */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%230E100E' filter='url(%23n)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'soft-light',
        opacity: 0.55,
      }} />

      {/* Card */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm mx-4 px-8 py-12 rounded-3xl"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>

        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <img src="/favicon.svg" alt="LinksIt logo" className="w-12 h-12" />
          <h1 className="text-4xl font-bold tracking-tight text-[#77f298]">LinksIt</h1>
          <p className="text-sm text-white/40 tracking-wide">Save and share links, together.</p>
        </div>

        <div className="w-full h-px bg-white/10" />

        {/* Google sign-in button */}
        <button
          onClick={handleGoogleLogin}
          id="google-btn"
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-full text-sm font-semibold text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-95"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
	);
}

export default App;
