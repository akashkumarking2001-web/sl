import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarFilterProps {
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    minRating: number | null;
    setMinRating: (rating: number | null) => void;
    onClear: () => void;
    className?: string;
    onClose?: () => void; // For mobile
}

const SidebarFilter = ({
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    onClear,
    className,
    onClose
}: SidebarFilterProps) => {
    return (
        <div className={`space-y-8 ${className} bg-white p-6 rounded-2xl border border-slate-100 shadow-sm`}>
            <div className="flex items-center justify-between lg:hidden mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5 text-black" />
                </Button>
            </div>

            {/* Price Range */}
            <div className="space-y-6">
                <h3 className="font-black text-xs uppercase tracking-[0.15em] text-slate-400">Price Range</h3>
                <Slider
                    defaultValue={[0, 10000]}
                    min={0}
                    max={50000}
                    step={500}
                    value={priceRange}
                    onValueChange={(val) => setPriceRange(val as [number, number])}
                    className="my-8"
                />
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Min</span>
                        <span className="text-sm font-black">₹{priceRange[0]}</span>
                    </div>
                    <div className="w-4 h-[1px] bg-slate-200" />
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Max</span>
                        <span className="text-sm font-black">₹{priceRange[1]}</span>
                    </div>
                </div>
            </div>

            {/* Ratings */}
            <div className="space-y-6">
                <h3 className="font-black text-xs uppercase tracking-[0.15em] text-slate-400">Customer Review</h3>
                <div className="space-y-3">
                    {[4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center group cursor-pointer" onClick={() => setMinRating(minRating === rating ? null : rating)}>
                            <div className={cn(
                                "w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all",
                                minRating === rating ? "bg-black border-black shadow-lg shadow-black/10" : "border-slate-200 group-hover:border-[#FBBF24]"
                            )}>
                                {minRating === rating && <div className="w-2 h-2 bg-[#FBBF24] rounded-full" />}
                            </div>
                            <Label
                                className="text-sm font-bold flex items-center cursor-pointer select-none"
                            >
                                <div className="flex items-center text-[#FBBF24] mr-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < rating ? "fill-current" : "text-slate-100"}`}
                                        />
                                    ))}
                                </div>
                                <span className={cn(minRating === rating ? "text-black" : "text-slate-500 group-hover:text-slate-900")}>& Up</span>
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full h-12 border-slate-200 text-slate-900 font-bold hover:bg-slate-50 hover:border-[#FBBF24]"
                onClick={onClear}
            >
                Clear Filters
            </Button>
        </div>
    );
};

export default SidebarFilter;
