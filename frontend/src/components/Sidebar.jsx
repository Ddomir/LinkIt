const data = {
    Room1: {
        name: "Room 1",
        icon: 1,
    },
    Room2: {
        name: "Room 2",
        icon: 2,
    }
}

export default function Sidebar() {
    return (
        <>
            <div className="w-full h-full border-2 border-slate-300">
                <div className="flex justify-between text-white text-2xl">
                    <h1>Rooms</h1>
                    <button>Add</button>
                </div>
            </div>
        </>
    )
}