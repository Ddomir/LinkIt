import { useState, useEffect } from "react";
import MainContent from "./MainContent"
import ShareInvite from "./ShareInvite";
import { getLinksByRoomId } from "../api/links";
import { getFoldersByRoomId } from "../api/folders";
import { getRoomById } from "../api/rooms/rooms";
import { supabase } from "../supabaseClient";

export default function Room({ roomId }) {
    const [showInvitePopup, setInvitePopup] = useState(false)
    const [roomData, setRoomData] = useState(null)
    const [inviteData, setInviteData] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!roomId) return

        const fetchRoomContent = async () => {
            setLoading(true)
            try {
                const [room, links, folders] = await Promise.all([
                    getRoomById(roomId),
                    getLinksByRoomId(roomId),
                    getFoldersByRoomId(roomId),
                ])

                const linksMap = {}
                links.forEach(l => {
                    linksMap[l.id] = {
                        id: l.id,
                        type: l.type,
                        title: l.title,
                        link: l.links?.[0] ?? "",
                        roomid: l.room_id,
                        color: l.color,
                        icon: l.icon,
                        isPinned: l.pinned ?? false,
                        folderid: l.parentfolder,
                        createdAt: l.createdAt,
                    }
                })
                folders.forEach(f => {
                    linksMap[`f_${f.id}`] = {
                        id: f.id,
                        type: "folder",
                        title: f.title,
                        links: [],
                        color: f.color,
                        icon: f.icon,
                        isPinned: f.pinned ?? false,
                        parentfolder: f.folder_id,
                        createdAt: f.created_at,
                    }
                })

                setRoomData({ name: room.name, links: linksMap })

                const invRes = await supabase.from('invites').select('*').eq('room_id', roomId).single()
                if (!invRes.error) setInviteData(invRes.data)
            } catch (err) {
                console.error("Failed to fetch room content:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchRoomContent()
    }, [roomId])

    if (!roomId) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-linear-120 from-[#1E221D] to-[#0E100E]">
                <p className="text-[#77f298] text-xl">Select a room to get started</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-linear-120 from-[#1E221D] to-[#0E100E]">
                <p className="text-[#77f298] text-xl">Loading...</p>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col bg-linear-120 from-[#1E221D] to-[#0E100E] text-5xl">
            <div className="flex flex-row justify-between">
                <h1 className="p-3 text-[#77f298]">{roomData?.name}</h1>
                <div className="flex flex-row gap-8">
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
