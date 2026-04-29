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
    .select('*')
    .order('id', { ascending: true })

    if(error) throw error;
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

    if(error) throw error;
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
    
    if(error) throw error;
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

    if(error) throw error;
    return data
}

