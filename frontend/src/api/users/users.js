import { supabase } from '../../supabaseClient'


// REMEMBER TO REMOVE THE AUTHENTICATION POLOCY YOU CREATED FOR
// USERS ONCE YOUR DONE CREATING YOUR ROUTES.
// ONCE YOU DID THAT, DELETE THIS MESSAGE.
// IF THIS MESSAGE HAS NOT BEEN DELETED, BRING THIS TO THE ATTENTION OF
// ANDRES

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

//SETTERS
/**
 * Create a new user in the table
 * Parameters:
 *      userName    The desired name of the user
 *      userEmail   The users respective email
 */

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

/**
 *  Update the email base on id
 *  Parameters:
 *     id          icon id
 *     newEmail    The new Email
 */
export async function updateEmail(id, newEmail){
  const { data, error } = await supabase
    .from('users')
    .update({ email: newEmail })
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