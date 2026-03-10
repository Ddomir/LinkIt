import "./index.css";
import { useState, useEffect } from "react";
import { supabase } from './supabaseClient';
import Dashboard from './pages/Dashboard';

function App() {
	const [session, setSession] = useState(false);

  // load supabase auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // login with google
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      // options: {
      //   redirectTo: import.meta.env.VITE_REDIRECT_URL
      // },
    });
    
    if (error) alert(error.message);
  };

  // logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    }
  };
  
	// login page
	return (
		<> 
      <script src="https://accounts.google.com/gsi/client" async></script>

			<div className="w-screen h-screen justify-center items-center flex bg-slate-900">

        { session ?
        // logged in
        <Dashboard callback={handleLogout} userId={session.user.id}/>
        :
        // login page
				<div className="flex justify-center items-center flex-col gap-4">
					<h1 className="text-6xl font-bold text-[#87F6B7]">LinkIt.</h1>

					<div className="flex flex-col justify-center items-center bg-[#0C0A0A] w-100 py-12 rounded-4xl text-white gap-4">
						{/* <input  className="bg-[#4F4F4F] text-md p-4 rounded-4xl w-[75%]" 
                        placeholder='Username'
                        id="username-field"
                        type="text">
                </input>

                <input  className="bg-[#4F4F4F] text-md p-4 rounded-4xl w-[75%]" 
                        placeholder='Password'
                        id="password-field"
                        type="password">
                </input>

                <div></div> */}

						<button
							className="bg-[#87F6B7] rounded-full text-[#0C0A0A] text-2xl p-4 px-8 cursor-pointer hover:scale-105 transition ease-in-out"
							onClick={handleGoogleLogin}
              id="google-btn"
						>
							Sign in with Google
						</button>
					</div>
				</div>
        
        }
			</div>
		</>
	);
}

export default App;
