import { supabase } from '../../supabaseClient'

export async function createName(room_name){
    const { data, error } = await supabase.from('rooms').insert({ name: room_name }).select().single()
}