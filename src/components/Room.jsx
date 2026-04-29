import { useState, useEffect } from "react";
import MainContent from "./MainContent";
import Header from "./Header";
import EditCardPopup from "./popups/EditCardPopup";
import { getLinksByRoomId, getLinksByFolderId, getLinkFolderIdsByRoomId, createLink, updateLink, removeLink } from "../api/links";
import { getFoldersByRoomId, getSubfoldersByFolderId, createFolder, updateFolder, removeFolder } from "../api/folders";
import { getRoomById } from "../api/rooms/rooms";
import { supabase } from "../supabaseClient";

export default function Room({ roomId, COLOR_OPTIONS, openPopup, readOnly = false }) {
  const [showInvitePopup, setInvitePopup] = useState(false);
  const [roomData, setRoomData] = useState({ name: "", links: {} });
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ folders: true, links: true, pinnedOnly: false });
  const [sortOption, setSortOption] = useState('pinned');
  const [viewMode, setViewMode] = useState(true); // true for tile view, false for list view
  const [selectedFolder, setSelectedFolder] = useState(null); // { id, title } when inside a folder
  const [folderData, setFolderData] = useState(null); // roomData-shaped object for folder contents
  const [editItem, setEditItem] = useState(null); // item being edited

  const openFolder = async (folder) => {
    try {
      const [links, subfolders] = await Promise.all([
        getLinksByFolderId(folder.id),
        getSubfoldersByFolderId(folder.id),
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
      subfolders.forEach((f) => {
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
      setFolderData({ name: folder.title, links: linksMap });
      setSelectedFolder(folder);
    } catch (err) {
      console.error("Failed to fetch folder contents:", err);
    }
  };

  const closeFolder = () => {
    setSelectedFolder(null);
    setFolderData(null);
  };

  useEffect(() => {
    if (!roomId) return;

    setSelectedFolder(null);
    setFolderData(null);

    const fetchRoomContent = async () => {
      setLoading(true);
      try {
        const [room, links, folders, folderLinks] = await Promise.all([
          getRoomById(roomId),
          getLinksByRoomId(roomId),
          getFoldersByRoomId(roomId),
          getLinkFolderIdsByRoomId(roomId),
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

        const folderLinkCounts = {};
        folderLinks.forEach(({ parentfolder }) => {
          folderLinkCounts[parentfolder] = (folderLinkCounts[parentfolder] ?? 0) + 1;
        });

        folders.forEach((f) => {
          linksMap[`f_${f.id}`] = {
            id: f.id,
            type: "folder",
            title: f.title,
            links: new Array(folderLinkCounts[f.id] ?? 0),
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
        const parentFolderId = selectedFolder?.id ?? null;
        const row = await createFolder(data.title || "Untitled", data.color ?? null, null, roomId, parentFolderId);
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
        if (selectedFolder) {
          setFolderData((prev) => ({
            ...prev,
            links: { ...prev.links, [`f_${row.id}`]: newFolder },
          }));
        } else {
          setRoomData((prev) => ({
            ...prev,
            links: { ...prev.links, [`f_${row.id}`]: newFolder },
          }));
        }
      } else {
        const folderId = selectedFolder?.id ?? null;
        const row = await createLink(data.link || "", data.title || "Untitled", data.color ?? null, roomId, folderId);
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
        if (selectedFolder) {
          // add to folder view and update the room-level link count
          setFolderData((prev) => ({
            ...prev,
            links: { ...prev.links, [row.id]: newLink },
          }));
          setRoomData((prev) => {
            const folderKey = `f_${selectedFolder.id}`;
            const folder = prev.links[folderKey];
            if (!folder) return prev;
            return {
              ...prev,
              links: {
                ...prev.links,
                [folderKey]: { ...folder, links: new Array(folder.links.length + 1) },
              },
            };
          });
        } else {
          setRoomData((prev) => ({
            ...prev,
            links: { ...prev.links, [row.id]: newLink },
          }));
        }
      }
    } catch (err) {
      console.error("Failed to create card:", err);
    }
  };

  const deleteCard = async (id, type) => {
    try {
      if (type === "folder") {
        await removeFolder(id);
        const key = `f_${id}`;
        if (selectedFolder) {
          setFolderData((prev) => {
            const next = { ...prev.links };
            delete next[key];
            return { ...prev, links: next };
          });
        }
        setRoomData((prev) => {
          const next = { ...prev.links };
          delete next[key];
          return { ...prev, links: next };
        });
      } else {
        await removeLink(id);
        if (selectedFolder) {
          setFolderData((prev) => {
            const next = { ...prev.links };
            delete next[id];
            return { ...prev, links: next };
          });
          setRoomData((prev) => {
            const folderKey = `f_${selectedFolder.id}`;
            const folder = prev.links[folderKey];
            if (!folder) return prev;
            return {
              ...prev,
              links: {
                ...prev.links,
                [folderKey]: { ...folder, links: new Array(Math.max(0, folder.links.length - 1)) },
              },
            };
          });
        } else {
          setRoomData((prev) => {
            const next = { ...prev.links };
            delete next[id];
            return { ...prev, links: next };
          });
        }
      }
    } catch (err) {
      console.error("Failed to delete card:", err);
    }
  };

  const saveCard = async ({ id, type, title, link, color, pinned }) => {
    try {
      if (type === "folder") {
        const row = await updateFolder(id, title, color, null, pinned);
        const patch = { title: row.title, color: row.color, isPinned: row.pinned ?? false };
        const key = `f_${id}`;
        if (selectedFolder) {
          setFolderData((prev) => ({
            ...prev,
            links: { ...prev.links, [key]: { ...prev.links[key], ...patch } },
          }));
        }
        setRoomData((prev) => ({
          ...prev,
          links: { ...prev.links, [key]: { ...prev.links[key], ...patch } },
        }));
      } else {
        const row = await updateLink(id, link, title, color, pinned);
        const patch = { title: row.title, link: row.links ?? "", color: row.color, isPinned: row.pinned ?? false };
        if (selectedFolder) {
          setFolderData((prev) => ({
            ...prev,
            links: { ...prev.links, [id]: { ...prev.links[id], ...patch } },
          }));
        } else {
          setRoomData((prev) => ({
            ...prev,
            links: { ...prev.links, [id]: { ...prev.links[id], ...patch } },
          }));
        }
      }
    } catch (err) {
      console.error("Failed to update card:", err);
    }
  };

  if (!roomId) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 app-bg room-panel overflow-hidden lg:rounded-l-2xl">
        <p className="text-[#77f298] text-xl">Select a room to get started</p>
        <button
          onClick={openPopup}
          className="px-6 py-2 rounded-full bg-[#77f298] text-black font-semibold hover:bg-[#5ee07e] transition-colors duration-150 cursor-pointer"
        >
          Join or Create a Room
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center app-bg room-panel overflow-hidden lg:rounded-l-2xl">
        <p className="text-[#77f298] text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col app-bg room-panel overflow-hidden lg:rounded-l-2xl">
      <EditCardPopup
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        onSave={saveCard}
        item={editItem}
        COLOR_OPTIONS={COLOR_OPTIONS}
      />
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
      <Header roomData={roomData} inviteData={inviteData} onAddCard={readOnly ? null : addCardToRoom} COLOR_OPTIONS={COLOR_OPTIONS}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        sortOption={sortOption}
        setSortOption={setSortOption}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedFolder={selectedFolder}
        readOnly={readOnly}
      />
      {selectedFolder && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 text-sm text-white/60">
          <button onClick={closeFolder} className="hover:text-white transition-colors">
            {roomData.name}
          </button>
          <span>/</span>
          <span className="text-white font-medium">{selectedFolder.title}</span>
        </div>
      )}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        {/* Room view — slides out to the left when folder opens */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-in-out"
          style={{ transform: selectedFolder ? 'translateX(-100%)' : 'translateX(0%)' }}
        >
          <MainContent
            roomData={roomData}
            colorMap={COLOR_OPTIONS}
            searchQuery={searchQuery}
            filters={filters}
            sortOption={sortOption}
            viewMode={viewMode}
            onFolderClick={openFolder}
            onEdit={readOnly ? null : setEditItem}
            onDelete={readOnly ? null : (id, type) => deleteCard(id, type)}
          />
        </div>
        {/* Folder view — slides in from the right when folder opens */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-in-out"
          style={{ transform: selectedFolder ? 'translateX(0%)' : 'translateX(100%)' }}
        >
          <MainContent
            roomData={folderData ?? { name: '', links: {} }}
            colorMap={COLOR_OPTIONS}
            searchQuery={searchQuery}
            filters={filters}
            sortOption={sortOption}
            viewMode={viewMode}
            onFolderClick={openFolder}
            onEdit={readOnly ? null : setEditItem}
            onDelete={readOnly ? null : (id, type) => deleteCard(id, type)}
          />
        </div>
      </div>
      </div>
    </div>
  );
}