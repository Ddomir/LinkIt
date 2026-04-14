import { adminSupabase } from "./adminClient.js";

const TABLES = ['roles'];

for (const table of TABLES) {
  const { error } = await adminSupabase.from(table).delete().neq('id', 0);
  if (error) throw error;
  console.log(`Cleared: ${table}`);
}

// Hello world