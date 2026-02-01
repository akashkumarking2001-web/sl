import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Heart,
    ShoppingCart,
    Trash2,
    Search,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";

interface WishlistItem {
    id: string;
    product_id: string;
    created_at: string;
    products: {
        id: string;
        name: string;
        slug: string;
        short_description: string;
        image_url: string;
        mrp: number;
        price: number;
        cashback_amount: number;
        stock_quantity: number;
        is_active: boolean;
    } | null;
}

const WishlistPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toast } = useToast();

    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const fetchWishlist = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const { data, error } = await (supabase as any)
                .from("wishlist")
                .select(`
                    *,
                    products (
                        id,
                        name,
                        slug,
                        short_description,
                        image_url,
                        mrp,
                        price,
                        cashback_amount,
                        stock_quantity,
                        is_active
                    )
                `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setWishlist(data || []);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            toast({
                title: "Error",
                description: "Failed to load wishlist.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (wishlistId: string) => {
        try {
            const { error } = await (supabase as any)
                .from("wishlist")
                .delete()
                .eq("id", wishlistId);

            if (error) throw error;

            setWishlist(prev => prev.filter(item => item.id !== wishlistId));
            toast({
                title: "Removed",
                description: "Item removed from wishlist.",
            });
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast({
                title: "Error",
                description: "Failed to remove item.",
                variant: "destructive",
            });
        }
    };

    const handleMoveToCart = (item: WishlistItem) => {
        if (!item.products) return;

        addToCart({
            id: item.products.id,
            name: item.products.name,
            price: item.products.price,
            cashback: item.products.cashback_amount,
            image: item.products.image_url,
            quantity: 1
        });

        handleRemoveFromWishlist(item.id);

        toast({
            title: "Moved to Cart",
            description: `${item.products.name} has been added to your cart.`,
        });
    };

    const calculateDiscount = (mrp: number, price: number) => {
        return Math.round(((mrp - price) / mrp) * 100);
    };

    const filteredWishlist = wishlist.filter(item =>
        item.products?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-8 h-8 text-destructive fill-current" />
                        <h1 className="text-4xl font-black">My Wishlist</h1>
                    </div>
                    <p className="text-muted-foreground">
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
                    </p>
                </div>

                {/* Search */}
                {wishlist.length > 0 && (
                    <div className="glass-card p-4 rounded-2xl mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search wishlist..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                )}

                {/* Wishlist Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="glass-card rounded-2xl p-4 animate-pulse">
                                <div className="aspect-square bg-muted rounded-xl mb-4"></div>
                                <div className="h-4 bg-muted rounded mb-2"></div>
                                <div className="h-3 bg-muted rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredWishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold mb-2">
                            {searchQuery ? "No items found" : "Your wishlist is empty"}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery
                                ? "Try a different search term"
                                : "Save items you love to your wishlist"}
                        </p>
                        <Button onClick={() => navigate("/shopping")}>
                            Browse Products
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredWishlist.map(item => {
                            if (!item.products) return null;

                            const product = item.products;
                            const discount = calculateDiscount(product.mrp, product.price);
                            const isOutOfStock = product.stock_quantity === 0;
                            const isInactive = !product.is_active;

                            return (
                                <div
                                    key={item.id}
                                    className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group"
                                >
                                    {/* Product Image */}
                                    <div
                                        className="relative aspect-square overflow-hidden cursor-pointer"
                                        onClick={() => navigate(`/product/${product.slug}`)}
                                    >
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {discount > 0 && (
                                            <Badge className="absolute top-3 right-3 bg-destructive/90 text-white border-0">
                                                {discount}% OFF
                                            </Badge>
                                        )}
                                        {(isOutOfStock || isInactive) && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <Badge variant="destructive">
                                                    {isInactive ? "Unavailable" : "Out of Stock"}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3
                                            className="font-bold text-lg mb-2 line-clamp-2 hover:text-primary cursor-pointer min-h-[3.5rem]"
                                            onClick={() => navigate(`/product/${product.slug}`)}
                                        >
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
                                            {product.short_description}
                                        </p>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-2xl font-black text-primary">
                                                ₹{product.price.toLocaleString()}
                                            </span>
                                            {product.mrp > product.price && (
                                                <span className="text-sm text-muted-foreground line-through">
                                                    ₹{product.mrp.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        {/* Cashback */}
                                        {product.cashback_amount > 0 && (
                                            <p className="text-sm text-emerald-500 font-semibold mb-3">
                                                Cashback: ₹{product.cashback_amount}
                                            </p>
                                        )}

                                        {/* Stock Status */}
                                        {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                                            <p className="text-xs text-amber-500 mb-3">
                                                Only {product.stock_quantity} left
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Button
                                                className="flex-1 rounded-xl"
                                                onClick={() => handleMoveToCart(item)}
                                                disabled={isOutOfStock || isInactive}
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                Move to Cart
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleRemoveFromWishlist(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Added Date */}
                                        <p className="text-xs text-muted-foreground mt-3 text-center">
                                            Added {new Date(item.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
