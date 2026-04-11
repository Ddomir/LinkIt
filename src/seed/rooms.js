import { adminSupabase } from "../api/adminClient.js";

// Depends on: icons (icon id 1 must exist)
const { data, error } = await adminSupabase.from('rooms').insert([
  { name: "General",     icon: 1, is_private: false },
  { name: "Design",      icon: 2, is_private: false },
  { name: "Engineering", icon: 7, is_private: false },
  { name: "Private Lab", icon: 3, is_private: true  },
]).select();

if (error) throw error;
console.log("Rooms seeded:", data);
