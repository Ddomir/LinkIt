import MainContent from "./MainContent"
import {ICONS} from "./CreateRoomPopup"
import Search from "./Search"
import { useEffect, useState } from "react"
import { getLinkByRoomId } from "../api/links" 

const roomData = {
    name: "ACM SIG WebDev",
    icon: 1,
    links: {
        1: {//link card example
            id: 1,
            type: "link",
            title: "2/17 Figma Presentation",
            link: "https://www.docs.google.com/presentation/d/1Xow9n8j3l7qjvawdawd2aYpXoQZsJkLh5e5z6a7b8c9d0e1f2g/edit?usp=sharing",
            roomid: 123,
            color: "87F6B7",
            icon: ICONS[0].name,
            isPinned: true,
            folderid: null, //not in a folder
            createdAt: "2026-03-09T23:00:00"
        },
        2: {//link card example
            id: 2,
            type: "link",
            title: "LinkIt File",
            link: "www.google.com",
            roomid: 123,
            color: "ECACEC",
            icon: ICONS[0].name,
            isPinned: false,
            folderid: null, //not in a folder
            createdAt: "2026-03-09T23:00:00"
        },
        3: {//folder card example
            id: 3,
            type: "folder",
            title: "Presentations",
            links: ["www.google.com", "www.bing.com", "www.yahoo.com", "jacksonvillespaghettimonster.com"],
            color: "ACDDEC",
            icon: ICONS[0].name,
            isPinned: false,
            parentfolder: 3, //not in a folder, but required for folder cards. Set to own id or null?
            createdAt: "2026-03-09T23:00:00"
        },
        4: {//folder card example
            id: 4,
            type: "folder",
            title: "Presentations",
            links: ["www.google.com", "www.bing.com", "www.yahoo.com"],
            color: "ACDDEC",
            icon: ICONS[0].name,
            isPinned: false,
            parentfolder: 4,
            createdAt: "2026-03-09T23:00:00"
        }
    }
}



export default function Room() {
    const [data, setData] = useState([])
    useEffect(() => getLinkByRoomId(), [])

    return (
        <div className="w-full h-full flex flex-col bg-linear-120 from-[#1E221D] to-[#0E100E] text-5xl">
            <h1 className="p-3 text-[#77f298]">{roomData.name}</h1>
            <Search /> {/* search component with input and buttons */}
            <MainContent roomData={roomData} />
        </div>
    )
}