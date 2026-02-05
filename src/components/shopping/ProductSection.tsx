import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard, { Product } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductSectionProps {
    title: string;
    type: "grid" | "scroll" | "deal";
    sortBy?: "newest" | "price_low" | "price_high" | "featured" | "discount";
    limit?: number;
    highlight?: boolean; // For "Deal of the Day" background
    onAddToCart: (product: Product) => void;
    onAddToWishlist: (productId: string) => void;
    categoryId?: string;
    excludeProductId?: string;
}

const ProductSection = ({
    title,
    type,
    sortBy = "featured",
    limit = 8,
    highlight = false,
    onAddToCart,
    onAddToWishlist,
    categoryId,
    excludeProductId
}: ProductSectionProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [sortBy, limit, categoryId, excludeProductId]);

    const fetchProducts = async (retryCount = 0) => {
        try {
            let query = supabase
                .from("products")
                .select("*")
                .eq("is_active", true)
                .limit(limit);

            if (categoryId) {
                query = query.eq("category_id", categoryId);
            }

            if (excludeProductId) {
                query = query.neq("id", excludeProductId);
            }

            // Apply sorting
            if (sortBy === "newest") query = query.order("created_at", { ascending: false });
            else if (sortBy === "price_low") query = query.order("price", { ascending: true });
            else if (sortBy === "price_high") query = query.order("price", { ascending: false });
            else if (sortBy === "featured") {
                query = query.eq("is_featured", true).order("created_at", { ascending: false });
            }
            else if (sortBy === "discount") query = query.order("price", { ascending: true });

            const { data, error } = await query;

            if (error) throw error;

            setProducts((data as any) || []);
            setLoading(false);
        } catch (error: any) {
            console.warn(`Fetch attempt ${retryCount + 1} failed:`, error.message);

            if (retryCount < 3) {
                setTimeout(() => fetchProducts(retryCount + 1), 1000 * (retryCount + 1));
                return;
            }

            console.error("Error fetching section products final:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6 px-2">
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className={`grid gap-3 sm:gap-6 ${type === "scroll" ? "grid-flow-col auto-cols-[180px] sm:auto-cols-[280px] overflow-x-auto no-scrollbar" : "grid-cols-2 lg:grid-cols-4"}`}>
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />)}
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    // Deal of the Day Layout (Special)
    if (type === "deal") {
        const dealProduct = products[0];
        if (!dealProduct) return null;

        return (
            <div className="mb-8 md:mb-16 bg-[#0F0F10] rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/5 group mx-1 md:mx-0">
                {/* Premium Background Effects */}
                <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                    {/* Product Image - Shows on all screens */}
                    <div className="relative w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-white p-6 md:p-8 flex items-center justify-center flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-500">
                        <img
                            src={dealProduct.image_url || "/placeholder.png"}
                            alt={dealProduct.name}
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute top-4 right-4 bg-primary text-black text-xs md:text-sm font-black px-3 py-1.5 rounded-lg shadow-lg">
                            -{Math.round(((dealProduct.mrp - dealProduct.price) / dealProduct.mrp) * 100)}%
                        </div>
                    </div>

                    {/* Deal Content */}
                    <div className="space-y-4 md:space-y-6 text-center md:text-left w-full md:w-1/2">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-tight animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Special Limited Deal</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                            {title}
                        </h2>

                        <p className="text-sm md:text-base text-gray-300 line-clamp-2">
                            {dealProduct.name}
                        </p>

                        <div className="flex flex-col items-center md:items-start gap-4">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl md:text-5xl lg:text-6xl font-black text-[#FBBF24]">₹{dealProduct.price.toLocaleString()}</span>
                                <span className="text-base md:text-lg text-gray-500 line-through font-bold">₹{dealProduct.mrp.toLocaleString()}</span>
                            </div>
                            <Button
                                onClick={() => onAddToCart(dealProduct)}
                                className="bg-[#FBBF24] text-black hover:bg-white h-12 md:h-16 px-8 md:px-12 rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-xl w-full md:w-auto"
                            >
                                Get This Deal
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`mb-16 ${highlight ? "bg-slate-50 p-8 -mx-4 md:-mx-8 rounded-3xl" : ""}`}>
            <div className="flex justify-between items-end mb-4 px-1">
                <div>
                    <h2 className="text-lg md:text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
                </div>
                {type === "scroll" && (
                    <Button variant="ghost" className="text-[#FBBF24] text-xs md:text-sm font-bold p-0 md:p-4 hover:bg-transparent">
                        View All
                    </Button>
                )}
            </div>

            <div className={
                type === "scroll"
                    ? "flex gap-4 overflow-x-auto pb-8 -mx-4 px-4 scroll-smooth scrollbar-hide snap-x"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
            }>
                {products.map((product) => (
                    <div key={product.id} className={type === "scroll" ? "min-w-[280px] w-[280px] snap-start" : ""}>
                        <ProductCard
                            product={product}
                            onAddToCart={onAddToCart}
                            onAddToWishlist={onAddToWishlist}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductSection;
