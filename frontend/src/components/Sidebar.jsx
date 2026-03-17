import React, { useState } from "react";
import CreateRoomPopup, { ICONS } from "./CreateRoomPopup";

import { createInvite } from "../api/invites"

function RoomIconByName({ name, className = "w-4 h-4" }) {
    const icon = ICONS.find(i => i.name === name);
    if (!icon) return null;
    return <span className={className}>{icon.svg}</span>;
}

// DELETE THIS WHEN FULLY IMPLEMENTING ROOM CREATION
function testingInvites() {
    createInvite(42) // replace this argument with the room_id when room is created
    .then(result => {
        console.log("✅ Invite creation success: ", result);
    })
    .catch(error => {
        console.log("❌ Invite creation failed: ", error);
    });
}

export default function Sidebar({callback, userId}) {
    const [rooms, setRooms] = useState([])
    const [selectedRoomId, setSelectedRoomId] = useState(null)
    const [showPopup, setShowPopup] = useState(false)

    const handleCreateRoom = ({ name, icon }) => {
        setRooms(prev => [...prev, { id: Date.now(), name, icon }])
        setShowPopup(false)
    }

    return (
        <div className="flex flex-col bg-[#0C0A0A] text-white h-full max-w-67">

            {/* Sidebar Header */}
            <div className="px-5 pt-4 pb-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl font-bold tracking-wide">Rooms</h3>
                    <button
                        onClick={() => setShowPopup(true)}
                        aria-label="Add room"
                        className="hover:bg-[#77f298] hover:text-black hover:cursor-pointer rounded-full p-1 transition-colors duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>
            </div>

            <p>{userId}</p>

            {/* Room list */}
            <div className="flex-1 overflow-auto px-3 py-1 scrollbar-thin">
                <div className="flex flex-col gap-1">
                    {rooms.map(room => (
                        <button
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={`flex items-center gap-2.5 w-full text-left rounded-xl px-3 py-2 cursor-pointer transition-colors duration-200 ease-in-out text-sm font-medium
                                ${selectedRoomId === room.id ? 'bg-[#77f298] text-black': 'hover:bg-[#77f298]/15 hover:text-white'}`}
                        >
                            <RoomIconByName name={room.icon} className="w-4 h-4 shrink-0 [&>svg]:w-4 [&>svg]:h-4" />
                            <span className="truncate">{room.name}</span>
                        </button>
                    ))}
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


                <button
                    className="bg-[#87F6B7] rounded-full text-[#0C0A0A] text-2xl p-2 px-8 cursor-pointer hover:scale-105 transition ease-in-out justify-self-center m-4"
                    onClick={testingInvites}
                >
                    TESTING INVITES
                </button>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-5 py-4">

                <button className="hover:text-[#77f298] cursor-pointer transition-colors duration-150" aria-label="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                        <path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"/>
                    </svg>
                </button>

                <button className="hover:text-[#77f298] cursor-pointer transition-colors duration-150" aria-label="Profile">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </button>
            </div>

            <CreateRoomPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                onCreate={handleCreateRoom}
            />
        </div>
    )
}