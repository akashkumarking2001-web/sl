import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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
    PenLine,
    Loader2,
    TrendingUp
} from "lucide-react";
import ProductSection from "@/components/shopping/ProductSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { Capacitor } from "@capacitor/core";
import NativeHeader from "@/components/layout/NativeHeader";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";

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
    affiliate_commission_amount?: number;
    affiliate_commission_percentage?: number;
    stock_quantity: number;
    is_featured: boolean;
    tags: string[];
    specifications: any;
    category_id: string;
    average_rating?: number;
    review_count?: number;
}

interface Review {
    id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles?: {
        full_name: string;
        avatar_url: string;
    }
}

const ProductDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { toast } = useToast();
    const ref = searchParams.get("ref");
    const isNative = Capacitor.isNativePlatform() || ['8080', '5174'].includes(window.location.port);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAffiliate, setIsAffiliate] = useState(false);
    const [affiliateCode, setAffiliateCode] = useState("");
    const [affiliateLink, setAffiliateLink] = useState("");
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [copied, setCopied] = useState(false);

    // Review State
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (slug) {
            // Cancel any pending requests
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            loadInitialData();
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [slug]);

    const loadInitialData = async () => {
        console.log("Loading initial data for slug:", slug);
        console.time("ProductLoad");
        setLoading(true);

        const currentSignal = abortControllerRef.current?.signal;

        // Safety timeout for INSTANT LOAD
        const timeout = setTimeout(() => {
            console.warn("Product load timeout triggered");
            setLoading(false);
        }, 500);

        try {
            const fetchedProduct = await fetchProduct(currentSignal);
            if (fetchedProduct && !currentSignal?.aborted) {
                console.log("Product fetched, now checking affiliate and reviews");

                // Fetch reviews safely
                try {
                    await fetchReviews(fetchedProduct.id, currentSignal);
                } catch (revErr: any) {
                    if (revErr.name !== 'AbortError') {
                        console.warn("Could not fetch reviews:", revErr.message);
                    }
                }

                // Check affiliate status safely
                try {
                    await checkAffiliateStatus(fetchedProduct.id, currentSignal);
                } catch (affErr: any) {
                    if (affErr.name !== 'AbortError') {
                        console.warn("Could not check affiliate status:", affErr.message);
                    }
                }
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error("Initialization error:", err);
            }
        } finally {
            if (!currentSignal?.aborted) {
                console.log("Initialization complete, clearing timeout and setting loading to false");
                console.timeEnd("ProductLoad");
                clearTimeout(timeout);
                setLoading(false);
            }
        }
    };

    // Fetches the product data from Supabase
    const fetchProduct = async (signal?: AbortSignal) => {
        console.time("fetchProduct");
        try {
            setFetchError(null);
            const cleanSlug = slug?.replace(/\/$/, "");
            console.log("🔍 fetchProduct sequence started for:", cleanSlug);

            if (!cleanSlug) {
                console.error("No slug provided in URL params");
                return null;
            }

            // STRATEGY 1: Exact Case-Insensitive Match (Best Case)
            console.log("Strategy 1: Trying exact case-insensitive match...");
            let query1 = supabase
                .from("products")
                .select("*, category:category_id(name)")
                .ilike("slug", cleanSlug)
                .maybeSingle();


            let { data, error } = await query1;

            if (error) {
                // Ignore abort errors
                if (error.code === '20' || error.message.includes('AbortError')) throw error;

                console.error("Supabase Strategy 1 error:", error.message);
                setFetchError(error.message);
                // Continue to other strategies
            }

            // STRATEGY 2: Match by ID if numeric
            if (!data && cleanSlug && /^\d+$/.test(cleanSlug) && !signal?.aborted) {
                console.log("Strategy 2: Numeric slug detected, trying to fetch by ID...");
                let query2 = supabase
                    .from("products")
                    .select("*, category:category_id(name)")
                    .eq("id", cleanSlug)
                    .maybeSingle();


                const { data: idData } = await query2;

                if (idData) {
                    console.log("Strategy 2 Success: Found by ID");
                    data = idData;
                }
            }

            // STRATEGY 3: Fetch all and filter (Brute Force / Resilience)
            if (!data && !signal?.aborted) {
                console.log("Strategy 3: Still no product, fetching all products to find match...");
                let query3 = supabase
                    .from("products")
                    .select("*, category:category_id(name)");


                const { data: allProducts, error: allError } = await query3;

                if (!allError && allProducts) {
                    data = allProducts.find(p =>
                        p.slug?.toLowerCase() === cleanSlug.toLowerCase() ||
                        p.name?.toLowerCase().replace(/\s+/g, '-') === cleanSlug.toLowerCase()
                    );
                    if (data) console.log("Strategy 3 Success: Found in full list");
                }
            }

            // STRATEGY 4: Partial Match as last resort
            if (!data && !signal?.aborted) {
                console.log("Strategy 4: Trying partial ilike match...");
                let query4 = supabase
                    .from("products")
                    .select("*, category:category_id(name)")
                    .ilike("slug", `%${cleanSlug}%`)
                    .limit(1)
                    .maybeSingle();


                const { data: partialData } = await query4;

                if (partialData) {
                    console.log("Strategy 4 Success: Found partial match");
                    data = partialData;
                }
            }

            if (!data) {
                if (signal?.aborted) return null;
                console.warn("❌ All retrieval strategies failed for:", cleanSlug);
                setProduct(null);
                return null;
            }

            console.log("✅ Final Strategy Success:", data.name);
            setProduct(data);
            return data;
        } catch (error: any) {
            // IGNORE ABORT ERRORS
            if (error.name === 'AbortError' || error.message?.includes('aborted')) {
                console.log("Fetch aborted gracefully");
                return null;
            }
            console.error("Critical error in fetchProduct:", error);
            setFetchError(error.message || "An unexpected error occurred");
            setProduct(null);
            return null;
        } finally {
            console.timeEnd("fetchProduct");
        }
    };

    const fetchReviews = async (productId: string, signal?: AbortSignal) => {
        setLoadingReviews(true);
        try {
            let query = supabase
                .from("reviews")
                .select("*, profiles(full_name, avatar_url)")
                .eq("product_id", productId)
                .order("created_at", { ascending: false });


            const { data, error } = await query;

            if (error) {
                if (error.code === '42P01') {
                    console.warn("Reviews table does not exist yet.");
                } else {
                    console.error("Error fetching reviews:", error.message);
                }
                return;
            }

            if (data) {
                setReviews(data);
            }
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
            console.error("Critical error in fetchReviews:", err.message);
        } finally {
            if (!signal?.aborted) {
                setLoadingReviews(false);
            }
        }
    };

    const handleSubmitReview = async () => {
        if (!product) return;
        setSubmittingReview(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast({ title: "Login Required", description: "Please login to write a review", variant: "destructive" });
                return;
            }

            const { error } = await supabase
                .from("reviews")
                .insert({
                    product_id: product.id,
                    user_id: user.id,
                    rating: newRating,
                    comment: newComment
                });

            if (error) throw error;

            toast({ title: "Review Submitted", description: "Thank you for your feedback!" });
            setShowReviewDialog(false);
            setNewComment("");
            fetchReviews(product.id);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setSubmittingReview(false);
        }
    };

    useEffect(() => {
        if (product?.id) {
            fetchReviews(product.id);
        }
    }, [product?.id]);

    const checkAffiliateStatus = async (productId?: string, signal?: AbortSignal) => {
        try {
            if (signal?.aborted) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Check if user is an approved affiliate
                const { data: appData } = await supabase
                    .from("affiliate_applications")
                    .select("status")
                    .eq("user_id", user.id)
                    .eq("status", "approved")
                    .maybeSingle();

                if (appData) {
                    setIsAffiliate(true);
                    // Fetch existing generic or specific referral code
                    const { data: linkData } = await supabase
                        .from("affiliate_links")
                        .select("referral_code")
                        .eq("user_id", user.id)
                        .eq("product_id", productId || product?.id || null)
                        .limit(1)
                        .maybeSingle();

                    if (linkData) {
                        setAffiliateCode(linkData.referral_code);
                    }
                }
            }
        } catch (err) {
            console.warn("Affiliate check failed:", err);
        }
    };

    const generateAffiliateLink = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !product) return toast({ title: "Login Required" });

        if (!isAffiliate) {
            return toast({
                title: "Not an Affiliate",
                description: "Please apply for the affiliate program first.",
                variant: "destructive"
            });
        }

        try {
            let code = affiliateCode;

            if (!code) {
                // Generate a new custom referral code for this product
                const timestamp = Date.now().toString(36).toUpperCase();
                const random = Math.random().toString(36).substring(2, 5).toUpperCase();
                const newCode = `REF-${user.id.substring(0, 4).toUpperCase()}-${timestamp}${random}`;

                const { data, error } = await supabase
                    .from("affiliate_links")
                    .insert({
                        user_id: user.id,
                        product_id: product.id,
                        referral_code: newCode
                    })
                    .select("referral_code")
                    .single();

                if (error) throw error;
                code = data.referral_code;
                setAffiliateCode(code);
            }

            const link = `${window.location.origin}/product/${slug}?ref=${code}`;
            setAffiliateLink(link);
            setShowShareDialog(true);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            cashback: product.cashback_amount,
            image: product.image_url,
            quantity: quantity,
            referralCode: ref || undefined,
            commission_amount: product.affiliate_commission_amount || 0,
            commission_percentage: product.affiliate_commission_percentage || 0
        });
        toast({ title: "Added to Cart" });
    };

    const handleBuyNow = () => {
        if (!product) return;
        // Check if user is logged in
        if (!user) {
            toast({ title: "Login Required", description: "Please login to purchase products." });
            navigate("/login");
            return;
        }

        // Pass product and ref via state to PaymentGateway
        navigate("/payment", {
            state: {
                product: {
                    ...product,
                    referralCode: ref || undefined,
                    commission_amount: product.affiliate_commission_amount || 0,
                    commission_percentage: product.affiliate_commission_percentage || 0
                },
                fromProduct: true
            }
        });
    };

    const addToWishlist = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !product) return toast({ title: "Login Required" });
        try {
            await supabase.from("wishlist").insert({ user_id: user.id, product_id: product.id });
            toast({ title: "Added to Wishlist" });
        } catch (err) {
            toast({ title: "Already in Wishlist" });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
                <Navbar />
                <div className="container mx-auto px-4 py-8 pt-24">
                    {/* Back Button Skeleton */}
                    <Skeleton className="h-6 w-32 mb-8" />

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Gallery Skeleton */}
                        <div className="space-y-4">
                            <Skeleton className="w-full aspect-square rounded-3xl" />
                            <div className="grid grid-cols-5 gap-3">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <Skeleton key={i} className="w-full aspect-square rounded-xl" />
                                ))}
                            </div>
                        </div>

                        {/* Info Skeleton */}
                        <div className="space-y-8">
                            <div>
                                <Skeleton className="h-6 w-24 mb-4 rounded-full" />
                                <Skeleton className="h-12 w-3/4 mb-4 rounded-lg" />
                                <div className="flex items-center gap-4 mb-6">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>

                            {/* Price Box Skeleton */}
                            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
                                <div className="flex items-baseline gap-3">
                                    <Skeleton className="h-10 w-32" />
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-16 w-full rounded-2xl" />
                                <div className="flex gap-4 pt-4">
                                    <Skeleton className="h-12 w-32 rounded-xl" />
                                    <Skeleton className="h-12 flex-1 rounded-xl" />
                                    <Skeleton className="h-12 w-12 rounded-xl" />
                                </div>
                            </div>

                            {/* Features Skeleton */}
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map((_, i) => (
                                    <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col items-center justify-center">
                <Navbar />
                <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-10 h-10 text-slate-400" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Product Not Found</h1>
                    <p className="text-slate-500 max-w-md mx-auto">The product "{slug}" might have been removed or is temporarily unavailable.</p>
                    {fetchError && (
                        <p className="text-rose-500 text-sm mt-2 font-mono bg-rose-50 dark:bg-rose-900/10 p-2 rounded-lg border border-rose-100 dark:border-rose-900/20 max-w-md mx-auto">
                            Details: {fetchError}
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            onClick={() => {
                                console.log("Manual retry triggered");
                                loadInitialData();
                            }}
                            className="rounded-xl font-bold px-8 h-12 bg-primary text-black hover:bg-primary/90 min-w-[160px]"
                        >
                            <Loader2 className={cn("w-4 h-4 mr-2", loading ? "animate-spin" : "hidden")} />
                            Retry Connection
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/shopping")}
                            className="rounded-xl font-bold px-8 h-12 min-w-[160px]"
                        >
                            Back to Store
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Prepare image gallery and discount calculation
    const allImages = [product.image_url, ...(product.gallery_images || [])];
    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    // Native Mobile View
    if (isNative) {
        return (
            <div className="h-[100dvh] w-full bg-black text-white flex flex-col font-sans overflow-hidden">
                <NativeHeader title="Product Details" />

                <main className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
                    {/* Product Image Section */}
                    <div className="relative w-full aspect-square bg-white">
                        <img
                            src={allImages[selectedImage]}
                            className="w-full h-full object-contain"
                            alt={product.name}
                        />
                        {allImages.length > 1 && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {allImages.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-1.5 h-1.5 rounded-full transition-all",
                                            selectedImage === i ? "bg-primary w-4" : "bg-gray-300"
                                        )}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-8 space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black tracking-tight leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-2">
                                <div className="flex text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("w-3.5 h-3.5", i < (product.average_rating || 5) ? "fill-current" : "text-gray-800")} />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{reviews.length} Reviews</span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-black text-white">₹{product.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-600 line-through font-bold">₹{product.mrp.toLocaleString()}</span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/30 px-2 py-0.5 rounded-full">{discount}% Off</span>
                        </div>

                        <div className="glass-card p-5 rounded-3xl border border-white/5 space-y-4">
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                {product.short_description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                                    <Truck className="w-5 h-5 text-primary mb-2" />
                                    <span className="text-[10px] font-black text-white uppercase">Fast Ship</span>
                                </div>
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                                    <RotateCcw className="w-5 h-5 text-primary mb-2" />
                                    <span className="text-[10px] font-black text-white uppercase">7 Day Return</span>
                                </div>
                            </div>
                        </div>

                        {/* Buy Now Button - Floating / Fixed at bottom? User said clickable. I'll make it prominent. */}
                        <div className="pt-4 flex gap-3">
                            <Button
                                onClick={handleAddToCart}
                                variant="outline"
                                className="h-14 flex-1 rounded-2xl border-white/10 bg-white/5 text-white font-black uppercase tracking-widest text-xs"
                            >
                                Add Cart
                            </Button>
                            <Button
                                onClick={handleBuyNow}
                                className="h-14 flex-[2] rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-xs shadow-glow-gold/20 active:scale-95 transition-all"
                            >
                                Buy Now
                            </Button>
                        </div>
                    </div>

                    {/* Specifications Section */}
                    <div className="px-6 mt-8 pb-12">
                        <h3 className="text-lg font-black tracking-tight italic mb-4">Specifications</h3>
                        <div className="space-y-2">
                            {product.specifications ? Object.entries(product.specifications).map(([k, v]: any) => (
                                <div key={k} className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{k.replace(/_/g, ' ')}</span>
                                    <span className="text-xs font-black text-gray-200">{v}</span>
                                </div>
                            )) : <p className="text-sm text-gray-500">No specifications found.</p>}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFC] font-sans">
            <Navbar />
            <div className="container mx-auto px-4 py-12 pt-32 transition-all duration-700 animate-in fade-in">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/shopping")}
                    className="mb-10 gap-2 pl-0 hover:bg-transparent text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Collective
                </Button>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Gallery */}
                    <div className="space-y-4">
                        <div className="group relative rounded-3xl overflow-hidden aspect-square border border-slate-200 bg-white cursor-zoom-in">
                            <img
                                src={allImages[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-150"
                            />
                        </div>
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-3">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={cn("rounded-xl border-2 overflow-hidden aspect-square transition-all", selectedImage === idx ? "border-primary" : "border-transparent hover:border-slate-300")}
                                    >
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-6">
                            {product.is_featured && (
                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm">
                                    <Star className="w-3.5 h-3.5 fill-current" /> Curated Selection
                                </Badge>
                            )}
                            <h1 className="text-4xl lg:text-6xl font-black text-[#1A1F2C] leading-[1.1] tracking-tighter">{product.name}</h1>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("w-4 h-4", i < (product.average_rating || 5) ? "fill-current" : "text-slate-200")} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-black text-slate-900 border-b-2 border-primary/20">{product.average_rating || 5.0}</span>
                                </div>
                                <div className="h-4 w-px bg-slate-200" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{reviews.length} Verified Reviews</span>
                                {product.stock_quantity < 10 && (
                                    <>
                                        <div className="h-4 w-px bg-slate-200" />
                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Running Out: {product.stock_quantity} Left</span>
                                    </>
                                )}
                            </div>

                            <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl">{product.short_description}</p>
                        </div>

                        <div className="p-8 bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-slate-100 space-y-8">
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest line-through">MRP ₹{product.mrp.toLocaleString()}</span>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{product.price.toLocaleString()}</span>
                                    <div className="bg-emerald-500 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20">
                                        -{discount}% OFF
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {(product.affiliate_commission_amount > 0 || product.affiliate_commission_percentage > 0) && (
                                    <div className="flex items-center gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-[1.5rem] group cursor-default">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-blue-100 flex items-center justify-center transition-transform group-hover:scale-110">
                                            <TrendingUp className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-blue-700 uppercase tracking-widest mb-0.5">
                                                {isAffiliate ? "Network Earnings:" : "Affiliate Potential:"}
                                            </p>
                                            <p className="text-base font-black text-slate-900">₹{product.affiliate_commission_amount || (product.price * (product.affiliate_commission_percentage || 0)) / 100} Reward</p>
                                        </div>
                                        {!isAffiliate && (
                                            <Link to="/affiliate/apply" className="ml-auto text-[10px] font-black text-blue-600 border-b-2 border-blue-600/30 hover:border-blue-600 transition-colors">BECOME PARTNER</Link>
                                        )}
                                    </div>
                                )}

                                {product.cashback_amount > 0 && (
                                    <div className="flex items-center gap-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-[1.5rem] group cursor-default">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center transition-transform group-hover:scale-110">
                                            <Tag className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-0.5">Instant Cashback:</p>
                                            <p className="text-base font-black text-slate-900">₹{product.cashback_amount} in Wallet</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-100">
                                <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl h-14 p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-full flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all font-black"
                                    >-</button>
                                    <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        className="w-10 h-full flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all font-black"
                                    >+</button>
                                </div>
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={product.stock_quantity === 0}
                                    className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02]"
                                >
                                    {product.stock_quantity > 0 ? "ADD TO CART" : "SOLD OUT"}
                                </Button>
                            </div>

                            <Button
                                onClick={handleBuyNow}
                                className="w-full h-18 rounded-[1.5rem] bg-primary text-black font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
                            >
                                BUY NOW
                            </Button>

                            <div className="grid grid-cols-3 gap-4 text-center">
                                {[
                                    { icon: Truck, label: "Fast Delivery", sub: "2-4 Days" },
                                    { icon: ShieldCheck, label: "Secure Pay", sub: "Encrypted" },
                                    { icon: RotateCcw, label: "Easy Return", sub: "7 Days" }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100">
                                        <item.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                                        <p className="font-bold text-xs text-slate-900">{item.label}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-20">
                        <Tabs defaultValue="desc" className="w-full">
                            <TabsList className="w-full justify-start border-b border-slate-200 bg-transparent p-0 mb-8 overflow-x-auto">
                                <TabsTrigger value="desc" className="px-8 py-4 text-base font-bold bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary rounded-none">Description</TabsTrigger>
                                <TabsTrigger value="specs" className="px-8 py-4 text-base font-bold bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary rounded-none">Specifications</TabsTrigger>
                                <TabsTrigger value="reviews" className="px-8 py-4 text-base font-bold bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary rounded-none">Reviews ({reviews.length})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="desc" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="prose prose-lg max-w-none text-slate-600 dark:text-slate-300">
                                    <p className="whitespace-pre-line">{product.description}</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="specs">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {product.specifications ? Object.entries(product.specifications).map(([k, v]: any) => (
                                        <div key={k} className="flex justify-between p-4 bg-white border border-slate-100 rounded-xl">
                                            <span className="font-semibold text-slate-500 capitalize">{k.replace(/_/g, " ")}</span>
                                            <span className="font-bold text-slate-900">{v}</span>
                                        </div>
                                    )) : <p>No specifications available.</p>}
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-bold">Customer Reviews</h3>
                                    <Button onClick={() => setShowReviewDialog(true)} className="gap-2 rounded-xl">
                                        <PenLine className="w-4 h-4" /> Write Review
                                    </Button>
                                </div>

                                {reviews.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {reviews.map(review => (
                                            <div key={review.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={review.profiles?.avatar_url} />
                                                            <AvatarFallback>U</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-bold text-sm text-slate-900">{review.profiles?.full_name || 'Anonymous'}</p>
                                                            <div className="flex text-amber-500 text-xs">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-current" : "text-slate-200")} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                        <Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>No reviews yet. Be the first to review!</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="mt-24">
                        <ProductSection
                            title="Related Products"
                            type="scroll"
                            limit={4}
                            categoryId={product.category_id}
                            excludeProductId={product.id}
                            onAddToCart={() => { }}
                            onAddToWishlist={() => { }}
                        />
                    </div>
                </div>

                {/* Review Dialog */}
                <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                            <DialogDescription>Share your experience with this product.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setNewRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                                            <Star className={cn("w-8 h-8", star <= newRating ? "fill-amber-500 text-amber-500" : "text-slate-200")} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Comment</label>
                                <Textarea
                                    placeholder="What did you like or dislike?"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="h-32 resize-none"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>Cancel</Button>
                            <Button onClick={handleSubmitReview} disabled={submittingReview || !newComment}>
                                {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Share Dialog */}
                <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Affiliate Link Generated</DialogTitle>
                        </DialogHeader>
                        <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
                            <code className="text-xs flex-1 break-all">{affiliateLink}</code>
                            <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard.writeText(affiliateLink); setCopied(true); }}>
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ProductDetailPage;
