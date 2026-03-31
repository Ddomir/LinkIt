import React, { useState } from "react";
import CreateLinkPopup from "./CreateLinkPopup";
import ShareInvite from "./ShareInvite";

export default function Header({ roomData, inviteData, onAddCard }) {
    const [showLinkPopup, setShowLinkPopup] = useState(false);
    const [showInvitePopup, setInvitePopup] = useState(false)

    const handleCreateLink = (data) => {
        if (onAddCard && data) {
            onAddCard(data);
        }
        setShowLinkPopup(false);
    };

    

    return(
        <div className="flex items-center justify-between px-3 py-2">
            <h1 className="text-[#77f298]">{roomData.name}</h1>

            <div className="flex items-center gap-2">
                <div className="flex flex-row justify-between">
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

                {/*Create card button */}
                <button
                    onClick={() => setShowLinkPopup(true)}
                    aria-label="Add link or folder"
                    className="hover:bg-[#77f298] hover:text-black hover:cursor-pointer rounded-full p-1 transition-colors duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5 text-black bg-gray-300 rounded-full p-0.5">
                        <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
                    </svg>
                </button>
            </div>

            <CreateLinkPopup
                isOpen={showLinkPopup}
                onClose={() => setShowLinkPopup(false)}
                onCreate={handleCreateLink}
            />

            <ShareInvite isOpen={showInvitePopup} onClose={() => setInvitePopup(false)} inviteData={inviteData} />
        </div>
    )
}