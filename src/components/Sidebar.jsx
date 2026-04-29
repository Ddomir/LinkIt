import React, { useState, useEffect } from "react";
import CreateRoomPopup from "./popups/CreateRoomPopup";
import { DynamicIcon } from 'lucide-react/dynamic';
import Toggle from "./Toggle";

function RoomIcon({ icon, className = "w-4 h-4" }) {
    const iconObj = typeof icon === 'number'
        ? ICONS.find(i => i.id === icon)
        : ICONS.find(i => i.name === icon);
    if (!iconObj) return null;
    return <span className={className}>{iconObj.svg}</span>;
}

export default function Sidebar({rooms, createRoomsDB, callback, selectedRoomId, onSelectRoom, joinRoomDB, popupCallback, isOpen, onClose, onLeaveRoom, openPopup}) {
    const [showPopup, setShowPopup] = useState(false)
    const [openMenuId, setOpenMenuId] = useState(null)
    const [leaveMode, setLeaveMode] = useState(false)
    const [visible, setVisible] = useState(Boolean(isOpen))

    const isMobile = typeof isOpen === 'boolean'

    useEffect(() => {
        if (!isMobile) return
        if (!isOpen) return
        const onKey = (e) => { if (e.key === 'Escape') onClose && onClose() }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isOpen, onClose])

    const content = (
        <div className="flex flex-col surface h-full max-w-full">
            {/* Drag handle — mobile only */}
            {isMobile && (
                <div className="flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
                    <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>
            )}

            {/* Sidebar Header */}
            <div className="px-5 pt-4 pb-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-wide">Rooms</h3>
                    <button
                        onClick={() => openPopup()}
                        aria-label="Add room"
                        className="accent rounded-full p-1 hover:opacity-90 hover:cursor-pointer transition-colors duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Room list */}
            <div className="flex-1 overflow-auto px-3 py-1 scrollbar-thin">
                <div className="flex flex-col gap-1">
                    {rooms.map(room => (
                        <div key={room.id} className="relative group">
                            <button
                                onClick={() => { onSelectRoom(room.id); setOpenMenuId(null); setLeaveMode(false); onClose?.(); }}
                                className={`flex items-center gap-2.5 w-full text-left rounded-xl px-3 py-2 cursor-pointer transition-colors duration-200 ease-in-out text-sm font-medium
                                    ${selectedRoomId === room.id ? 'accent text-[var(--accent-foreground)]' : 'hover:opacity-90'}`}
                            >
                                <DynamicIcon name={room.icon} color="currentColor" size={24} strokeWidth={2} />
                                <span className="truncate">{room.name}</span>
                            </button>

                            {/* Mobile leave mode: minus button */}
                            {isMobile && leaveMode && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onLeaveRoom && onLeaveRoom(room.id); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                                    aria-label="Leave room"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}

                            {/* Desktop: three-dots hover menu */}
                            {!isMobile && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === room.id ? null : room.id); }}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-opacity duration-150 cursor-pointer
                                            ${selectedRoomId === room.id ? 'text-(--accent-foreground) hover:bg-black/10' : 'hover:bg-white/10'}
                                            ${openMenuId === room.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                        aria-label="Room options"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path d="M6 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                                        </svg>
                                    </button>
                                    {openMenuId === room.id && (
                                        <div className="absolute right-0 top-full mt-1 z-50 surface border border-white/10 rounded-xl shadow-xl overflow-hidden">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); onLeaveRoom && onLeaveRoom(room.id); }}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5 cursor-pointer transition-colors"
                                            >
                                                Leave room
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-5 py-4">
                {/* <Toggle /> */}

                {/* Mobile-only: manage rooms toggle */}
                {isMobile && (
                    <button
                        onClick={() => setLeaveMode(m => !m)}
                        className={`cursor-pointer transition-colors duration-150 ${leaveMode ? 'text-red-400' : 'hover:text-[#77f298]'}`}
                        aria-label="Manage rooms"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                    </button>
                )}

                {/* Logout — exit door icon */}
                <button
                    onClick={callback}
                    className="hover:text-[#77f298] cursor-pointer transition-colors duration-150"
                    aria-label="Logout"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                </button>
            </div>
        </div>
    )

    useEffect(() => {
        if (!isMobile) return
        if (isOpen) { setVisible(true); return }
        const id = setTimeout(() => setVisible(false), 700)
        return () => clearTimeout(id)
    }, [isOpen])

    if (isMobile) {
        if (!visible) return null
        return (
            <div className="fixed inset-0 z-40 md:hidden">
                <div
                    className={`absolute inset-0 bg-black transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-50' : 'opacity-0'}`}
                    onClick={onClose}
                />
                <div className={`absolute left-0 right-0 bottom-0 h-[92vh] rounded-t-2xl overflow-hidden transform-gpu will-change-transform transition-transform duration-500 ease-[cubic-bezier(.16,.84,.3,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    {content}
                </div>
            </div>
        )
    }
    return content
}
