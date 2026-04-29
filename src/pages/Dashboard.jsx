import Sidebar from '../components/Sidebar'
import Room from '../components/Room'
import { createRoom, fetchRooms, deleteRoom } from '../api/rooms/rooms'
import { getLinksByRoomId } from '../api/links'
import { createRoomUser, joinRoom, removeRoomUser } from '../api/rooms/roomUsers'
import { createInvite } from '../api/invites'
import { createUser } from '../api/users/users'
import {useState, useEffect, useRef, useCallback} from 'react'
import { getColors } from '../api/colors'
import CreateRoomPopup from '../components/popups/CreateRoomPopup'
import { supabase } from '../supabaseClient';

export const ROLE_VIEWER = 8;
export const ROLE_EDITOR = 9;
export const ROLE_OWNER = 10;


const REVERSE_ICON_MAP = {
  1: "link",
  2: "code",
  3: "wifi",
  4: "star",
  5: "bolt",
  6: "book",
  7: "heart",
  8: "music",
  9: "image",
  20: "video",
  24: "globe"
};

export default function Dashboard({session, callback, joinCode}) {
  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [joinError, setJoinError] = useState(null)
  const [COLOR_OPTIONS, setColorOptions] = useState([])
  const [mobileOpen, setMobileOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(288)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartWidth = useRef(0)
  const MIN_SIDEBAR = 200
  const MAX_SIDEBAR = 480
  const [showRoomPopup, setShowRoomPopup] = useState(false)
  const [pendingRoom, setPendingRoom] = useState(null) // { id, name, icon, code } — invited but not yet joined

  const hasSynced = useRef(false);

  useEffect(()=>{    
    const syncUserToDatabase = async () => {
      // 1. Safety check: make sure the session and user actually exist
      if (!session?.user || hasSynced.current) return;

      const { user } = session;
      try {
        hasSynced.current = true;
        await createUser(user.id, "PlaceHolder Until someone gets the username", user.email);
      } catch (err) {
        hasSynced.current = false;
        console.error("Failed to sync user:", err);
      }
    }

    const fetchRoomList = async () =>{
      if (!session?.user) return;
      const { user } = session;

      try {
        const data = await fetchRooms(user.id);
        const formattedRooms = [];
        data.map( (arr) => {
          formattedRooms.push({
            id: arr.rooms.id,
            name: arr.rooms.name,
            icon: REVERSE_ICON_MAP[arr.rooms.icon] || 'x',
            role: arr.role,
            isPrivate: arr.rooms.is_private,
          });
        });

        setRooms(formattedRooms);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    }

    const fetchColors = async () =>{
      try {
        const data = await getColors();
        const colorMap = {};
        data.forEach(item => {
          colorMap[item.id] = { background: `linear-gradient(to right, ${item.left_hex}, ${item.right_hex})` };
        });
        setColorOptions(colorMap);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    }

    //Triggering the functions
    syncUserToDatabase();
    fetchRoomList();
    fetchColors();

  },[session])

  // Resolve joinCode: already a member → select it; not a member → show pending entry in sidebar
  const hasResolvedJoin = useRef(false);
  useEffect(() => {
    if (!joinCode || !session?.user || hasResolvedJoin.current) return;
    hasResolvedJoin.current = true;

    const resolve = async () => {
      sessionStorage.removeItem('pendingJoinCode');

      const { data: invite } = await supabase
        .from('invites')
        .select('room_id, expires_at, rooms(name, icon, is_private)')
        .eq('link', joinCode)
        .maybeSingle();

      if (!invite) return;
      if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        setPendingRoom({
          id: invite.room_id,
          name: invite.rooms?.name ?? 'Unknown room',
          icon: REVERSE_ICON_MAP[invite.rooms?.icon] || 'link',
          code: joinCode,
          isPrivate: invite.rooms?.is_private ?? false,
          expired: true,
        });
        setSelectedRoomId(invite.room_id);
        return;
      }

      const roomId = invite.room_id;

      const { data: membership, error: memErr } = await supabase
        .from('room_users')
        .select('room_id')
        .eq('UID', session.user.id)
        .eq('room_id', roomId)
        .maybeSingle();

      if (membership) {
        setSelectedRoomId(roomId);
      } else {
        setPendingRoom({
          id: roomId,
          name: invite.rooms?.name ?? 'Unnamed room',
          icon: REVERSE_ICON_MAP[invite.rooms?.icon] || 'link',
          code: joinCode,
          isPrivate: invite.rooms?.is_private ?? false,
        });
        setSelectedRoomId(roomId);
      }
    };

    resolve();
  }, [joinCode, session])

  async function createRoomsDB(room_name, iconId, private_status = false){
    if (!session?.user) {
      console.error("No active session found.");
      return;
    }
    const { user } = session;
    
    try {
      const newRoom = await createRoom(user.id, room_name, private_status, iconId);

      await createInvite(newRoom.id);
      await createRoomUser(user.id, newRoom.id, 10); // 10 is the role id for owner!

      //UI update
      const formattedNewRoom = {
        id: newRoom.id,
        name: newRoom.name,
        icon: REVERSE_ICON_MAP[newRoom.icon] || 'star',
        role: ROLE_OWNER,
        isPrivate: newRoom.is_private,
      };

      setRooms((prevRooms) => [...prevRooms, formattedNewRoom]);
      return formattedNewRoom;
    } catch (err) {
      console.error("Failed to create room:", err);
    }
  }

  async function leaveRoomDB(room_id) {
    if (!session?.user) return;
    const { user } = session;
    try {
      await removeRoomUser(user.id, room_id);
      setRooms((prev) => prev.filter(r => r.id !== room_id));
      if (selectedRoomId === room_id) setSelectedRoomId(null);
    } catch (err) {
      console.error("Failed to leave room:", err);
    }
  }

  async function deleteRoomDB(room_id) {
    try {
      await deleteRoom(room_id);
      setRooms((prev) => prev.filter(r => r.id !== room_id));
      if (selectedRoomId === room_id) setSelectedRoomId(null);
    } catch (err) {
      console.error("Failed to delete room:", err);
    }
  }

  function renameRoomLocal(room_id, newName) {
    setRooms(prev => prev.map(r => r.id === room_id ? { ...r, name: newName } : r));
  }

  function demoteOwnerToEditor(room_id) {
    setRooms(prev => prev.map(r => r.id === room_id ? { ...r, role: 9 } : r));
  }

  async function joinPendingRoom() {
    if (!pendingRoom) return;
    await joinRoomDB(pendingRoom.code);
    const roomId = pendingRoom.id;
    setRooms(prev => {
      const already = prev.find(r => r.id === roomId);
      if (!already) {
        return [...prev, { id: roomId, name: pendingRoom.name, icon: pendingRoom.icon, role: ROLE_VIEWER, isPrivate: pendingRoom.isPrivate ?? false }];
      }
      return prev.map(r => r.id === roomId ? { ...r, role: ROLE_VIEWER } : r);
    });
    setPendingRoom(null);
    // Force Room to re-fetch by briefly clearing then restoring the selected room
    setSelectedRoomId(null);
    setTimeout(() => setSelectedRoomId(roomId), 0);
  }

  async function joinRoomDB(code) {
    if (!session?.user) {
      console.error("No active session found.");
      return;
    }
    const { user } = session;
    setJoinError(null);

    try {
      const newRoom = await joinRoom(user.id, code);

      if (newRoom.err) {
        console.error("Failed to join room: see error message");
        if (newRoom.err == -1) {
          setJoinError("The invite code <" + code + "> does not exist!");
        } else if (newRoom.err == -2) {
          setJoinError("You are already in the room!");
        }
        return;
      }


      const formattedNewRoom = {
        id: newRoom.id,
        name: newRoom.name,
        icon: REVERSE_ICON_MAP[newRoom.icon] || 'x',
        role: ROLE_VIEWER,
        isPrivate: newRoom.is_private,
      };

      setRooms((prevRooms) => [...prevRooms, formattedNewRoom]);
      return formattedNewRoom;
    } catch (err) {
      console.error("Failed to join room: see error message", err);
    }
  }

  const onDragStart = useCallback((e) => {
    isDragging.current = true
    dragStartX.current = e.clientX
    dragStartWidth.current = sidebarWidth

    const onMove = (e) => {
      if (!isDragging.current) return
      const delta = e.clientX - dragStartX.current
      setSidebarWidth(Math.min(MAX_SIDEBAR, Math.max(MIN_SIDEBAR, dragStartWidth.current + delta)))
    }
    const onUp = () => {
      isDragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [sidebarWidth])

  return (
    <>
      <div className="w-screen h-screen flex" style={{ background: 'var(--surface)' }}>
        { joinError &&
          <div className='bg-[#1a1a1a] rounded-2xl p-4 w-full max-w-sm shadow-xl border border-white/10 animate-[slide-up_200ms_ease-out]
            z-[9999] absolute right-0 bottom-0 text-[#ff0000] text-xl font-bold tracking-wide px-8 m-4 flex items-center justify-between gap-4'>
            <p>Error! {joinError}</p>
            <button onClick={() => setJoinError(null)} className="shrink-0 text-white/40 hover:text-white transition-colors cursor-pointer text-base font-normal">✕</button>
          </div>
        }

        <CreateRoomPopup
          isOpen={showRoomPopup}
          onClose={() => { setShowRoomPopup(false); setJoinError(null); }}
          onCreate={async ({ name, icon }) => { const room = await createRoomsDB(name, icon); setShowRoomPopup(false); if (room?.id) setSelectedRoomId(room.id); }}
          onJoin={async (code) => { const room = await joinRoomDB(code); if (room?.id) { setShowRoomPopup(false); setSelectedRoomId(room.id); } }}
        />
        
        <div className="hidden lg:flex lg:flex-none h-full relative" style={{ width: sidebarWidth }}>
          <div className="w-full h-full">
            <Sidebar rooms={rooms} createRoomsDB={createRoomsDB} callback={callback} selectedRoomId={selectedRoomId} onSelectRoom={setSelectedRoomId} joinRoomDB={joinRoomDB} popupCallback={setJoinError} onLeaveRoom={leaveRoomDB} openPopup={() => setShowRoomPopup(true)} pendingRoom={pendingRoom} onJoinPending={joinPendingRoom} />
          </div>
          {/* Resize handle */}
          <div
            className="absolute right-0 top-0 bottom-0 w-3 flex items-center justify-center cursor-col-resize group z-10"
            onMouseDown={onDragStart}
          >
            <div className="w-1 h-10 rounded-full bg-white/10 group-hover:bg-white/30 transition-colors duration-150" />
          </div>
        </div>

        <div className="md:hidden">
          <Sidebar rooms={rooms} createRoomsDB={createRoomsDB} callback={callback} selectedRoomId={selectedRoomId} onSelectRoom={setSelectedRoomId} joinRoomDB={joinRoomDB} popupCallback={setJoinError} onLeaveRoom={leaveRoomDB} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} openPopup={() => setShowRoomPopup(true)} pendingRoom={pendingRoom} onJoinPending={joinPendingRoom} />
        </div>

        {/* Mobile hamburger — fixed above all stacking contexts */}
        <button
          className={`md:hidden fixed top-3 left-3 z-60 p-2 rounded-md cursor-pointer transition-colors duration-300 ${mobileOpen ? 'bg-[#77f298] text-black' : 'text-white'}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        
        <div className="flex-1 min-w-0 h-full overflow-hidden lg:rounded-l-2xl">
          <Room
            roomId={selectedRoomId}
            COLOR_OPTIONS={COLOR_OPTIONS}
            openPopup={() => setShowRoomPopup(true)}
            readOnly={!!pendingRoom && selectedRoomId === pendingRoom.id}
            mobileOpen={mobileOpen}
            onHamburgerClick={() => setMobileOpen(o => !o)}
            userRole={rooms.find(r => r.id === selectedRoomId)?.role ?? null}
            isPrivateRoom={rooms.find(r => r.id === selectedRoomId)?.isPrivate ?? false}
            onRoomDeleted={deleteRoomDB}
            onRoomRenamed={renameRoomLocal}
            onOwnershipTransferred={demoteOwnerToEditor}
            currentUserId={session?.user?.id}
            pendingRoom={pendingRoom}
            onJoinPending={joinPendingRoom}
          />
        </div>
      </div>
    </>
  )
}