import { supabase } from '../supabaseClient'

export async function getLinks() {
  const { data, error } = await supabase.from('links').select('*')
  if (error) throw error
  return data
}

export async function getLinkById(id) {
  const { data, error } = await supabase.from('links').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

// name = link content
// title = title of the link
export async function createLink(name, title, color, room_id, folder_id) {
  const { data, error } = await supabase.from('links').insert({ link_name: name, title: title, color: color, room_id: room_id, folder_id: folder_id }).select().single()
  if (error) throw error
  return data
}

// cannot change parent folder or room
export async function updateLink(id, name, title, color) {
  const { data, error } = await supabase.from('links').update({ link_name: name, title: title, color: color }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function removeLink(id) {
  const { error } = await supabase.from('links').delete().eq('id', id)
  if (error) throw error
}

// TODO: additional functions
// get links by room or get parent room by link id
// determine if link has a parent folder
// get links by folder or get parent folder by link id
