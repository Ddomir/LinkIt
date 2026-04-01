import { supabase } from '../../supabaseClient'
import { inviteCodeExists } from "../invites";

export async function createRoomUser(user_id, room_id, role){
    console.log("Attempting to insert: ", user_id);

    const { data, error } = await supabase
        .from('room_users')
        .insert({ 
            room_id: room_id,
            UID: user_id,
            role: role,
        })
        .select()
        .single()
    
    //Catches errors
    if(error){
        console.error("❌ Insert Failed:", error.message);
        throw error;
    }else{
        console.log("✅ Insert Success! Data:", data);
    }
    return data
}

// returns room_id
export async function joinRoom(user_id, code) {
    // check if room code exists
    const room = await inviteCodeExists(code);
    if (room.room_id == -1) { // -1 is DNE
        console.error("Invite code ", code, " does not exist!");
        return -1;
    }

    // if so, join the room as a VIEWER (id: 8)
    createRoomUser(user_id, room.id, 8);
    return room;
}