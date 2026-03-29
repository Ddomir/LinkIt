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

        if(error){
            console.error("❌ Insert Failed:", error.message);
            throw error;
        } else {
            console.log("✅ Insert Success! Data:", data);
        }
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
        if(error){
            console.error("❌ Get Failed:", error.message);
            throw error;
        } else {
            console.log("✅ Get Success! Data:", data);
        }
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

//     //Catches errors
//     if(error){
//         console.error("❌ Get data Failed:", error.message);
//         throw error;
//     }else{
//         console.log("✅ Get data Success! Data:", data);
//     }
//     //Returns the data
//     return data
// }

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
    
//     //Catches errors
//     if(error){
//         console.error("❌ Insert Failed:", error.message);
//         throw error;
//     }else{
//         console.log("✅ Insert Success! Data:", data);
//     }
//     return data
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

    //Catches errors
    if(error){
        console.error("❌ Update Failed:", error.message);
        throw error;
    }else{
        console.log("✅ Update Success! Data:", data);
    }
    return data
}

//     //Catches errors
//     if(error){
//         console.error("❌ Update Failed:", error.message);
//         throw error;
//     }else{
//         console.log("✅ Update Success! Data:", data);
//     }
//     return data
// }

// /**
//  *  Update the email base on id
//  *  Parameters:
//  *     id          icon id
//  *     newEmail    The new Email
//  */
// export async function updateEmail(id, newEmail){
//   const { data, error } = await supabase
//     .from('users')
//     .update({ email: newEmail })
//     .eq('id', id)
//     .select()           //Gets the entire updated row sent back
//     .single()           //Only send that row back

//     //Catches errors
//     if(error){
//         console.error("❌ Update Failed:", error.message);
//         throw error;
//     }else{
//         console.log("✅ Update Success! Data:", data);
//     }
//     return data
// }