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

async function userInRoom(user_id, room_id) {
    const { data, error } = await supabase
        .from('room_users')
        .select('*')
        .eq('UID', user_id)
        .eq('room_id', room_id)

    if (error) throw error

    return (data.length != 0); 
}

// returns room data
export async function joinRoom(user_id, code) {
    // check if room code exists
    const room = await inviteCodeExists(code);
    if (room.length == 0) { // [] is DNE
        console.error("Invite code ", code, " does not exist!");
        return {err: -1};
    }
    // check if user already in room
    if (await userInRoom(user_id, room.id)) {
        console.error("User already in room ", room);
        return {err: -2};
    }

    // if all checks pass, join the room as a VIEWER (id: 8)
    createRoomUser(user_id, room.id, 8);
    return room;
}