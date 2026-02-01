import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
    Code, Video, BookOpen, Palette, Music, Download,
    Laptop, Shirt, Camera, Briefcase, Sparkles, Layout,
    Smartphone, Watch, Headphones, Monitor, Globe,
    Zap, ShoppingBag, GraduationCap
} from "lucide-react";

interface Category {
    id: string;
    name: string;
    image_url?: string;
    icon?: string;
    slug: string;
}

interface CategoryCirclesProps {
    onSelectCategory: (id: string | null) => void;
    selectedCategoryId: string | null;
}

const CategoryCircles = ({ onSelectCategory, selectedCategoryId }: CategoryCirclesProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from("product_categories")
                .select("*")
                .eq("is_active", true)
                .order("display_order");

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes("course") || lower.includes("learn") || lower.includes("education")) return GraduationCap;
        if (lower.includes("template")) return Layout;
        if (lower.includes("script") || lower.includes("code") || lower.includes("plugin")) return Code;
        if (lower.includes("video") || lower.includes("footage")) return Video;
        if (lower.includes("music") || lower.includes("audio")) return Music;
        if (lower.includes("graphic") || lower.includes("design") || lower.includes("art")) return Palette;
        if (lower.includes("ebook") || lower.includes("pdf")) return BookOpen;
        if (lower.includes("software") || lower.includes("app")) return Smartphone;
        if (lower.includes("service")) return Briefcase;
        if (lower.includes("electronics")) return Monitor;
        if (lower.includes("fashion")) return Shirt;
        if (lower.includes("access")) return Zap;
        return Sparkles; // Default
    };

    if (loading) {
        return (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]">
                        <Skeleton className="w-20 h-20 rounded-full" />
                        <Skeleton className="w-16 h-3 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
                <Layout className="w-5 h-5 text-[#FBBF24]" />
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Top Categories</h3>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 scrollbar-hide snap-x cursor-grab active:cursor-grabbing">
                {/* 'All Items' Button */}
                <button
                    onClick={() => onSelectCategory(null)}
                    className="flex flex-col items-center gap-3 min-w-[90px] group snap-start outline-none"
                >
                    <div className={cn(
                        "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border group-hover:scale-110",
                        selectedCategoryId === null
                            ? "bg-[#FBBF24] border-[#FBBF24] text-black shadow-lg ring-4 ring-[#FBBF24]/20"
                            : "bg-white border-slate-200 text-slate-600 hover:border-[#FBBF24] hover:shadow-md"
                    )}>
                        <ShoppingBag className={cn("w-8 h-8 transition-transform group-hover:rotate-12", selectedCategoryId === null ? "text-black" : "text-slate-400")} />
                    </div>
                    <span className={cn(
                        "text-sm font-medium transition-colors",
                        selectedCategoryId === null ? "text-slate-900 font-bold" : "text-slate-500 group-hover:text-slate-900"
                    )}>
                        All Items
                    </span>
                </button>

                {categories.map((category) => {
                    const Icon = getCategoryIcon(category.name);
                    const isSelected = selectedCategoryId === category.id;

                    return (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id)}
                            className="flex flex-col items-center gap-3 min-w-[90px] group snap-start"
                        >
                            <div className={cn(
                                "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border overflow-hidden group-hover:scale-110 relative",
                                isSelected
                                    ? "bg-[#FBBF24] border-[#FBBF24] text-black shadow-lg ring-4 ring-[#FBBF24]/20"
                                    : "bg-white border-slate-200 hover:border-[#FBBF24] hover:shadow-md"
                            )}>
                                {/* Gradient Backdrop for High-Fidelity look if not selected */}
                                {!isSelected && !category.image_url && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-50" />
                                )}

                                {category.image_url ? (
                                    <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Icon className={cn("w-8 h-8 transition-transform group-hover:-translate-y-1 relative z-10", isSelected ? "text-black" : "text-[#FBBF24]")} />
                                )}
                            </div>
                            <span className={cn(
                                "text-sm font-bold transition-colors whitespace-nowrap",
                                isSelected ? "text-[#FBBF24]" : "text-slate-500 group-hover:text-slate-900"
                            )}>
                                {category.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryCircles;
