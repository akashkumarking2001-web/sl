import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    mrp: number;
    image_url: string | null;
    short_description: string | null;
    stock_quantity: number;
    is_featured: boolean;
    cashback_amount: number;
}

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onAddToWishlist: (productId: string) => void;
    className?: string;
}

const ProductCard = ({ product, onAddToCart, onAddToWishlist, className }: ProductCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    const handleCardClick = () => {
        navigate(`/product/${product.slug}`);
    };

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    return (
        <div
            data-testid={`product-card-${product.id}`}
            className={cn(
                "group relative bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-muted flex-shrink-0">
                <img
                    src={product.image_url || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                    {product.is_featured && (
                        <Badge className="bg-[#FBBF24] hover:bg-[#FBBF24]/90 text-black border-0 rounded-lg px-2 py-0.5 text-[9px] tracking-tight font-black shadow-md uppercase">
                            Featured
                        </Badge>
                    )}
                    {discount > 0 && (
                        <Badge className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0 rounded-lg px-2 py-0.5 text-[9px] tracking-tight font-black shadow-md uppercase">
                            -{discount}%
                        </Badge>
                    )}
                </div>

                {/* Action Buttons - Always visible for better UX */}
                <div className="absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300">
                    <Button
                        data-testid="add-to-cart-button"
                        onClick={(e) => handleAction(e, () => onAddToCart(product))}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-white hover:text-black font-black shadow-xl rounded-xl h-10 border-none transition-all active:scale-90"
                        disabled={product.stock_quantity === 0}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-3.5 flex flex-col flex-1 gap-1">
                <h3 className="font-bold text-foreground text-[14px] md:text-base leading-tight line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                </h3>

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex flex-col">
                            <span className="text-sm md:text-lg font-black text-foreground">₹{product.price.toLocaleString()}</span>
                            {discount > 0 && (
                                <span className="text-[10px] text-muted-foreground line-through font-bold opacity-60">₹{product.mrp.toLocaleString()}</span>
                            )}
                        </div>
                        <Button
                            data-testid="wishlist-button"
                            size="icon"
                            variant="ghost"
                            className="rounded-full h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                            onClick={(e) => handleAction(e, () => onAddToWishlist(product.id))}
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
