import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DirectShoppingTest = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            console.log("Fetching products...");
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .limit(20);

            console.log("Response:", { data, error });

            if (data) {
                setProducts(data);
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="p-8">Loading products...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Direct Product Test</h1>
            <p className="mb-4">Products found: {products.length}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border p-4 rounded">
                        {product.image_url && (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-48 object-cover mb-2"
                            />
                        )}
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-sm text-gray-600">₹{product.price}</p>
                        <p className="text-xs text-green-600">Cashback: ₹{product.cashback_amount}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DirectShoppingTest;
