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

// determine if link has a parent folder
export async function linkHasParent(id) {
  const { data, error } = await supabase.from('links').select('*').eq('folder_id', id).single()
  if (error) throw error
  return (data != null)
}

// get parent folder
export async function getParentFolderByLinkId(id) {
  const { data, error } = await supabase.from('links').select('*').eq('folder_id', id).single()
  if (error) throw error
  return data
}

// get parent room
export async function getParentRoomByLinkId(id) {
  const { data, error } = await supabase.from('links').select('*').eq('room_id', id).single()
  if (error) throw error
  return data
}
