import { supabase } from '../supabaseClient'

export async function getColors(){
    const { data, error } = await supabase
        .from("colors")
        .select("id, left_hex, right_hex")

    if (error) throw error
    return data;
}

export async function getGradientStyleFromColorId(colorId) {
    const { data, error } = await supabase
        .from("colors").select("left_hex, right_hex").eq("id", colorId).single()

    if (error) throw error
    return { background: `linear-gradient(to right, ${data.left_hex}, ${data.right_hex})` }
}