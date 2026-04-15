import React, { useState, useEffect } from "react";
import { DynamicIcon } from 'lucide-react/dynamic';
import { getAllIcons } from "../../api/icons/icons";


export default function CreateRoomPopup({ isOpen, onClose, onCreate, onJoin }) {
    const [ICONS, setIcons] = useState([]);
    const [roomName, setRoomName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState(1);
    const [joinRoom, setJoinRoom] = useState(false); // false => Create view, true => Join view
    const [roomCode, setRoomCode] = useState("");

    useEffect(() => {
        const fetchIcons = async () => { 
            try {
                const response = await getAllIcons();
                setIcons(response);
            } 
            catch (error) {
                console.error("Error fetching icons:", error);
            }
        };

        fetchIcons(); 
    }, []);

    if (!isOpen) return null;//don't render anything if popup isn't open

    const handleCreate = async () => {
        if (!roomName.trim()) return;      
        onCreate({ name: roomName.trim(), icon: selectedIcon });
        setRoomName("");
        setSelectedIcon(1);
    };

    const handleJoin = () => {
        //close popup and reset room code input (temp)
        onJoin(roomCode);
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
                    onKeyDown={(e) => { 
                        if (e.key === "Enter") 
                            handleCreate(); 
                        if (e.key === "Escape")
                            onClose()
                        }}
                />

                <label className="block text-sm text-gray-400 mt-5 mb-2">Symbol</label>
                <div className="flex gap-2 flex-wrap">
                    {Array.from(ICONS).map((icon) => (
                        <button
                            key={icon.icon_name}
                            type="button"
                            onClick={() => setSelectedIcon(icon.id)}
                            className={`p-2 rounded-lg border transition-colors duration-150 cursor-pointer
                                ${selectedIcon === icon.id
                                    ? "bg-[#77f298] text-black border-[#77f298]"
                                    : "border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                                }`}
                        >
                            {/* dynamic icon renderer */}
                            <DynamicIcon name={icon.icon_name} color="currentColor" size={24} strokeWidth={2} />
                        </button>
                    ))}
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

