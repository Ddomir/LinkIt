import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Room from '../components/Room'
import { ca } from 'react-day-picker/locale';

export default function Dashboard({callback}) {
  return (
    <>
    <div className='w-screen h-screen flex bg-slate-900'>
      <div className="w-100 h-full p-4">
        <Sidebar callback={callback} />
      </div>
      
      <Room />
    </div>
      
    </>
  )
}
