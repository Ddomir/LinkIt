import Sidebar from './components/Sidebar'
import Room from './components/Room'

function App() {

  return (
    <>
    <div className='w-screen h-screen flex bg-slate-900'>
      <div className="w-100 h-full p-4">
        <Sidebar />
      </div>

      <Room />
    </div>
    </>
  )
}

export default App
