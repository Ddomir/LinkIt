import Sidebar from '../components/Sidebar'
import Room from '../components/Room'

export default function Dashboard({callback}) {
  return (
    <>
      <div className="w-screen h-screen flex">
        <div className="flex-none h-full">
          <Sidebar callback={callback} />
        </div>

        <div className="flex-1 min-h-0 h-full">
          <Room />
        </div>
      </div>
    </>
  )
}
