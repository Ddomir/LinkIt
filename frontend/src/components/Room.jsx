import { useState, useEffect } from "react";
import MainContent from "./MainContent";
import Header from "./Header";
import { createLink, getLinksByRoomId } from "../api/links";
import { createFolder, getFoldersByRoomId } from "../api/folders";
import { getRoomById } from "../api/rooms/rooms";
import { supabase } from "../supabaseClient";

export default function Room({ roomId , COLOR_OPTIONS}) {
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
            color: COLOR_OPTIONS[l.color],
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
            color: COLOR_OPTIONS[f.color],
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

  const addCardToRoom = async (data) => {
    setRoomData((prev) => {
      const links = prev.links || {};
      const maxId = Object.keys(links).length ? Math.max(...Object.keys(links).map((k) => Number(k))) : 0;
      const newId = maxId + 1;

      var new_obj = {
        id: newId,
        type: data.type || "link",
        title: data.title || "Untitled",
        link: data.link || "",
        roomid: roomId ?? 0,
        color: data.color ? data.color.id : "#d1d5db",
        icon: data.icon || "link",
        isPinned: false,
        folderid: null,
        parentfolder: data.parentfolder ?? null,
        links: data.type === "folder" ? [] : undefined,
        createdAt: new Date().toISOString(),
      };

      if (data.type == "link")
      {
        createLink(new_obj.title, new_obj.link, new_obj.isPinned, new_obj.color, roomId, new_obj.folderid);
      }
      
      else if (data.type == "folder")
      {
        createFolder(new_obj.name, new_obj.color, new_obj.icon, roomId, new_obj.folderid, new_obj.isPinned);
      }

      return {
        ...prev,
        links: {
          ...links,
          [newId]: new_obj,
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
      <Header roomData={roomData} inviteData={inviteData} onAddCard={addCardToRoom} COLOR_OPTIONS={COLOR_OPTIONS} />
      <div className="w-1/2">
      </div>
      <MainContent roomData={roomData} />
    </div>
  );
}
