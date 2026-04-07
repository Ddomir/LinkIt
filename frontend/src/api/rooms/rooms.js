import { supabase } from '../../supabaseClient'


// REMEMBER TO REMOVE THE AUTHENTICATION POLOCY YOU CREATED FOR
// ROOMS ONCE YOUR DONE CREATING YOUR ROUTES.
// ONCE YOU DID THAT, DELETE THIS MESSAGE.
// IF THIS MESSAGE HAS NOT BEEN DELETED, BRING THIS TO THE ATTENTION OF
// ANDRES


//GETTER FUNCTIONS
export async function getRoomById(id) {
  const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

/**
    Get all the rooms associated with a given user
    Parameters:
        UUID      This is the creator id of the room
*/
export async function fetchRooms(UUID) {
  const { data, error } = await supabase
    .from('room_users')
    .select('rooms!inner (*)')
    .eq('UID', UUID)

    //Catches errors
    if(error){
        console.error("❌ Get data Failed:", error.message);
        throw error;
    }else{
        console.log("✅ Get data Success! Data:", data);
    }
    //Returns the data
    return data
}

//SETTER FUNCTIONS
/**
    This function will create a new row based on the the id of the user column
    Parameters:
        user_id     The id of the user in the public.users table
        room_name   The desired name of the room. Defaults to "Untitled Room"
        isPrivate   The view status of the room. Defaults to "false"
        iconId      The id of the user in the public.icon table. Defaults to "null"
*/
export async function createRoom(user_id, room_name = "Untitled Room", isPrivate = false, iconId = null){
    console.log("Attempting to insert: ", user_id, " creating room ", room_name);

    const { data, error } = await supabase
        .from('rooms')
        .insert({ 
            creator_ID: user_id,
            name: room_name,
            is_private: isPrivate,
            icon: iconId
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

/** 
    Update the name of a desired room based on room id
    Parameters:
        id          Room id
        room_name   The new name of the room
*/
export async function updateRoomName(id, room_name) {
  const { data, error } = await supabase
    .from('rooms')
    .update({ name: room_name })
    .eq('id', id)
    .select()           //Gets the entire updated row sent back
    .single()           //Only send that row back

    //Catches errors
    if(error){
        console.error("❌ Update Failed:", error.message);
        throw error;
    }else{
        console.log("✅ Update Success! Data:", data);
    }
    return data
}

/**
    Update the viewing permission of the desired room based on the entered id
    Parameters:
        id                  Room id
        private_status      The desired viewing status of the room
*/
export async function updatePrivateStatus(id, private_status) {
  const { data, error } = await supabase
    .from('rooms')
    .update({ is_private: private_status })
    .eq('id', id)
    .select()           //Gets the entire updated row sent back
    .single()           //Only send that row back

    //Catches errors
    if(error){
        console.error("❌ Update Failed:", error.message);
        throw error;
    }else{
        console.log("✅ Update Success! Data:", data);
    }
    return data
}

/**
    Assign an icon to a room that previously did not have an icon
    Parameters:
        id                  Room id
        iconId              The id of the user in the public.icon table.
*/
export async function linkIcon(id, iconId){
    const { data, error } = await supabase
    .from('rooms')
    .update({ icon: iconId })
    .eq('id', id)
    .select()           //Gets the entire updated row sent back
    .single()           //Only send that row back

    //Catches errors
    if(error){
        console.error("❌ Update Failed:", error.message);
        throw error;
    }else{
        console.log("✅ Update Success! Data:", data);
    }
    return data
}

