import { supabase } from '../supabaseClient'

export async function getColors(){
    const { data, error } = await supabase
        .from("colors")
        .select("*")
        .order('id', { ascending: true })

    if (error) throw error
    return data;
}