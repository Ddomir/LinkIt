import { useState, useEffect } from "react";
import MainContent from "./MainContent"
import ShareInvite from "./ShareInvite";
import Search from "./Search"
import { getLinks } from "./../api/links.js"

export default function Room() {
    const [showInvitePopup, setInvitePopup] = useState(false)
    const [linkData, setLinkData] = useState([]);

    useEffect(() => {
        const fetchLinks = async () => {
            const links = getLinks();
            setLinkData(links);
        }

        fetchLinks();
    }, [])

    const roomData = {
        name: "ACM SIG WebDev",
        icon: 1,
        links: linkData
    }

    const inviteData = {
        id: 1,
        createdAt: "2026-03-09T23:00:00",
        roomID: 1,
        link: "ABCDEFGHIJ"
    }

    console.log("Room data", roomData.links);

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