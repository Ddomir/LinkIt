import React, { useState, useEffect } from "react";
import CreateRoomPopup from "./popups/CreateRoomPopup";
import { DynamicIcon } from 'lucide-react/dynamic';


function RoomIcon({ icon, className = "w-4 h-4" }) {
    const iconObj = typeof icon === 'number'
        ? ICONS.find(i => i.id === icon)
        : ICONS.find(i => i.name === icon);
    if (!iconObj) return null;
    return <span className={className}>{iconObj.svg}</span>;
}


export default function Sidebar({rooms, createRoomsDB, callback, selectedRoomId, onSelectRoom, joinRoomDB, popupCallback, isOpen, onClose}) {
    const [showPopup, setShowPopup] = useState(false)
    const [visible, setVisible] = useState(Boolean(isOpen)) // Local state to control if the sidebar is mounted at all, for animation purposes

    const handleCreateRoom = ({ name, icon }) => {
        createRoomsDB(name, icon);
        setShowPopup(false);
        popupCallback(null);
    }

    const handleJoinRoom = (code) => {
        joinRoomDB(code);
        setShowPopup(false);
        popupCallback(null);
    }

    //Escape key closes overlay when in mobile overlay mode
    useEffect(() => { 
        if (typeof isOpen !== 'boolean') return 
        if (!isOpen) return 
        const onKey = (e) => { if (e.key === 'Escape') onClose && onClose() } 
        document.addEventListener('keydown', onKey) 
        return () => document.removeEventListener('keydown', onKey) 
    }, [isOpen, onClose])

    // Keep the exact existing sidebar markup here as 'content' 
    const content = (
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

            {/* <p>{sessionStorage.user?.id}</p> */}
            {/* Room list */}
            <div className="flex-1 overflow-auto px-3 py-1 scrollbar-thin">
                <div className="flex flex-col gap-1">
                    {rooms.map(room => (
                        <button
                            key={room.id}
                            onClick={() => onSelectRoom(room.id)}
                            className={`flex items-center gap-2.5 w-full text-left rounded-xl px-3 py-2 cursor-pointer transition-colors duration-200 ease-in-out text-sm font-medium
                                ${selectedRoomId === room.id ? 'bg-[#77f298] text-black': 'hover:bg-[#77f298]/15 hover:text-white'}`}
                        >
                            <DynamicIcon name={room.icon} color="currentColor" size={24} strokeWidth={2} />

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
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-5 py-4">

                <button className="hover:text-[#77f298] cursor-pointer transition-colors duration-150" aria-label="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"/>
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
                onClose={() => {setShowPopup(false); popupCallback(null)}}
                onCreate={handleCreateRoom}
                onJoin={handleJoinRoom}
            />
        </div>
    )

    //If parent passes isOpen prop, render sidebar as overlay for mobile
    //Otherwise, render normal sidebar for desktop
    //keep overlay mounted during close so animation can run
    useEffect(() => {
        if (typeof isOpen !== 'boolean') return
        if (isOpen) {
            setVisible(true)
            return
        }

        const id = setTimeout(() => setVisible(false), 700)
        return () => clearTimeout(id)
    }, [isOpen])

    if (typeof isOpen === 'boolean') {
        if (!visible) return null

        return (
            <div className="fixed inset-0 z-40 md:hidden">
                {/* Backdrop: click to close; animate opacity */}
                <div
                    className={`absolute inset-0 bg-black transition-opacity duration-700 ease-in-out ${isOpen ? 'opacity-50' : 'opacity-0'}`}
                    onClick={onClose}
                />
                {/* Sliding panel: GPU-accelerated transform, will-change hint, longer duration + custom easing */}
                <div className={`absolute left-0 top-0 bottom-0 w-72 transform-gpu will-change-[transform] transition-transform duration-700 ease-[cubic-bezier(.16,.84,.3,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {content}
                </div>
            </div>
        )
    }
    return content
}