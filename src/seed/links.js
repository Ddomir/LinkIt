import { adminSupabase } from "../api/adminClient.js";

// Depends on: colors (ids 1-7), rooms (ids 1-4), folders (ids 1-5)
const { data, error } = await adminSupabase.from('links').insert([
  { title: "GitHub",        link_name: "https://github.com",           color: 1, pinned: true,  room_id: 1, folder_id: 1 },
  { title: "MDN Web Docs",  link_name: "https://developer.mozilla.org", color: 5, pinned: false, room_id: 1, folder_id: 2 },
  { title: "Tailwind CSS",  link_name: "https://tailwindcss.com",       color: 4, pinned: true,  room_id: 2, folder_id: 3 },
  { title: "Supabase Docs", link_name: "https://supabase.com/docs",     color: 4, pinned: false, room_id: 3, folder_id: 4 },
  { title: "Figma",         link_name: "https://figma.com",             color: 6, pinned: true,  room_id: 2, folder_id: 3 },
  { title: "React Docs",    link_name: "https://react.dev",             color: 5, pinned: false, room_id: 3, folder_id: 4 },
]).select();

if (error) throw error;
console.log("Links seeded:", data);
