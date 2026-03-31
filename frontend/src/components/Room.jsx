import { useState } from "react";
import MainContent from "./MainContent"
import ShareInvite from "./ShareInvite";
import Search from "./Search"
import { useEffect, useState } from "react"
import { getLinkByRoomId } from "../api/links" 

// const roomData = {
//     name: "ACM SIG WebDev",
//     icon: 1,
//     links: {
//         1: {//link card example
//             id: 1,
//             type: "link",
//             title: "2/17 Figma Presentation",
//             link: "https://www.docs.google.com/presentation/d/1Xow9n8j3l7qjvawdawd2aYpXoQZsJkLh5e5z6a7b8c9d0e1f2g/edit?usp=sharing",
//             roomid: 123,
//             color: "87F6B7",
//             icon: ICONS[0].name,
//             isPinned: true,
//             folderid: null, //not in a folder
//             createdAt: "2026-03-09T23:00:00"
//         },
//         2: {//link card example
//             id: 2,
//             type: "link",
//             title: "LinkIt File",
//             link: "www.google.com",
//             roomid: 123,
//             color: "ECACEC",
//             icon: ICONS[0].name,
//             isPinned: false,
//             folderid: null, //not in a folder
//             createdAt: "2026-03-09T23:00:00"
//         },
//         3: {//folder card example
//             id: 3,
//             type: "folder",
//             title: "Presentations",
//             links: ["www.google.com", "www.bing.com", "www.yahoo.com", "jacksonvillespaghettimonster.com"],
//             color: "ACDDEC",
//             icon: ICONS[0].name,
//             isPinned: false,
//             parentfolder: 3, //not in a folder, but required for folder cards. Set to own id or null?
//             createdAt: "2026-03-09T23:00:00"
//         },
//         4: {//folder card example
//             id: 4,
//             type: "folder",
//             title: "Presentations",
//             links: ["www.google.com", "www.bing.com", "www.yahoo.com"],
//             color: "ACDDEC",
//             icon: ICONS[0].name,
//             isPinned: false,
//             parentfolder: 4,
//             createdAt: "2026-03-09T23:00:00"
//         }
//     }
// }


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
            icon: "wifi",
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
            icon: "code",
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
            icon: "globe",
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
            icon: "star",
            isPinned: false,
            parentfolder: 4,
            createdAt: "2026-03-09T23:00:00"
        }
    }
}

const inviteData = {
    id: 1,
    createdAt: "2026-03-09T23:00:00",
    roomID: 1,
    link: "ABCDEFGHIJ"
}

export default function Room() {
    const [roomData, setData] = useState([])
    useEffect(() => getLinkByRoomId(), [])

    
    const [showInvitePopup, setInvitePopup] = useState(false)

    return (
        <div className="w-full h-full flex flex-col bg-linear-120 from-[#1E221D] to-[#0E100E] text-5xl">
            <div className="flex flex-row justify-between">
                <h1 className="p-3 text-[#77f298]">{roomData.name}</h1>
                <div className="flex flex-row gap-8">

                    {/* share invite button */}
                    <button 
                        className="text-[#ffffff] hover:text-[#77f298] cursor-pointer transition-colors duration-150 mx-8" 
                        aria-label="Profile"
                        onClick={() => setInvitePopup(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                        </svg>
                    </button>
                </div>
            </div>

            <ShareInvite isOpen={showInvitePopup} onClose={() => setInvitePopup(false)} inviteData={inviteData} />
            <MainContent roomData={roomData} />
        </div>
    )
}