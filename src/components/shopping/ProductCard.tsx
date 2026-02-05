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
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                    src={product.image_url || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.is_featured && (
                        <Badge className="bg-foreground hover:bg-foreground/90 text-background border-0 rounded-md px-2 py-1 text-[10px] tracking-tight font-bold shadow-md">
                            Featured
                        </Badge>
                    )}
                    {discount > 0 && (
                        <Badge className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0 rounded-md px-2 py-1 text-[10px] tracking-tight font-bold shadow-md">
                            -{discount}%
                        </Badge>
                    )}
                </div>

                {/* Hover Actions - Visible on mobile, slide-up on desktop hover */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 transform translate-y-0 opacity-100 lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                    <Button
                        onClick={(e) => handleAction(e, () => onAddToCart(product))}
                        data-testid="add-to-cart-button"
                        className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold shadow-lg rounded-xl h-10 border-none"
                        disabled={product.stock_quantity === 0}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.stock_quantity === 0 ? "Out of stock" : "Add to cart"}
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="bg-card hover:bg-muted text-foreground shadow-lg rounded-xl h-10 w-10 shrink-0 border border-border/10"
                        onClick={(e) => handleAction(e, () => onAddToWishlist(product.id))}
                        data-testid="wishlist-button"
                    >
                        <Heart className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-foreground text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                <div className="mt-auto pt-3 flex items-end justify-between border-t border-border/50">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground line-through font-medium">₹{product.mrp.toLocaleString()}</span>
                        <span className="text-lg font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                    </div>
                    {product.cashback_amount > 0 && (
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-900">
                            +₹{product.cashback_amount} Cashback
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
