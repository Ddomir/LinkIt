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

export default function Sidebar({callback}) {
    return (
        <>
            <div className="flex flex-col w-full h-full border-2 border-slate-300">
                <div className="flex justify-between text-white text-2xl">
                    <h1>Rooms</h1>
                    <button>Add</button>
                </div>

                <div className="flex flex-grow">
                </div>

                <button
                    className="bg-[#87F6B7] rounded-full text-[#0C0A0A] text-2xl p-2 px-8 cursor-pointer hover:scale-105 transition ease-in-out justify-self-center m-4"
                    onClick={callback}
                    id="google-logout-btn"
                >
                    Logout
                </button>
            </div>
        </>
    )
}