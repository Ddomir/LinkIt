import { adminSupabase } from "../api/adminClient.js";

// Depends on: colors (ids 1-7), icons (ids 1-10), rooms (ids 1-4)
const { data, error } = await adminSupabase.from('folders').insert([
  { title: "Favourites",   color: 1, icon: 1, pinned: true,  room_id: 1, folder_id: null },
  { title: "Reading List", color: 5, icon: 3, pinned: false, room_id: 1, folder_id: null },
  { title: "Components",   color: 4, icon: 4, pinned: true,  room_id: 2, folder_id: null },
  { title: "References",   color: 2, icon: 5, pinned: false, room_id: 3, folder_id: null },
  { title: "Archived",     color: 7, icon: 8, pinned: false, room_id: 1, folder_id: null },
]).select();

if (error) throw error;
console.log("Folders seeded:", data);
