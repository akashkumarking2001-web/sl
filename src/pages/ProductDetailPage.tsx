import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ShoppingCart,
    Heart,
    Share2,
    Star,
    Tag,
    Truck,
    ShieldCheck,
    RotateCcw,
    Check,
    Copy,
    ChevronLeft,
} from "lucide-react";
import ProductSection from "@/components/shopping/ProductSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    image_url: string;
    gallery_images: string[];
    mrp: number;
    price: number;
    cashback_amount: number;
    cashback_percentage: number;
    stock_quantity: number;
    is_featured: boolean;
    tags: string[];
    specifications: any;
    category_id: string;
}

interface Category {
    name: string;
}

const ProductDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toast } = useToast();

    const [product, setProduct] = useState<Product | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAffiliate, setIsAffiliate] = useState(false);
    const [affiliateLink, setAffiliateLink] = useState("");
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchProduct();
            checkAffiliateStatus();
        }
    }, [slug]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("products")
                .select("*, product_categories(name)")
                .eq("slug", slug)
                .eq("is_active", true)
                .single();

            if (error) throw error;

            setProduct(data);
            setCategory(data.product_categories);
        } catch (error) {
            console.error("Error fetching product:", error);
            toast({
                title: "Error",
                description: "Product not found.",
                variant: "destructive",
            });
            navigate("/shopping");
        } finally {
            setLoading(false);
        }
    };

    const checkAffiliateStatus = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("affiliate_applications")
                .select("status")
                .eq("user_id", user.id)
                .single();

            if (data?.status === "approved") {
                setIsAffiliate(true);
            }
        } catch (error) {
            // User is not an affiliate
        }
    };

    const generateAffiliateLink = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !product) return;

            const { data, error } = await supabase
                .rpc("create_affiliate_link", {
                    p_user_id: user.id,
                    p_product_id: product.id
                });

            if (error) throw error;

            // Get the referral code
            const { data: linkData } = await supabase
                .from("affiliate_links")
                .select("referral_code")
                .eq("user_id", user.id)
                .eq("product_id", product.id)
                .single();

            if (linkData) {
                const link = `${window.location.origin}/product/${product.slug}?ref=${linkData.referral_code}`;
                setAffiliateLink(link);
                setShowShareDialog(true);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to generate affiliate link.",
                variant: "destructive",
            });
        }
    };

    const copyAffiliateLink = () => {
        navigator.clipboard.writeText(affiliateLink);
        setCopied(true);
        toast({
            title: "Copied!",
            description: "Affiliate link copied to clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAddToCart = (item: Product | null = null) => {
        const productToAdd = item || product;
        const qty = item ? 1 : quantity;

        if (!productToAdd) return;

        addToCart({
            id: productToAdd.id,
            name: productToAdd.name,
            price: productToAdd.price,
            cashback: productToAdd.cashback_amount,
            image: productToAdd.image_url,
            quantity: qty
        });

        toast({
            title: "Added to Cart",
            description: `${qty} x ${productToAdd.name} added to your cart.`,
        });
    };

    const handleAddToWishlist = async (itemId: string | null = null) => {
        const idToAdd = itemId || product?.id;
        if (!idToAdd) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast({
                    title: "Login Required",
                    description: "Please login to add items to wishlist.",
                    variant: "destructive",
                });
                return;
            }

            const { error } = await supabase
                .from("wishlist")
                .insert({ user_id: user.id, product_id: idToAdd });

            if (error) throw error;

            toast({
                title: "Added to Wishlist",
                description: "Product saved to your wishlist.",
            });
        } catch (error: any) {
            if (error.code === '23505') {
                toast({
                    title: "Already in Wishlist",
                    description: "This product is already in your wishlist.",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to add to wishlist.",
                    variant: "destructive",
                });
            }
        }
    };

    const calculateDiscount = () => {
        if (!product) return 0;
        return Math.round(((product.mrp - product.price) / product.mrp) * 100);
    };

    const allImages = product ? [product.image_url, ...(product.gallery_images || [])] : [];

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 w-32 bg-muted rounded mb-8"></div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="aspect-square bg-muted rounded-2xl"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-muted rounded w-3/4"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                                <div className="h-12 bg-muted rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const discount = calculateDiscount();

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/shopping")}
                        className="gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Shop
                    </Button>
                    <span>/</span>
                    <span>{category?.name}</span>
                    <span>/</span>
                    <span className="text-foreground">{product.name}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="glass-card rounded-2xl overflow-hidden aspect-square">
                            <img
                                src={allImages[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={cn(
                                            "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                                            selectedImage === idx
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-transparent hover:border-border"
                                        )}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            {product.is_featured && (
                                <Badge className="mb-3 bg-amber-500/10 text-amber-500 border-amber-500/20">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    Featured Product
                                </Badge>
                            )}
                            <h1 className="text-3xl md:text-5xl font-black mb-2 text-slate-900 dark:text-white leading-tight">
                                {product.name}
                            </h1>

                            {/* Social Proof */}
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4].map(i => <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />)}
                                    <Star className="w-4 h-4 text-amber-500/50 fill-current" />
                                    <span className="text-sm font-semibold ml-2 text-slate-900 dark:text-white">4.8</span>
                                    <span className="text-sm text-slate-500 underline decoration-slate-300 ml-1 cursor-pointer hover:text-blue-600">(128 reviews)</span>
                                </div>
                                <div className="h-4 w-px bg-slate-200" />
                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 py-1 animate-pulse">
                                    <span className="mr-1">🔥</span> 500+ bought in past month
                                </Badge>
                            </div>

                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{product.short_description}</p>
                        </div>

                        {/* Price Section */}
                        <div className="glass-card p-6 rounded-2xl space-y-4">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-black text-primary">
                                    ₹{product.price.toLocaleString()}
                                </span>
                                {product.mrp > product.price && (
                                    <>
                                        <span className="text-xl text-muted-foreground line-through">
                                            ₹{product.mrp.toLocaleString()}
                                        </span>
                                        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                                            {discount}% OFF
                                        </Badge>
                                    </>
                                )}
                            </div>

                            {product.cashback_amount > 0 && (
                                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                    <Tag className="w-5 h-5 text-emerald-500" />
                                    <div>
                                        <p className="font-semibold text-emerald-500">
                                            Instant Cashback: ₹{product.cashback_amount}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Credited to your wallet on delivery
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                {product.stock_quantity > 0 ? (
                                    <>
                                        <Check className="w-5 h-5 text-emerald-500" />
                                        <span className="text-emerald-500 font-semibold">In Stock</span>
                                        {product.stock_quantity < 10 && (
                                            <span className="text-amber-500 text-sm">
                                                (Only {product.stock_quantity} left)
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <span className="text-destructive font-semibold">Out of Stock</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="font-semibold">Quantity:</label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </Button>
                                    <span className="w-12 text-center font-bold">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        disabled={quantity >= product.stock_quantity}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 h-14 text-lg rounded-xl"
                                    onClick={() => handleAddToCart()}
                                    disabled={product.stock_quantity === 0}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-14 w-14"
                                    onClick={() => handleAddToWishlist()}
                                >
                                    <Heart className="w-5 h-5" />
                                </Button>
                                {isAffiliate && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-14 w-14"
                                        onClick={generateAffiliateLink}
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 glass-card rounded-xl">
                                <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                                <p className="text-xs font-semibold">Free Delivery</p>
                            </div>
                            <div className="text-center p-4 glass-card rounded-xl">
                                <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-primary" />
                                <p className="text-xs font-semibold">Secure Payment</p>
                            </div>
                            <div className="text-center p-4 glass-card rounded-xl">
                                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                                <p className="text-xs font-semibold">Easy Returns</p>
                            </div>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map(tag => (
                                    <Badge key={tag} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Description & Specifications Tabs */}
                <div className="mt-16">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="w-full justify-start border-b border-slate-200 dark:border-slate-800 bg-transparent rounded-none h-auto p-0 space-x-8">
                            <TabsTrigger
                                value="description"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-slate-500 px-0 py-4 text-lg"
                            >
                                Description
                            </TabsTrigger>
                            <TabsTrigger
                                value="specifications"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-slate-500 px-0 py-4 text-lg"
                            >
                                Specifications
                            </TabsTrigger>
                            <TabsTrigger
                                value="reviews"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-slate-500 px-0 py-4 text-lg"
                            >
                                Reviews (128)
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="pt-8 animate-in fade-in-50">
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <div className="glass-card p-8 rounded-3xl bg-white/50 dark:bg-slate-900/50">
                                    <p className="whitespace-pre-line text-lg leading-loose text-slate-600 dark:text-slate-300">
                                        {product.description}
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="specifications" className="pt-8 animate-in fade-in-50">
                            <div className="glass-card p-8 rounded-3xl bg-white/50 dark:bg-slate-900/50">
                                <h3 className="text-xl font-bold mb-6">Technical Specifications</h3>
                                <div className="grid md:grid-cols-2 gap-y-4 gap-x-12">
                                    {product.specifications ? Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                                            <span className="font-medium text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{value as string}</span>
                                        </div>
                                    )) : (
                                        <p className="text-muted-foreground">No specifications available.</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews" className="pt-8 animate-in fade-in-50">
                            <div className="grid gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="glass-card p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Avatar>
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">Alex Johnson {i}</p>
                                                <div className="flex text-amber-500">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <Star className="w-4 h-4 fill-current" />
                                                </div>
                                            </div>
                                            <span className="ml-auto text-sm text-slate-400">2 days ago</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300">
                                            "Absolutely amazing product! It exceeded my expectations. The quality is top-notch and delivery was super fast. Highly recommended!"
                                        </p>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full">Load More Reviews</Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <ProductSection
                        title="You Might Also Like"
                        type="scroll"
                        limit={8}
                        categoryId={product.category_id}
                        excludeProductId={product.id}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                    />
                </div>
            </div>

            {/* Affiliate Link Dialog */}
            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Your Affiliate Link</DialogTitle>
                        <DialogDescription>
                            Share this link to earn 10% commission on every sale!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg break-all text-sm font-mono">
                            {affiliateLink}
                        </div>
                        <Button
                            className="w-full"
                            onClick={copyAffiliateLink}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Link
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductDetailPage;
