
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking 'payments' table access...");
    const { data, error } = await supabase.from('payments').select('count').limit(1);

    if (error) {
        console.error("Error reading payments:", error);
    } else {
        console.log("Read access to payments confirmed.");
    }

    // Check storage
    console.log("Checking 'payments' storage bucket...");
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
        console.error("Error listing buckets:", bucketError);
    } else {
        const paymentBucket = buckets.find(b => b.name === 'payments');
        if (paymentBucket) {
            console.log("Bucket 'payments' exists.");
        } else {
            console.error("Bucket 'payments' NOT found. Available buckets:", buckets.map(b => b.name));
        }
    }
}

check();
