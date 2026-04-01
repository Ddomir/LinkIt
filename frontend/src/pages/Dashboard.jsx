import Sidebar from '../components/Sidebar'
import Room from '../components/Room'
import { createRoom, fetchRooms } from '../api/rooms/rooms'
import { createRoomUser, joinRoom } from '../api/rooms/roomUsers'
import { createInvite } from '../api/invites'
import { createUser } from '../api/users/users'
import {useState, useEffect, useRef} from 'react'

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

export default function Dashboard({session ,callback}) {
  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [joinError, setJoinError] = useState(null)

  // Add a ref to track if we've already synced this specific user ID
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

    const fetchRoomData = async () =>{
      if (!session?.user) return;
      const { user } = session;

      try {
        const data = await fetchRooms(user.id);
        const formattedRooms = [];
        data.map( (arr) => {
          formattedRooms.push({
            id: arr.rooms.id, 
            name: arr.rooms.name,
            icon: REVERSE_ICON_MAP[arr.rooms.icon] || 'x' 
          });
        });

        setRooms(formattedRooms);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    }

    //Triggering the functions
    syncUserToDatabase();
    fetchRoomData();

  },[session])

  async function createRoomsDB(room_name, iconId, private_status = false){
    if (!session?.user) {
      console.error("No active session found.");
      return;
    }
    const { user } = session;
    
    try {
      const newRoom = await createRoom(user.id, room_name, private_status, iconId);
      console.log("Room created successfully");

      await createInvite(newRoom.id);
      await createRoomUser(user.id, newRoom.id, 10); // 10 is the role id for owner!

      //UI update
      const formattedNewRoom = {
        id: newRoom.id,
        name: newRoom.name,
        icon: REVERSE_ICON_MAP[newRoom.icon] || 'star'
      };

      setRooms((prevRooms) => [...prevRooms, formattedNewRoom]);
      //setRooms((prevRooms) => [...prevRooms, newRoom]);
    } catch (err) {
      console.error("Failed to create room:", err);
    }
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
        // todo handle displaying
        if (newRoom.err == -1) { // -1 = code DNE
          setJoinError("The invite code <" + code + "> does not exist!");
        }

        else if (newRoom.err = -2) { // -2 = user already in room
          setJoinError("You are already in the room!");
        }
        
        return;
      }

      console.log("User joined room ", newRoom, " successfully");

      //UI update
      const formattedNewRoom = {
        id: newRoom.id,
        name: newRoom.name,
        icon: REVERSE_ICON_MAP[newRoom.icon] || 'x'
      };

      setRooms((prevRooms) => [...prevRooms, formattedNewRoom]);
      //setRooms((prevRooms) => [...prevRooms, newRoom]);
    } catch (err) {
      console.error("Failed to join room: see error message", err);
    }
  }

  return (
    <>
      <div className="w-screen h-screen flex">
        { joinError &&
          <div className='bg-[#1a1a1a] rounded-2xl p-4 w-full max-w-sm shadow-xl border border-white/10 animate-[slide-up_200ms_ease-out]
            z-1000 absolute right-0 bottom-0 text-[#ff0000] text-xl font-bold tracking-wide px-8 m-4'>
            <p>Error! {joinError}</p>
          </div>
        }
        
        <div className="flex-none h-full">
          <Sidebar rooms={rooms} createRoomsDB={createRoomsDB} callback={callback} selectedRoomId={selectedRoomId} onSelectRoom={setSelectedRoomId} joinRoomDB={joinRoomDB} popupCallback={setJoinError} />
        </div>
        <div className="flex-1 min-h-0 h-full">
          <Room roomId={selectedRoomId} />
        </div>
      </div>
    </>
  )
}
