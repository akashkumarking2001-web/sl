import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Banner {
    id: string;
    title: string;
    image_url: string;
    redirect_link: string;
    description?: string;
}

const HeroSlider = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    // Fallback constants
    const SUPABASE_URL = "https://vwzqaloqlvlewvijiqeu.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3enFhbG9xbHZsZXd2aWppcWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNjMwMjQsImV4cCI6MjA4NDkzOTAyNH0.oEuQrpidyXbKYdy3SpuMDTHZveqZNHaJHMY3TK3ir2E";

    const fetchBanners = async (retryCount = 0) => {
        try {
            const url = new URL(`${SUPABASE_URL}/rest/v1/store_banners`);
            url.searchParams.append("select", "*");
            url.searchParams.append("is_active", "eq.true");
            url.searchParams.append("order", "display_order.asc");

            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data = await response.json();
            setBanners((data as any[]) || []);
            setLoading(false);
        } catch (error: any) {
            console.warn(`Fetch banners attempt ${retryCount + 1} failed:`, error.message);
            if (retryCount < 3) {
                setTimeout(() => fetchBanners(retryCount + 1), 1000 * (retryCount + 1));
                return;
            }
            console.error("Error fetching banners:", error);
            setLoading(false);
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (loading) {
        return <Skeleton className="w-full h-[300px] md:h-[400px] rounded-2xl" />;
    }

    if (banners.length === 0) return null;

    return (

        <div
            data-testid="hero-slider"
            className="relative group w-full h-[400px] md:h-[500px] overflow-hidden rounded-3xl bg-slate-900 shadow-2xl mb-12"
            onMouseEnter={() => setBanners(prev => [...prev])} // Hack to potentially pause if I add pause logic, but for now just simpler
        >
            <div
                className="flex transition-transform duration-1000 ease-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="min-w-full h-full relative">
                        <img
                            src={banner.image_url}
                            alt={banner.title}
                            className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000"
                        />
                        {/* Improved Overlay Gradient for visibility */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/50 to-transparent flex items-center">
                            <div className="container mx-auto px-8 md:px-16">
                                <div className="max-w-2xl text-white animate-in slide-in-from-left-10 fade-in duration-700 space-y-6">
                                    <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-tight drop-shadow-lg">
                                        {banner.title}
                                    </h2>
                                    {banner.description && (
                                        <p className="text-lg md:text-xl text-slate-200 font-medium max-w-lg leading-relaxed drop-shadow-md">
                                            {banner.description}
                                        </p>
                                    )}
                                    <Button
                                        onClick={() => navigate(banner.redirect_link || "/shopping")}
                                        className="bg-[#FBBF24] text-black hover:bg-[#FBBF24]/90 hover:scale-105 font-black px-8 py-6 text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] border-none"
                                    >
                                        Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full border border-white/10 transition-all transform hover:scale-110 z-10"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full border border-white/10 transition-all transform hover:scale-110 z-10"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? "bg-[#FBBF24] w-12 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                                    : "bg-white/30 w-3 hover:bg-white/60"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HeroSlider;
