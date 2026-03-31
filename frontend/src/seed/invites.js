import { adminSupabase } from "../api/adminClient.js";

// Depends on: rooms (room ids 1-4 must exist)
const { data, error } = await adminSupabase.from('invites').insert([
  { room_id: 1 },
  { room_id: 2 },
  { room_id: 3 },
]).select();

if (error) throw error;
console.log("Invites seeded:", data);
