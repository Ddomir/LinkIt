import Sidebar from '../components/Sidebar'
import Room from '../components/Room'
import { createRoom, fetchRooms } from '../api/rooms/rooms'
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
        const formattedRooms = data.map(room => ({
          id: room.id,
          name: room.name,
          icon: REVERSE_ICON_MAP[room.icon] || 'star' // Convert 5 -> 'link'
        }));

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
      console.log("Room created succsessfully");

      const newRoomInv = await createInvite(newRoom.id);

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

  return (
    <>
      <div className="w-screen h-screen flex">
        <div className="flex-none h-full">
          <Sidebar rooms={rooms} createRoomsDB={createRoomsDB} callback={callback} />
        </div>
        <div className="flex-1 min-h-0 h-full">
          <Room />
        </div>
      </div>
    </>
  )
}
