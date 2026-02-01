import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

const TestProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const fetchProducts = async () => {
        setLoading(true);
        setError("");
        console.log("🧪 TEST: Fetching products...");

        try {
            const { data, error: fetchError } = await supabase
                .from("products")
                .select("*")
                .limit(10);

            console.log("🧪 TEST: Response:", { data, error: fetchError });

            if (fetchError) {
                setError(fetchError.message);
                console.error("🧪 TEST: Error:", fetchError);
            } else {
                setProducts(data || []);
                console.log(`🧪 TEST: Got ${data?.length} products`);
            }
        } catch (err: any) {
            setError(err.message);
            console.error("🧪 TEST: Catch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Product Test Page</h1>

                <Button onClick={fetchProducts} className="mb-4">
                    Refresh Products
                </Button>

                {loading && <p className="text-lg">Loading...</p>}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-2">
                        Products Found: {products.length}
                    </h2>

                    {products.length > 0 ? (
                        <div className="space-y-4">
                            {products.map((product) => (
                                <div key={product.id} className="border p-4 rounded">
                                    <h3 className="font-bold">{product.name}</h3>
                                    <p className="text-sm text-gray-600">ID: {product.id}</p>
                                    <p className="text-sm">Price: ₹{product.price}</p>
                                    <p className="text-sm">MRP: ₹{product.mrp}</p>
                                    <p className="text-sm">Active: {product.is_active ? "Yes" : "No"}</p>
                                    {product.image_url && (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-32 h-32 object-cover mt-2"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No products loaded yet.</p>
                    )}
                </div>

                <div className="mt-8 bg-gray-100 p-4 rounded">
                    <h3 className="font-bold mb-2">Console Output:</h3>
                    <p className="text-sm">Check browser console (F12) for detailed logs</p>
                </div>
            </div>
        </div>
    );
};

export default TestProducts;
