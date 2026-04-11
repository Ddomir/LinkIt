import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: new URL("../../.env.local", import.meta.url).pathname });

export const adminSupabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
