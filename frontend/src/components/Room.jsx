import { useState, useEffect } from "react";
import MainContent from "./MainContent";
import ShareInvite from "./ShareInvite";
import Search from "./Search";
import Header from "./Header";
import { getLinksByRoomId } from "../api/links";
import { getFoldersByRoomId } from "../api/folders";
import { getRoomById } from "../api/rooms/rooms";
import { supabase } from "../supabaseClient";

export default function Room({ roomId }) {
  const [showInvitePopup, setInvitePopup] = useState(false);
  const [roomData, setRoomData] = useState({ name: "", links: {} });
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const fetchRoomContent = async () => {
      setLoading(true);
      try {
        const [room, links, folders] = await Promise.all([
          getRoomById(roomId),
          getLinksByRoomId(roomId),
          getFoldersByRoomId(roomId),
        ]);

        const linksMap = {};
        links.forEach((l) => {
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
          };
        });

        folders.forEach((f) => {
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
          };
        });

        setRoomData({ name: room.name, links: linksMap });

        const invRes = await supabase
          .from("invites")
          .select("*")
          .eq("room_id", roomId)
          .single();
        if (!invRes.error) {
          setInviteData(invRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch room content:", err);
        setRoomData({ name: "", links: {} });
        setInviteData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomContent();
  }, [roomId]);

  const addCardToRoom = (data) => {
    setRoomData((prev) => {
      const links = prev.links || {};
      const maxId = Object.keys(links).length ? Math.max(...Object.keys(links).map((k) => Number(k))) : 0;
      const newId = maxId + 1;
      const newLink = {
        id: newId,
        type: data.type || "link",
        title: data.title || "Untitled",
        link: data.link || "",
        roomid: roomId ?? 0,
        color: data.color ? data.color.replace("#", "") : "87F6B7",
        icon: data.icon || "link",
        isPinned: false,
        folderid: null,
        parentfolder: data.parentfolder ?? null,
        links: data.type === "folder" ? [] : undefined,
        createdAt: new Date().toISOString(),
      };

      return {
        ...prev,
        links: {
          ...links,
          [newId]: newLink,
        },
      };
    });
  };

  if (!roomId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-linear-120 from-[#1E221D] to-[#0E100E]">
        <p className="text-[#77f298] text-xl">Select a room to get started</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-linear-120 from-[#1E221D] to-[#0E100E]">
        <p className="text-[#77f298] text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-linear-120 from-[#1E221D] to-[#0E100E] text-5xl">
      <Header roomData={roomData} inviteData={inviteData} onAddCard={addCardToRoom} />
      <div className="w-1/2">
        <Search />
      </div>
      <MainContent roomData={roomData} />
      <ShareInvite isOpen={showInvitePopup} onClose={() => setInvitePopup(false)} inviteData={inviteData} />
    </div>
  );
}
