import { supabase } from '../../supabaseClient.js'

// ANDRES

// sorry andres we're now using supabase's built in user API :/
// but i'll use this for joining/fetchin related user info

// Join a room
// Parameters:
//      UID: user ID from session
//      room_id: id from room table
export async function joinRoom(UID, room_id) {
    const { data, error } = await supabase
        .from('room_users')
        .insert({
            UID: UID,
            room_id: room_id
        })
        .select()
        .single()

        if(error) throw error;
        return data
}


// Get a user's joined rooms
// Parameters:
//      UID: user ID from session
export async function getUserJoinedRooms(UID) {
    const { data, error } = await supabase
        .from('room_users')
        .select('room_id')
        .eq('UID', UID)
        if(error) throw error;
        return data
}



//GETTERS
/**
    Get the data of a user
    Parameters:
        id      This is the user id
*/
export async function getUser(UUID) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('UUID', UUID)
    .single()

    if(error) throw error;
    return data
}

export async function createUser(userId, userName, userEmail){
    const { data, error } = await supabase
        .from('users')
        .upsert({ 
            UUID: userId,
            name: userName,
            email: userEmail
        })
        .select()
        .single()
}
    
/**
 *  Update the username base on id
 *  Parameters:
 *     UUID        Username id
 *     userName    The new username
 */
export async function updateUsername(id, userName){
  const { data, error } = await supabase
    .from('users')
    .update({ name: userName })
    .eq('UUID', id)
    .select()           //Gets the entire updated row sent back
    .single()           //Only send that row back

    if(error) throw error;
    return data
}

