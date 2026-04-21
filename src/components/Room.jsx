import { useState, useEffect } from "react";
import MainContent from "./MainContent";
import Header from "./Header";
import { getLinksByRoomId, createLink } from "../api/links";
import { getFoldersByRoomId, createFolder } from "../api/folders";
import { getRoomById } from "../api/rooms/rooms";
import { supabase } from "../supabaseClient";

export default function Room({ roomId , COLOR_OPTIONS}) {
  const [showInvitePopup, setInvitePopup] = useState(false);
  const [roomData, setRoomData] = useState({ name: "", links: {} });
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ folders: true, links: true, pinnedOnly: false });
  const [sortOption, setSortOption] = useState('pinned');

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
            link: l.links ?? "",
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

  const addCardToRoom = async (data) => {
    try {
      if (data.type === "folder") {
        const row = await createFolder(data.title || "Untitled", data.color ?? null, null, roomId);
        const newFolder = {
          id: row.id,
          type: "folder",
          title: row.title,
          color: row.color,
          icon: row.icon || null,
          isPinned: row.pinned ?? false,
          parentfolder: row.folder_id ?? null,
          links: [],
          createdAt: row.created_at,
        };
        setRoomData((prev) => ({
          ...prev,
          links: { ...prev.links, [`f_${row.id}`]: newFolder },
        }));
      } else {
        const row = await createLink(data.link || "", data.title || "Untitled", data.color ?? null, roomId, null);
        const newLink = {
          id: row.id,
          type: row.type || "link",
          title: row.title,
          link: row.links ?? "",
          roomid: row.room_id,
          color: row.color,
          icon: row.icon || "link",
          isPinned: row.pinned ?? false,
          folderid: row.parentfolder ?? null,
          createdAt: row.created_at,
        };
        setRoomData((prev) => ({
          ...prev,
          links: { ...prev.links, [row.id]: newLink },
        }));
      }
    } catch (err) {
      console.error("Failed to create card:", err);
    }
  };

  if (!roomId) {
    return (
      <div className="w-full h-full flex items-center justify-center app-bg">
        <p className="text-[#77f298] text-xl">Select a room to get started</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center app-bg">
        <p className="text-[#77f298] text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col app-bg">
      <Header roomData={roomData} inviteData={inviteData} onAddCard={addCardToRoom} COLOR_OPTIONS={COLOR_OPTIONS}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <div className="w-1/2">
      </div>
      <MainContent roomData={roomData} colorMap={COLOR_OPTIONS} searchQuery={searchQuery} filters={filters} sortOption={sortOption} />
    </div>
  );
}
