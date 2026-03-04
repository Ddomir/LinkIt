import { supabase } from '../supabaseClient'

export async function getFolders() {
  const { data, error } = await supabase.from('folders').select('*')
  if (error) throw error
  return data
}

export async function getFolderById(id) {
  const { data, error } = await supabase.from('folders').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

// TODO: determine whether or not nested folders are allowed
export async function createFolder(name, color, icon, parent_room) {
  const { data, error } = await supabase.from('folders').insert({ title: name, color: color, icon: icon, parent_room: parent_room }).select().single()
  if (error) throw error
  return data
}

// cannot change parent_room
export async function updateFolder(id, name, color, icon) {
  const { data, error } = await supabase.from('folders').update({ title: name, color: color, icon: icon }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function removeFolder(id) {
  const { error } = await supabase.from('folders').delete().eq('id', id)
  if (error) throw error
}

// TODO: additional functions
// get folders by room or get parent room by folder id
// 