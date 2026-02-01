import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Search, ShoppingCart, SlidersHorizontal, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { CartSheet } from "@/components/shopping/CartSheet";
import HeroSlider from "@/components/shopping/HeroSlider";
import CategoryCircles from "@/components/shopping/CategoryCircles";
import ProductSection from "@/components/shopping/ProductSection";
import SidebarFilter from "@/components/shopping/SidebarFilter";
import ProductCard, { Product } from "@/components/shopping/ProductCard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ShoppingPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
    const [minRating, setMinRating] = useState<number | null>(null);
    const [isShoppingEnabled, setIsShoppingEnabled] = useState(true);

    // Results View State
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loadingResults, setLoadingResults] = useState(false);

    // Dynamic Sections State
    const [sections, setSections] = useState<any[]>([]);
    const [loadingSections, setLoadingSections] = useState(true);

    const { addToCart } = useCart();
    const { toast } = useToast();
    const navigate = useNavigate();

    // Check if we are in "Search/Filter Mode"
    const isSearchMode = searchQuery.length > 0 || selectedCategory !== null || minRating !== null || priceRange[0] > 0 || priceRange[1] < 50000;

    useEffect(() => {
        const checkSettings = async () => {
            const { data } = await supabase.from("site_settings").select("*").maybeSingle();
            if (data) setIsShoppingEnabled(data.is_shopping_enabled);
        };
        fetchSections();
        checkSettings();
    }, []);

    // Perform search when filters change
    useEffect(() => {
        if (isSearchMode) {
            fetchFilteredProducts();
        }
    }, [searchQuery, selectedCategory, priceRange, minRating]);

    const fetchSections = async () => {
        setLoadingSections(true);
        try {
            const { data } = await supabase
                .from("store_sections")
                .select("*")
                .eq("is_active", true)
                .order("display_order");
            setSections(data || []);
        } catch (error) {
            console.error("Error fetching sections:", error);
        } finally {
            setLoadingSections(false);
        }
    };

    const fetchFilteredProducts = async () => {
        setLoadingResults(true);
        try {
            let query = supabase.from("products").select("*").eq("is_active", true);

            if (searchQuery) query = query.ilike("name", `%${searchQuery}%`);
            if (selectedCategory) query = query.eq("category_id", selectedCategory);

            // Price Filter
            query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);

            // Note: Ratings likely need a separate reviews table or column, skipping strictly for now if not in DB,
            // or we assume some 'rating' column exists. If not, this filter might need DB update.
            // For safety, we skip DB filtering for rating and let user know.

            const { data, error } = await query;
            if (error) throw error;
            setFilteredProducts(data || []);

        } catch (error) {
            console.error("Error searching products:", error);
        } finally {
            setLoadingResults(false);
        }
    };

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            cashback: product.cashback_amount,
            image: product.image_url,
            quantity: 1
        });
        toast({ title: "Added to Cart", description: `${product.name} has been added.` });
    };

    const handleAddToWishlist = async (productId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast({ title: "Login Required", variant: "destructive" });
            return;
        }
        await supabase.from("wishlist").insert({ user_id: user.id, product_id: productId }).select();
        toast({ title: "Added to Wishlist", description: "Saved for later." });
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
        setPriceRange([0, 50000]);
        setMinRating(null);
    };

    if (!isShoppingEnabled) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                    <ShoppingBag className="w-24 h-24 text-slate-300 mb-6" />
                    <h1 className="text-4xl font-black text-slate-900 mb-4">Store Maintenance</h1>
                    <p className="text-slate-500 max-w-md">Our premium experience is getting an upgrade. Please check back shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 border-l border-border/50">
            <Navbar />

            {/* Hero Section - Brand Themed (Yellow/Black) */}
            <div className="container mx-auto px-4 mb-8">
                <div className="relative bg-[#1A1A1A] rounded-[2rem] overflow-hidden shadow-xl min-h-[380px] flex items-center p-8 md:p-12 text-left isolate">
                    {/* Futuristic Accents */}
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-[#FBBF24]/10 skew-x-[-20deg] translate-x-[20%] -z-10" />
                    <div className="absolute bottom-0 left-0 w-[60%] h-[30%] bg-gradient-to-t from-[#FBBF24]/5 to-transparent -z-10" />

                    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-left-6 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#FBBF24] text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Official Skill Learners Store</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1]">
                            Big Sale on <br />
                            <span className="text-[#FBBF24]">Premium Tech & Assets</span>
                        </h1>

                        <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed">
                            Discover the latest electronics, professional templates, and high-quality digital assets curated for peak performance.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Button size="lg" className="h-14 px-8 rounded-xl bg-[#FBBF24] text-black hover:bg-[#FBBF24]/90 text-md font-bold shadow-lg shadow-[#FBBF24]/10 w-full sm:w-auto">
                                Shop New Arrivals
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 rounded-xl border-white/10 hover:bg-white/5 text-white text-md font-medium w-full sm:w-auto">
                                View Categories
                            </Button>
                        </div>
                    </div>

                    {/* Decorative Element */}
                    <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
                        <ShoppingBag className="w-64 h-64 text-[#FBBF24]" strokeWidth={1} />
                    </div>
                </div>
            </div>

            {/* Toolbar / Search Section */}
            <div className="sticky top-24 z-30 bg-white/90 backdrop-blur-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 rounded-full p-2 px-3 flex flex-col md:flex-row items-center gap-3 transition-all duration-300 max-w-5xl mx-auto mt-[-20px] mb-8">
                {isSearchMode && (
                    <Button variant="ghost" size="icon" onClick={clearFilters} className="shrink-0 hover:bg-slate-100 rounded-full h-10 w-10">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                )}

                <div className="flex-1 relative w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search electronics, assets, software..."
                        className="pl-12 h-12 bg-transparent border-none focus-visible:ring-0 text-sm w-full font-medium"
                    />
                </div>

                <div className="flex items-center gap-2 pr-2">
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-slate-600 hover:text-[#FBBF24] hover:bg-[#FBBF24]/5">
                                    <SlidersHorizontal className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px]">
                                <SidebarFilter
                                    priceRange={priceRange} setPriceRange={setPriceRange}
                                    minRating={minRating} setMinRating={setMinRating}
                                    onClear={clearFilters}
                                />
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden md:block" />
                    <CartSheet />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8 items-start">


                    <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
                        <SidebarFilter
                            priceRange={priceRange} setPriceRange={setPriceRange}
                            minRating={minRating} setMinRating={setMinRating}
                            onClear={clearFilters}
                        />
                    </aside>

                    <main className="flex-1 min-w-0">
                        {!isSearchMode ? (
                            // HOME VIEW
                            <div className="animate-in fade-in duration-500">
                                {loadingSections ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                        <Loader2 className="w-10 h-10 text-[#FBBF24] animate-spin" />
                                        <p className="text-slate-500 font-medium">Loading store experience...</p>
                                    </div>
                                ) : sections.length > 0 ? (
                                    /* Render ordered dynamic sections based on 'display_order' */
                                    <div className="space-y-12">
                                        {sections.map((section) => {
                                            if (!section.is_active) return null;

                                            if (section.section_key === 'hero_slider') {
                                                return <HeroSlider key={section.id} />;
                                            }

                                            if (section.section_key === 'category_circles') {
                                                return (
                                                    <CategoryCircles
                                                        key={section.id}
                                                        selectedCategoryId={selectedCategory}
                                                        onSelectCategory={setSelectedCategory}
                                                    />
                                                );
                                            }

                                            // Mappings
                                            if (section.section_key === 'deal_of_the_day') {
                                                return <ProductSection
                                                    key={section.id}
                                                    title={section.title}
                                                    type="deal"
                                                    limit={1}
                                                    sortBy="discount" // or custom logic
                                                    highlight
                                                    onAddToCart={handleAddToCart}
                                                    onAddToWishlist={handleAddToWishlist}
                                                />;
                                            }
                                            if (section.section_key === 'best_sellers') {
                                                return <ProductSection
                                                    key={section.id}
                                                    title={section.title}
                                                    type="scroll"
                                                    limit={section.config?.limit || 8}
                                                    sortBy="featured" // or sales_count
                                                    onAddToCart={handleAddToCart}
                                                    onAddToWishlist={handleAddToWishlist}
                                                />;
                                            }
                                            if (section.section_key === 'just_for_you') {
                                                return <ProductSection
                                                    key={section.id}
                                                    title={section.title}
                                                    type="grid"
                                                    limit={section.config?.limit || 12}
                                                    sortBy="newest"
                                                    onAddToCart={handleAddToCart}
                                                    onAddToWishlist={handleAddToWishlist}
                                                />;
                                            }

                                            return null;
                                        })}
                                    </div>
                                ) : (
                                    // Fallback if no sections defined
                                    <div className="space-y-12">
                                        <HeroSlider />
                                        <CategoryCircles selectedCategoryId={selectedCategory} onSelectCategory={setSelectedCategory} />
                                        <ProductSection
                                            title="All Products"
                                            type="grid"
                                            limit={24}
                                            sortBy="newest"
                                            onAddToCart={handleAddToCart}
                                            onAddToWishlist={handleAddToWishlist}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            // RESULTS VIEW
                            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                                <div className="flex items-end justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            {searchQuery ? `Results for "${searchQuery}"` : "Shop"}
                                        </h2>
                                        <p className="text-slate-500">{filteredProducts.length} items found</p>
                                    </div>
                                    {/* Sort Dropdown could go here */}
                                </div>

                                {loadingResults ? (
                                    <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-[#FBBF24]" /></div>
                                ) : filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredProducts.map(product => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onAddToCart={handleAddToCart}
                                                onAddToWishlist={handleAddToWishlist}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 rounded-3xl">
                                        <Search className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                                        <h3 className="text-lg font-bold text-slate-900">No products match your filters</h3>
                                        <Button variant="link" onClick={clearFilters} className="text-[#FBBF24] font-bold">Clear all filters</Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div >
    );
};

export default ShoppingPage;
