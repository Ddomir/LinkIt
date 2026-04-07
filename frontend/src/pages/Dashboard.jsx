import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Room from '../components/Room'

export default function Dashboard({callback}) {
  const [mobileOpen, setMobileOpen] = useState(false) // State to track if the sidebar is open on mobile

  return (
    <>
      <div className="w-screen h-screen flex">
        {/* Desktop sidebar retains previous behavior on md+ screens */}
        <div className="flex-none h-full hidden md:block">
          <Sidebar callback={callback} />
        </div>

        {/* Mobile hamburger + overlay sidebar - only visible on smaller screens */}
        <div className="md:hidden"> 
          <button
            className ="m-3 p-2 rounded-md text-white bg-[#0C0A0A] z-50 fixed left-2 bottom-2"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)} 
          >
            {/* simple hamburger icon */} 
            <svg xmlns="http://www.w3.org/2000/svg" className ="w-6 h-6" fill="none" viewBox=" 0 0 24 24" strokeWidth={2} stroke="currentColor"> 
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Sidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} callback={callback} />
        </div>
      
        <div className="flex-1 min-h-0 h-full">
          <Room />
        </div>
      </div>
    </>
  )
}
