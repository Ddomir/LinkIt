const roomData = {
    name: "Room1",
    icon: 1,
    links: {
        1: {
            title: "Link1",
            linkTo: "www.google.com",
            color: 1,
            isPinned: false
        },
        2: {
            title: "Link1",
            linkTo: "www.google.com",
            color: 1,
            isPinned: false
        },
        3: {
            title: "Link1",
            linkTo: "www.google.com",
            color: 1,
            isPinned: false
        }
    }
}

export default function Room() {
    return (
        <div className="
            w-full h-full 
            bg-linear-120 from-slate-400 to-slate-700 
            rounded-l-4xl p-5
            text-5xl font-bold">
            <h1>{roomData.name}</h1>
        </div>
    )
}