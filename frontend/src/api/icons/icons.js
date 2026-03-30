import { supabase } from '../../supabaseClient'

// REMEMBER TO REMOVE THE AUTHENTICATION POLOCY YOU CREATED FOR
// ICONS ONCE YOUR DONE CREATING YOUR ROUTES.
// ONCE YOU DID THAT, DELETE THIS MESSAGE.
// IF THIS MESSAGE HAS NOT BEEN DELETED, BRING THIS TO THE ATTENTION OF
// ANDRES

// type shit
// dominic

//GETTERS

export async function getAllIcons() {
    const { data, error } = await supabase
    .from('icons')
    .select('icon_name')

    //Catches errors
    if(error){
        console.error("❌ Get data Failed:", error.message);
        throw error;
    }else{
        console.log("✅ Get icons data Success! Data:", data);
    }
    //Returns the data
    return data
}

/**
    Get the icon corresponding to a specified id
    Parameters:
        id      This is the icon id
*/
export async function getIcon(id) {
  const { data, error } = await supabase
    .from('icons')
    .select('*')
    .eq('id', id)
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

/**
 * Create a new icon in the table
 * Parameters:
 *      icon_url    The new url for the icon
 */
export async function createIcon(icon_url){
    const { data, error } = await supabase
        .from('icons')
        .insert({ 
            icon_name: icon_url,
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
 *  Update the icon_url base on id
 *  Parameters:
 *     id          icon id
 */
export async function updateIcon(id, icon_url){
  const { data, error } = await supabase
    .from('icons')
    .update({ icon_name: icon_url })
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

