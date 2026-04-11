import { adminSupabase } from "../api/adminClient.js";

const { data, error } = await adminSupabase.from('colors').insert([
  { name: "Red",    left_hex: "FF6B6B", right_hex: "FF0000" },
  { name: "Orange", left_hex: "FFB347", right_hex: "FF6600" },
  { name: "Yellow", left_hex: "FFE066", right_hex: "FFD700" },
  { name: "Green",  left_hex: "ACECD7", right_hex: "65DCB5" },
  { name: "Blue",   left_hex: "6EC6F5", right_hex: "1E90FF" },
  { name: "Indigo", left_hex: "7B8FD4", right_hex: "4B0082" },
  { name: "Violet", left_hex: "C49FE8", right_hex: "8B00FF" },
]).select();

if (error) throw error;
console.log(data);
