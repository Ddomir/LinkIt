import { adminSupabase } from "./adminClient.js";

const { data, error } = await adminSupabase.from('roles').insert([
  { name: "Viewer" },
  { name: "Editor" },
  { name: "Owner" }
]).select();

if (error) throw error;
console.log(data);
