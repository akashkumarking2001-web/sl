
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://vwzqmjhcfetjzhmyjtkr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3enFtamhjZmV0ZnpobXlqdGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNjIzMTEsImV4cCI6MjA1MzczODMxMX0.g3E_l1tH-XQ9CqD2iC8Ea3SpuMDTHZveqZNHaJHMY3M";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

async function testConnection() {
    console.log("Testing connection to:", SUPABASE_URL);
    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Supabase Connection Successful! Data:", data);
        }
    } catch (err) {
        console.error("Network/System Error:", err);
    }
}

testConnection();
