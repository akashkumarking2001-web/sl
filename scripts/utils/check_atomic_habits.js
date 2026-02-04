
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.from('products').select('slug, name, is_active').ilike('slug', '%atomic%');
    console.log("Products found:", JSON.stringify(data, null, 2));
    if (error) console.error("Error:", error);
}
check();
