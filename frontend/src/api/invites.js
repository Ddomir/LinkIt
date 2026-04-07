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

// helper function for createInvite
function generateRandomString() {
  var result = "";
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for ( var i = 0; i < 10; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  console.log("INVITE CODE: ", result);
  return result;
} 

// returns the id of the room the code is associated with
// returns -1 if no room was found
export async function inviteCodeExists(content) {
  const { data, error } = await supabase.from('invites').select('rooms!inner (*)').eq('link', content)
  if (error) throw error
  
  if (data.length == 0) // data == 0 means it was not found 
  {
    console.log("Room with invite code ", content, " not found!");
    return []
  }
    // else
  console.log("Invite code ", content, " exists for room id ", data[0].rooms.id);
  return data[0].rooms;
}

export async function createInvite(room_id) {
  var content = generateRandomString();

  // figure out of that string already exists as an invite code
  if (await inviteCodeExists(content.room_id) != []) { // if it exists
    console.log(content + " is already an invite code!");
    content = generateRandomString() // generate a new one
  }

  const { data, error } = await supabase.from('invites').insert({ room_id: room_id, link: content }).select().single()
  if (error) throw error
  console.log("Invite code created successfully for room " + room_id);
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