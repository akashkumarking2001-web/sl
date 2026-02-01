import { useState } from "react";
import { Link } from "react-router-dom";
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

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    return (
        <div
            className={cn(
                "group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                <Link to={`/product/${product.slug}`}>
                    <img
                        src={product.image_url || "/placeholder.png"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.is_featured && (
                        <Badge className="bg-slate-900 hover:bg-slate-800 text-white border-0 rounded-md px-2 py-1 text-[10px] uppercase tracking-wider font-bold shadow-md">
                            Featured
                        </Badge>
                    )}
                    {discount > 0 && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 rounded-md px-2 py-1 text-[10px] uppercase tracking-wider font-bold shadow-md">
                            -{discount}%
                        </Badge>
                    )}
                </div>

                {/* Hover Actions - Visible on hover */}
                <div className={cn(
                    "absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 transform",
                    isHovered ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 lg:translate-y-10 lg:opacity-0 translate-y-0 opacity-100" // Always visible on mobile, hover on desktop
                )}>
                    <Button
                        onClick={() => onAddToCart(product)}
                        className="flex-1 bg-[#FBBF24] text-black hover:bg-[#FBBF24]/90 font-bold shadow-lg rounded-xl h-10 border-none"
                        disabled={product.stock_quantity === 0}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.stock_quantity === 0 ? "No Stock" : "Add To Cart"}
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white hover:bg-slate-50 text-slate-900 shadow-lg rounded-xl h-10 w-10 shrink-0"
                        onClick={() => onAddToWishlist(product.id)}
                    >
                        <Heart className="w-5 h-5" />
                    </Button>
                </div>

                {/* Quick View Button - Center */}
                {/* <div className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 transform",
                    isHovered ? "scale-100 opacity-100" : "scale-50 opacity-0"
                )}>
                    <Button 
                        size="icon"
                        variant="secondary"
                        className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full w-12 h-12 shadow-xl"
                        onClick={() => window.location.href = `/product/${product.slug}`}
                    >
                        <Eye className="w-5 h-5 text-slate-900" />
                    </Button>
                </div> */}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <Link to={`/product/${product.slug}`} className="block">
                    <h3 className="font-bold text-slate-800 text-base leading-tight mb-1 line-clamp-2 hover:text-[#FBBF24] transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* <p className="text-xs text-slate-500 line-clamp-1 mb-3">{product.short_description}</p> */}

                <div className="mt-auto pt-3 flex items-end justify-between border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 line-through font-medium">₹{product.mrp.toLocaleString()}</span>
                        <span className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
                    </div>
                    {product.cashback_amount > 0 && (
                        <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                            +₹{product.cashback_amount} Cashback
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
