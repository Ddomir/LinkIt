import { useState, useEffect } from "react";
import MainContent from "./MainContent";
import Header from "./Header";
import EditCardPopup from "./popups/EditCardPopup";
import { getLinksByRoomId, getLinksByFolderId, getLinkFolderIdsByRoomId, createLink, updateLink, removeLink } from "../api/links";
import { getFoldersByRoomId, getSubfoldersByFolderId, createFolder, updateFolder, removeFolder } from "../api/folders";
import { getRoomById } from "../api/rooms/rooms";
import { supabase } from "../supabaseClient";

export const ROLE_VIEWER = 8;
export const ROLE_EDITOR = 9;
export const ROLE_OWNER  = 10;

export default function Room({ roomId, COLOR_OPTIONS, openPopup, readOnly = false, mobileOpen = false, onHamburgerClick, userRole = null, isPrivateRoom = false, onRoomDeleted, onRoomRenamed, currentUserId = null, pendingRoom = null, onJoinPending }) {
  const [showInvitePopup, setInvitePopup] = useState(false);
  const [roomData, setRoomData] = useState({ name: "", links: {} });
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ folders: true, links: true, pinnedOnly: false });
  const [sortOption, setSortOption] = useState('pinned');
  const [viewMode, setViewMode] = useState(true); // true for tile view, false for list view
  // Stack of { folder: {id, title}, data: {name, links} }
  const [folderStack, setFolderStack] = useState([]);
  const [navDirection, setNavDirection] = useState('forward'); // 'forward' | 'back'
  const [editItem, setEditItem] = useState(null); // item being edited

  const selectedFolder = folderStack.length > 0 ? folderStack[folderStack.length - 1].folder : null;
  const folderData = folderStack.length > 0 ? folderStack[folderStack.length - 1].data : null;

  // Patch the data of the top folder in the stack
  const setFolderData = (updater) => {
    setFolderStack(prev => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const top = next[next.length - 1];
      next[next.length - 1] = { ...top, data: typeof updater === 'function' ? updater(top.data) : updater };
      return next;
    });
  };

  const fetchFolderContents = async (folder) => {
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
    return { name: folder.title, links: linksMap };
  };

  const openFolder = async (folder) => {
    try {
      const data = await fetchFolderContents(folder);
      setNavDirection('forward');
      setFolderStack(prev => [...prev, { folder, data }]);
    } catch (err) {
      console.error("Failed to fetch folder contents:", err);
    }
  };

  // Pop one level; if stack empties we're back at room root
  const closeFolder = () => { setNavDirection('back'); setFolderStack(prev => prev.slice(0, -1)); };

  useEffect(() => {
    if (!roomId) return;

    setFolderStack([]);

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

  // Real-time: if this room gets deleted, force the user back to no-room
  useEffect(() => {
    if (!roomId) return;
    const channel = supabase
      .channel(`room-deleted-${roomId}`)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, () => {
        onRoomDeleted?.(roomId);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
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

  // Expired invite — show message, no join option
  if (pendingRoom && pendingRoom.id === roomId && pendingRoom.expired) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 app-bg room-panel overflow-hidden lg:rounded-l-2xl px-6 text-center">
        <p className="text-[#77f298] text-2xl font-bold">{pendingRoom.name}</p>
        <p className="text-white/50 text-sm max-w-xs">This invite link has expired. Ask the room owner for a new one.</p>
      </div>
    );
  }

  // Private room the user hasn't joined yet — show join gate instead of empty content
  if (readOnly && pendingRoom && pendingRoom.id === roomId && pendingRoom.isPrivate) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 app-bg room-panel overflow-hidden lg:rounded-l-2xl px-6 text-center">
        <p className="text-[#77f298] text-2xl font-bold">{pendingRoom.name}</p>
        <p className="text-white/50 text-sm max-w-xs">This is a private room. You won't be able to see any content until you join.</p>
        <button
          onClick={onJoinPending}
          className="mt-2 px-8 py-2.5 rounded-full bg-[#77f298] text-black font-semibold hover:bg-[#5ee07e] transition-colors cursor-pointer"
        >
          Join Room
        </button>
      </div>
    );
  }

  // For public rooms everyone can edit; for private rooms need Editor or Owner role
  const canEdit = !readOnly && (!isPrivateRoom || (userRole !== null && userRole >= ROLE_EDITOR));

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
      <Header roomData={roomData} inviteData={inviteData} onAddCard={canEdit ? addCardToRoom : null} COLOR_OPTIONS={COLOR_OPTIONS}
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
        mobileOpen={mobileOpen}
        onHamburgerClick={onHamburgerClick}
        userRole={userRole}
        isPrivateRoom={isPrivateRoom}
        currentUserId={currentUserId}
        roomId={roomId}
        onRoomDeleted={onRoomDeleted}
        onRoomRenamed={onRoomRenamed}
        onInviteRegenerated={setInviteData}
      />
      {readOnly && pendingRoom && pendingRoom.id === roomId && !pendingRoom.isPrivate && (
        <div className="mx-4 mb-2 flex items-center justify-between gap-3 rounded-xl border border-[#77f298]/30 bg-[#77f298]/10 px-4 py-3">
          <p className="text-sm text-[#77f298]">You're previewing this room. Join to save and add links.</p>
          <button
            onClick={onJoinPending}
            className="shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#77f298] text-black hover:bg-[#5ee07e] transition-colors cursor-pointer"
          >
            Join
          </button>
        </div>
      )}
      {folderStack.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 text-sm flex-wrap">
          {/* Back chevron — always goes up one level */}
          <button
            onClick={closeFolder}
            className="flex items-center text-white/50 hover:text-white transition-colors cursor-pointer pr-1"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Room root */}
          <button
            onClick={() => { setNavDirection('back'); setFolderStack([]); }}
            className="text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            {roomData.name}
          </button>

          {/* Each folder level except the last */}
          {folderStack.slice(0, -1).map((entry, i) => (
            <span key={entry.folder.id} className="flex items-center gap-1.5">
              <span className="text-white/20">/</span>
              <button
                onClick={() => { setNavDirection('back'); setFolderStack(prev => prev.slice(0, i + 1)); }}
                className="text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                {entry.folder.title}
              </button>
            </span>
          ))}

          {/* Current folder — not clickable */}
          <span className="flex items-center gap-1.5">
            <span className="text-white/20">/</span>
            <span className="text-white font-medium">{selectedFolder.title}</span>
          </span>
        </div>
      )}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <div
          key={folderStack.length === 0 ? '__root__' : folderStack[folderStack.length - 1].folder.id}
          className="absolute inset-0"
          style={{ animation: `${navDirection === 'forward' ? 'slide-in-right' : 'slide-in-left'} 280ms ease-in-out` }}
        >
          <MainContent
            roomData={folderStack.length === 0 ? roomData : (folderData ?? { name: '', links: {} })}
            colorMap={COLOR_OPTIONS}
            searchQuery={searchQuery}
            filters={filters}
            sortOption={sortOption}
            viewMode={viewMode}
            onFolderClick={openFolder}
            onEdit={canEdit ? setEditItem : null}
            onDelete={canEdit ? (id, type) => deleteCard(id, type) : null}
          />
        </div>
      </div>
      </div>
    </div>
  );
}