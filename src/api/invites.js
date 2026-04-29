import { supabase } from '../supabaseClient'

function generateRandomString() {
  var result = "";
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (var i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Returns the room object if the code exists and is not expired, else []
export async function inviteCodeExists(content) {
  const { data: invite, error } = await supabase
    .from('invites')
    .select('room_id, expires_at')
    .eq('link', content)
    .maybeSingle()

  if (error || !invite) return []

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    console.log("Invite code", content, "has expired");
    return []
  }

  const { data: room, error: roomErr } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', invite.room_id)
    .single()

  if (roomErr || !room) return []
  return room;
}

// expiresAt: Date object or null (null = never expires)
export async function createInvite(room_id, expiresAt = null) {
  // Delete any existing invite for this room first (one active invite at a time)
  await supabase.from('invites').delete().eq('room_id', room_id);

  const code = generateRandomString();
  const { error } = await supabase
    .from('invites')
    .insert({ room_id, link: code, expires_at: expiresAt ?? null })
  if (error) throw error
  // Return a local object — avoids a SELECT that can trip RLS
  return { room_id, link: code, expires_at: expiresAt ?? null }
}

// Replace the current invite with a new code and expiry
export async function regenerateInvite(room_id, expiresAt = null) {
  return createInvite(room_id, expiresAt);
}

export async function getInviteByRoomId(room_id) {
  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .eq('room_id', room_id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function removeInvite(id) {
  const { error } = await supabase.from('invites').delete().eq('id', id)
  if (error) throw error
}

export async function getRoomByInviteId(id) {
  const { data, error } = await supabase.from('invites').select('room_id').eq('id', id).single()
  if (error) throw error
  return data
}
