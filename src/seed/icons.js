import { adminSupabase } from "../api/adminClient.js";

const { data, error } = await adminSupabase.from('icons').insert([
  { icon_name: "star" },
  { icon_name: "heart" },
  { icon_name: "bookmark" },
  { icon_name: "folder" },
  { icon_name: "link" },
  { icon_name: "globe" },
  { icon_name: "code" },
  { icon_name: "music" },
  { icon_name: "image" },
  { icon_name: "video" },
]).select();

if (error) throw error;
console.log("Icons seeded:", data);
