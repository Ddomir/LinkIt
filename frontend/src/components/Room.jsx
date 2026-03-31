import { useState } from "react";
import MainContent from "./MainContent"
import ShareInvite from "./ShareInvite";
import Search from "./Search"
import Header from "./Header"

export const roomData = {
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

export const inviteData = {
    id: 1,
    createdAt: "2026-03-09T23:00:00",
    roomID: 1,
    link: "ABCDEFGHIJ"
}

export default function Room() {
    const [state, setState] = useState(roomData);

    const addCardToRoom = (data) => {
        const links = state.links || {};
        const maxId = Object.keys(links).length ? Math.max(...Object.keys(links).map((k) => Number(k))) : 0;
        const newId = maxId + 1;

        const newLink = {//data for creating new link
            id: newId,
            type: data.type || 'link',
            title: data.title || 'Untitled',
            link: data.link || '',
            roomid: 123,
            color: data.color ? data.color.replace('#','') : '87F6B7',
            isPinned: false,
            folderid: null,
            links: data.type === 'folder' ? [] : undefined,
            createdAt: new Date().toISOString(),
        };

        setState((prev) => ({
            ...prev,
            links: {
                ...prev.links,
                [newId]: newLink,
            }
        }));
    };

    return (
        <div className="w-full h-full flex flex-col bg-linear-120 from-[#1E221D] to-[#0E100E] text-5xl">
            <Header roomData={state} inviteData={inviteData} onAddCard={addCardToRoom} />
            <div className = "w-1/2">
                <Search />
            </div>
            <MainContent roomData={state} />
        </div>
    )
}