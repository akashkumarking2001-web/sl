
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vwzqaloqlvlewvijiqeu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3enFhbG9xbHZsZXd2aWppcWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNjMwMjQsImV4cCI6MjA4NDkzOTAyNH0.oEuQrpidyXbKYdy3SpuMDTHZveqZNHaJHMY3TK3ir2E";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkProduct() {
    const slug = "3d-asset-mega-pack";
    console.log(`Checking for product with slug: ${slug}`);

    const { data, error } = await supabase
        .from("products")
        .select("*, product_categories(name)")
        .eq("slug", slug);

    if (error) {
        console.error("Error fetching product:", error);
    } else {
        console.log("Product data found:", data);
        console.log("Count:", data.length);
        if (data.length === 0) {
            console.log("No product found with this slug.");
        } else {
            console.log("Product found!");
        }
    }
}

checkProduct();
