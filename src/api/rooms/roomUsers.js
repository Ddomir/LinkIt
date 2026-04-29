import { supabase } from '../../supabaseClient'
import { inviteCodeExists } from "../invites";

export async function createRoomUser(user_id, room_id, role){
    const { error } = await supabase
        .from('room_users')
        .insert({
            room_id: room_id,
            UID: user_id,
            role: role,
        })

    if(error) throw error;
}

async function userInRoom(user_id, room_id) {
    const { data, error } = await supabase
        .from('room_users')
        .select('*')
        .eq('UID', user_id)
        .eq('room_id', room_id)

    if (error) throw error

    return (data.length != 0); 
}

export async function getUserRole(user_id, room_id) {
    const { data, error } = await supabase
        .from('room_users')
        .select('role')
        .eq('UID', user_id)
        .eq('room_id', room_id)
        .single()
    if (error) return null
    return data.role
}

export async function getRoomMembers(room_id) {
    const { data: members, error } = await supabase
        .from('room_users')
        .select('UID, role')
        .eq('room_id', room_id)
    if (error) throw error

    const uids = members.map(m => m.UID)
    const { data: users } = await supabase
        .from('users')
        .select('UUID, name, email')
        .in('UUID', uids)

    const userMap = {}
    ;(users ?? []).forEach(u => { userMap[u.UUID] = u })

    return members.map(m => ({ ...m, users: userMap[m.UID] ?? null }))
}

export async function updateUserRole(user_id, room_id, role) {
    const { error } = await supabase
        .from('room_users')
        .update({ role })
        .eq('UID', user_id)
        .eq('room_id', room_id)
    if (error) throw error
}

// Atomically demotes current owner to editor and promotes new_owner_id to owner.
export async function transferOwnership(room_id, current_owner_id, new_owner_id) {
    const [demote, promote] = await Promise.all([
        supabase.from('room_users').update({ role: 9 }).eq('UID', current_owner_id).eq('room_id', room_id),
        supabase.from('room_users').update({ role: 10 }).eq('UID', new_owner_id).eq('room_id', room_id),
    ]);
    if (demote.error) throw demote.error;
    if (promote.error) throw promote.error;
}

export async function removeRoomUser(user_id, room_id) {
    const { error } = await supabase
        .from('room_users')
        .delete()
        .eq('UID', user_id)
        .eq('room_id', room_id)

    if (error) throw error;
}

// returns room data
export async function joinRoom(user_id, code) {
    // check if room code exists
    const room = await inviteCodeExists(code);
    if (room.length == 0) { // [] is DNE
        console.error("Invite code ", code, " does not exist!");
        return {err: -1};
    }
    // check if user already in room
    if (await userInRoom(user_id, room.id)) {
        console.error("User already in room ", room);
        return {err: -2};
    }

    // if all checks pass, join the room as a VIEWER (id: 8)
    await createRoomUser(user_id, room.id, 8);
    return room;
}