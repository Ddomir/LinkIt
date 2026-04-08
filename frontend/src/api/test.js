// Use this file to test APIs.
// You can run: npm run test and it will run whatever is in this file.
// Use the adminClient for this, but the regular supabase client on actual APIs.
// Below is an example. Don't push this file to github.

import { adminSupabase } from "./adminClient.js";

const exUID = "d1f8d117-6b7f-41d3-9363-4b6e88e32cd9";
const exRoomID = 1;

const { data, error } = await adminSupabase
    .from('room_users')
    .select('room_id')
    .eq('UID', exUID)
    if(error){
        console.error("❌ Get Failed:", error.message);
        throw error;
    } else {
        console.log("✅ Get Success! Data:", data);
    }