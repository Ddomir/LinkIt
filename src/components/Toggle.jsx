import { useEffect, useState } from 'react';

export default function Toggle({ onToggle }) { // A simple toggle button for dark mode / light mode
    const [isDark, setIsDark] = useState(true); // default: dark

    useEffect(() => {
        try {
            const saved = localStorage.getItem('theme');
            setIsDark(saved ? saved === 'dark' : true);
        } catch {
            setIsDark(true);
        }
    }, []);

    //Apply the theme to <html> 
    useEffect(() => { 
        const root = document.documentElement; 
        if (isDark) root.classList.add('dark'); 
        else root.classList.remove('dark');

        try {
            localStorage.setItem('theme', isDark ? 'dark' : 'light'); 
        } catch {}
        if (typeof onToggle === 'function') onToggle(isDark ? 'dark' : 'light');
    }, [isDark, onToggle]); 

    const handleToggle = () => setIsDark(prev => !prev); 
        
    // The button itself, with ARIA attributes for accessibility
    return (
        <button 
            type="button"
            onClick={handleToggle}
            role="switch" 
            aria-checked={isDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`theme-toggle ${isDark ? 'is-dark' : 'is-light'}`} 
        >
         {isDark ? (
            /* Sun icon */
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 4V2M12 22v-2M4.22 4.22L2.81 2.81M21.19 21.19l-1.41-1.41M4 12H2m20 0h-2M4.22 19.78l-1.41 1.41M21.19 2.81l-1.41 1.41M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            ) : (
            /* Moon icon */
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
            </svg>
            )}
            <span className="sr-only">{isDark ? 'Dark mode' : 'Light mode'}</span>
        </button>
    );  
}

