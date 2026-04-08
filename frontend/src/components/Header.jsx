import React, { useState } from "react";
import CreateLinkPopup from "./CreateLinkPopup";
import ShareInvite from "./ShareInvite";
import Search from "./Search";

export default function Header({ roomData, inviteData, onAddCard, COLOR_OPTIONS }) {
    const [showLinkPopup, setShowLinkPopup] = useState(false);
    const [showInvitePopup, setInvitePopup] = useState(false)

    const handleCreateLink = (data) => {
        if (onAddCard && data) {
            onAddCard(data);
        }
        setShowLinkPopup(false);
    };

    

    return (
        <div className="flex flex-col justify-between px-3 py-3 w-full">

            <div className="w-full flex flex-col gap-2">
                <div className="flex items-center justify-center sm:justify-between gap-2">
                    <h1 className="text-[#77f298] text-3xl sm:text-4xl font-bold text-center sm:text-left pl-3">{roomData.name}</h1>

                    <div className="hidden sm:flex items-center justify-between gap-3">
                        <button
                            className="text-[#ffffff] hover:text-[#77f298] cursor-pointer transition-colors duration-150 p-2"
                            aria-label="Share invite"
                            onClick={() => setInvitePopup(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                            </svg>
                        </button>

                        <button
                            onClick={() => setShowLinkPopup(true)}
                            aria-label="Add link or folder"
                            className="hover:bg-[#77f298] hover:text-black hover:cursor-pointer rounded-full p-2 transition-colors duration-150"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5 text-black bg-gray-300 rounded-full p-0.5">
                                <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="w-full flex items-center justify-between gap-3">
                    <div className="w-full sm:w-1/2">
                        <Search />
                    </div>

                </div>
            </div>

            {/* Mobile floating buttons: fixed bottom-right on small screens */}
            <div className="sm:hidden fixed right-4 bottom-6 flex flex-row gap-3 z-50">
                <button
                    className="text-[#ffffff] hover:text-[#77f298] cursor-pointer transition-colors duration-150 p-2"
                    aria-label="Share invite"
                    onClick={() => setInvitePopup(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                    </svg>
                </button>

                <button
                    onClick={() => setShowLinkPopup(true)}
                    aria-label="Add link or folder"
                    className="hover:bg-[#77f298] hover:text-black hover:cursor-pointer rounded-full p-2 transition-colors duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5 text-black bg-gray-300 rounded-full p-0.5">
                        <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
                    </svg>
                </button>
            </div>

            <CreateLinkPopup
                COLOR_OPTIONS={COLOR_OPTIONS}
                isOpen={showLinkPopup}
                onClose={() => setShowLinkPopup(false)}
                onCreate={handleCreateLink}
            />

            <ShareInvite isOpen={showInvitePopup} onClose={() => setInvitePopup(false)} inviteData={inviteData} />
        </div>
    )
}