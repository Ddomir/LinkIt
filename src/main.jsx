import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Ensure theme is applied before React mounts so dark is the default
// try {
//   const saved = localStorage.getItem('theme')
//   if (saved === 'light') document.documentElement.classList.remove('dark')
//   else document.documentElement.classList.add('dark') // default to dark when no saved preference
// } catch (e) {
//   // ignore (e.g. SSR or blocked storage)
// }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
