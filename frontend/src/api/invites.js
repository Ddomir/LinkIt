import { supabase } from '../supabaseClient'

export async function getinvites() {
  const { data, error } = await supabase.from('invites').select('*')
  if (error) throw error
  return data
}

export async function getInviteById(id) {
  const { data, error } = await supabase.from('invites').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

// content = link content
export async function createInvite(room_id, content) {
  const { data, error } = await supabase.from('invites').insert({ room_id: room_id, link: content }).select().single()
  if (error) throw error
  return data
}

// do not allow users to update the invite link

// useful if a room is getting deleted
export async function removeInvite(id) {
  const { error } = await supabase.from('invites').delete().eq('id', id)
  if (error) throw error
}
// get room id that is attached to this invite
export async function getRoomByInviteId(id) {
  const { data, error } = await supabase.from('invites').select('room_id').eq('id', id).single()
  if (error) throw error
  return data
}