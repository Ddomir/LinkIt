import { supabase } from '../supabaseClient'

export async function getColors(){
    const { data, error } = await supabase
        .from("colors")
        .select("right_hex")

    if (error) throw error
    return data;
}