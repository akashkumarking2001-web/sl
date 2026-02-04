
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `
-- Drop table if exists to ensure clean slate
DROP TABLE IF EXISTS public.user_addresses;

-- Create user_addresses table referencing auth.users directly
CREATE TABLE public.user_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    label TEXT DEFAULT 'Home',
    full_name TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    phone TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own addresses"
    ON public.user_addresses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
    ON public.user_addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
    ON public.user_addresses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
    ON public.user_addresses FOR DELETE
    USING (auth.uid() = user_id);

-- Create Index for performance
CREATE INDEX idx_user_addresses_user_id ON public.user_addresses(user_id);
`;

async function run() {
    console.log("Setting up user_addresses table...");

    // Note: Standard Supabase client cannot run raw SQL directly unless through RPC or if we allow it.
    // However, often we don't have a 'run_sql' RPC set up. 
    // If this fails, we might need the user to run it in their dashboard.
    // BUT, we can try to use the 'rpc' method if a generic sql exec function exists, 
    // OR we rely on the fact that I (the agent) often have access to run migrations if the setup allows.
    // Wait, I don't have a direct SQL tool. 

    // If I cannot run raw SQL, I should probably ask the user or check if there is an existing method.
    // But wait, many Supabase setups don't allow raw SQL from client.
    // I'll try to check if there is an 'exec_sql' function.

    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        console.error("RPC exec_sql failed:", error.message);
        console.log("Attempting alternative: The table creation might need to be done in Supabase Dashboard SQL Editor.");
        console.log("However, let's try to see if the table exists by inserting a dummy record (which will fail if table missing).");
    } else {
        console.log("SQL executed successfully via RPC (if available).");
    }
}

// Actually, since I cannot guarantee RPC, I will just output the instructions if I can't run it.
// But wait, the previous turn I successfully modified SQL files.
// Maybe I can just instruct the user?
// No, I need to be proactive.
// I'll try to use the `pg` library if installed? No, environment only has some standard libs.
// I will output the SQL content to a new file and tell the user to run it?
// User said "its not loading".
// I'll creates a script that TRIES to verify table access.

async function verifyTable() {
    console.log("Verifying 'user_addresses' table access...");
    const { data, error } = await supabase.from('user_addresses').select('count').limit(1);

    if (error) {
        console.error("Error accessing table:", error.message);
        console.log("\n!!! CRITICAL: The 'user_addresses' table seems to be missing or inaccessible. !!!");
        console.log("Please run the contents of 'SETUP_USER_ADDRESSES.sql' in your Supabase Dashboard SQL Editor.");
    } else {
        console.log("Table 'user_addresses' exists and is accessible.");
    }
}

verifyTable();
