import React, { useState, useRef, useEffect } from "react";

const ICONS = [
    {
        id: 1,
        name: "link",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
        ),
    },
    {
        id: 2,
        name: "code",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
        ),
    },
    {
        id: 3,
        name: "wifi",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
            </svg>
        ),
    },
    {
        id: 4,
        name: "star",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
        ),
    },
    {
        id: 5,
        name: "bolt",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
        ),
    },
    {
        id: 6,
        name: "book",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
        ),
    },
];

export default function CreateRoomPopup({ isOpen, onClose, onCreate, creatorId }) {
    const [roomName, setRoomName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState(ICONS[0].name);
    const [joinRoom, setJoinRoom] = useState(true); 
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [roomCode, setRoomCode] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    useEffect(() => {
        if (isOpen) setIsPrivate(false);//reset private toggle when opening popup
    }, [isOpen]);

    if (!isOpen) return null;//don't render anything if popup isn't open

    const handleCreate = () => {
        if (!roomName.trim()) return;

        const iconObj = ICONS.find((i) => i.name === selectedIcon);
        const props = {
            creator_id: creatorId,
            name: roomName.trim(),
            icon: iconObj ? iconObj.id : null, //numeric icon id
            is_private: isPrivate,
        };
        onCreate(props);

        setRoomName("");
        setJoinRoom(true);
        setSelectedIcon(ICONS[0].name);
    };

    const handleJoin = () => {//does nothing for now, implement in the future
        //close popup and reset room code input (temp)
        onClose();
        setRoomCode("");
    };

    return (
        <div
            className="fixed inset-0 z-67 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fade-in_200ms_ease-out]"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-sm shadow-xl border border-white/10 animate-[slide-up_200ms_ease-out]"
                onClick={(e) => e.stopPropagation()} //prevent closing when clicking inside the popup
            >
            
            {/*Toggle buttons between join/create variants*/}
            <div className="flex justify-center mb-6">
                <div className="inline-flex items-center rounded-full border border-[#77f298] bg-transparent">
                    <button
                        onClick={() => setJoinRoom(true)}
                        className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-colors outline-none select-none 
                            ${joinRoom === true ? "bg-[#77f298] text-black" : "text-gray-400 hover:text-white"}`}
                    >
                        Join
                    </button>
                    <button
                        onClick={() => setJoinRoom(false)}
                        className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-colors outline-none select-none 
                            ${joinRoom === false ? "bg-[#77f298] text-black" : "text-gray-400 hover:text-white"}`}
                    >
                        Create
                    </button>
                </div>
            </div>

            
            {joinRoom === false ? (
            <>{/*Creating a room popup variant*/}
                <h2 className="text-white text-lg font-bold mb-5">Create Room</h2>
                <label className="block text-sm text-gray-400 mb-1.5">Room Name</label>
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g. ACM WebDev Room"
                    autoFocus
                    className="w-full rounded-lg bg-[#0C0A0A] border border-white/10 text-white placeholder-gray-500 px-3 py-2 text-sm outline-none focus:border-[#77f298]/60 transition-colors"
                    onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
                />

                {/*Icon selection*/}
                <div className="flex items-start justify-between mt-2">
                    <div className="flex items-center gap-4 ml-10">
                        <div className="text-sm text-gray-400">Icon</div>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowIconPicker((s) => !s)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2b2b2b] border border-white/10 hover:border-white hover:text-white transition-colors cursor-pointer"
                            >
                                {ICONS.find((i) => i.name === selectedIcon)?.svg}
                            </button>

                            {showIconPicker && (
                                <div className="absolute mt-2 w-60 bg-[#0C0A0A] border border-white/10 p-2 rounded-lg shadow-lg z-50">
                                    <div className="grid grid-cols-6 gap-2 animate-[slide-down_100ms_ease-out]">
                                        {ICONS.map((icon) => (
                                            <button
                                                key={icon.name}
                                                onClick={() => { setSelectedIcon(icon.name); setShowIconPicker(false); }}
                                                className="w-8 h-8 flex items-center justify-center rounded-md bg-[#1a1a1a] border border-white/10 p-1 hover:bg-[#77f298] hover:text-black transition-colors"
                                            >
                                                {icon.svg}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/*Private toggle*/}
                    <div className="flex items-center gap-2 mt-2 mr-15">
                        <span className="text-sm text-gray-400 mr-2">Private</span>
                        <input
                            type="checkbox"
                            checked={isPrivate === true}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="w-5 h-5 text-[#77f298] bg-[#0C0A0A] border border-white/10 rounded focus:ring-[#77f298]/50"
                        />
                    </div>
                </div>

                {/*Cancel/Create buttons*/}
                <div className="flex justify-center gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg text-sm text-gray-400 
                        hover:text-white transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!roomName.trim()}
                        className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#77f298] text-black 
                        hover:bg-[#5ee07e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Create
                    </button>
                </div>
            </>
            ) : (
            <>{/*Joining a room popup variant*/}
                <h2 className="text-white text-lg font-bold mb-5">Join a Room</h2>
                <h3 className="text-gray-400 text-sm mb-1">Enter room code</h3>

                <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="e.g. ABC123"
                    autoFocus
                    className="w-full rounded-lg bg-[#0C0A0A] border border-white/10 text-white placeholder-gray-500 px-3 py-2 text-sm outline-none focus:border-[#77f298]/60 transition-colors"
                    onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); }}
                />

                {/* Cancel/Join buttons */}
                <div className="flex justify-center gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg text-sm text-gray-400 
                        hover:text-white transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleJoin}
                        disabled={!roomCode.trim()}
                        className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#77f298] text-black 
                        hover:bg-[#5ee07e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Join
                    </button>
                </div>
            </>
            )}
            </div>
        </div>                    
    );
}

export { ICONS };
