import Sidebar from './components/Sidebar'
import Room from './components/Room'

function App() {

  return (
    <>
    <div className='w-screen h-screen flex'>
      <div className="w-100 h-full">
        <Sidebar />
      </div>

      <Room />
    </div>
    </>
  )
}

export default App
