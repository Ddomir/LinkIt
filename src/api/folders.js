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
  const { data, error } = await supabase.from('folders').insert({ title: name, color: color, icon: icon, room_id: parent_room }).select().single()
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

// determine if folder has a parent folder
export async function folderHasParent(id) {
  const { data, error } = await supabase.from('folders').select('*').eq('folder_id', id).single()
  if (error) throw error
  return (data.length != 0)
}

// get parent folder id
export async function getParentFolderByFolderId(id) {
  const { data, error } = await supabase.from('folders').select('folder_id').eq('id', id).single()
  if (error) throw error
  return data
}

// get parent room id
export async function getParentRoomByFolderId(id) {
  const { data, error } = await supabase.from('folders').select('room_id').eq('id', id).single()
  if (error) throw error
  return data
}

// get all folders in a room
export async function getFoldersByRoomId(room_id) {
  const { data, error } = await supabase.from('folders').select('*').eq('room_id', room_id)
  if (error) throw error
  return data
}