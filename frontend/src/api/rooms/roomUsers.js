import { supabase } from '../../supabaseClient'

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