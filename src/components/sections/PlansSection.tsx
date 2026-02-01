import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Shield, TrendingUp, Crown, Sparkles, Star, Gem, Bookmark, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { incomeTypes } from "@/data/packages";
import PackageComparisonTable from "./PackageComparisonTable";
import { usePackages, Package } from "@/hooks/usePackages";

// New tier naming with brand-aligned icons and gradients
const tierConfig: Record<string, {
  name: string;
  tagline: string;
  icon: any;
  gradient: string;
  bgGradient: string;
  badge: any;
  color: string;
  cardBg: string;
  borderColor: string;
  buttonColor: string;
  glowClass: string;
}> = {
  bronze: {
    name: "Basic",
    tagline: "Beginner",
    icon: Zap,
    badge: Bookmark,
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-500/10 to-transparent",
    color: "bg-blue-100 text-blue-600",
    cardBg: "bg-blue-50/90",
    borderColor: "border-blue-200",
    buttonColor: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200",
    glowClass: "hover:shadow-blue-500/40",
  },
  silver: {
    name: "Starter",
    tagline: "Intermediate",
    icon: Sparkles,
    badge: Bookmark,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-500/10 to-transparent",
    color: "bg-emerald-100 text-emerald-600",
    cardBg: "bg-emerald-50/90",
    borderColor: "border-emerald-200",
    buttonColor: "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200",
    glowClass: "hover:shadow-teal-500/40",
  },
  gold: {
    name: "Professional",
    tagline: "Advanced",
    icon: Star,
    badge: Bookmark,
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-500/10 to-transparent",
    color: "bg-amber-100 text-amber-600",
    cardBg: "bg-amber-50/90",
    borderColor: "border-amber-200",
    buttonColor: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200",
    glowClass: "hover:shadow-amber-500/40",
  },
  platinum: {
    name: "Premium",
    tagline: "Expert",
    icon: Gem,
    badge: Bookmark,
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-500/10 to-transparent",
    color: "bg-violet-100 text-violet-600",
    cardBg: "bg-violet-50/90",
    borderColor: "border-violet-200",
    buttonColor: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200",
    glowClass: "hover:shadow-violet-500/40",
  },
  diamond: {
    name: "Enterprise",
    tagline: "Master",
    icon: Crown,
    badge: Bookmark,
    gradient: "from-emerald-600 to-green-700",
    bgGradient: "from-green-500/10 to-transparent",
    color: "bg-green-100 text-green-600",
    cardBg: "bg-green-50/90",
    borderColor: "border-green-200",
    buttonColor: "bg-green-600 hover:bg-green-700 text-white shadow-green-200",
    glowClass: "hover:shadow-green-500/40",
  },
};

const PlansSection = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: packages, isLoading } = usePackages();

  const updateScrollState = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateScrollState);
    updateScrollState();

    window.addEventListener("resize", updateScrollState);
    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [packages]); // Re-run when packages load

  const scrollTo = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const cardWidth = window.innerWidth < 768 ? window.innerWidth - 48 : 280;
    const gap = 20;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : (cardWidth + gap),
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <section className="py-20 flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  // Fallback for visual continuity if needed, but we expect packages to load
  const displayPackages = packages || [];

  return (
    <section id="plans" className="py-20 lg:py-28 relative overflow-hidden bg-slate-50/50">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-5 backdrop-blur-sm">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary tracking-wide">Choose Your Path</span>
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            Premium <span className="text-gradient-gold">Learning Packages</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Invest in yourself with our expertly crafted packages. Each tier unlocks more value and income opportunities.
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500 mb-8">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-amber-500" /> Money-back guarantee</span>
            <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-amber-500" /> Proven results</span>
            <span className="flex items-center gap-2"><Crown className="w-4 h-4 text-amber-500" /> Premium quality</span>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scrollTo("left")}
              className="absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-all z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollTo("right")}
              className="absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-all z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Cards Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide px-4 -mx-4 items-stretch"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayPackages.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} index={index} />
            ))}
          </div>
        </div>

        {/* Income Opportunities Section */}
        <IncomeSection />

        {/* Package Comparison Table */}
        <PackageComparisonTable />
      </div>
    </section>
  );
};

const PlanCard = ({ plan, index }: { plan: Package; index: number }) => {
  const isPopular = plan.level === 3 || plan.code === 'SUMMIT'; // Hardcode popular for middle tier or add to DB
  const tier = tierConfig[plan.color_theme || 'bronze'];
  const TierIcon = tier.icon;
  const BadgeIcon = tier.badge;
  const features = plan.features || [];

  // Fake MRP for visual effect since we don't store it in DB yet, or imply a 50% discount
  const mrp = Math.round(plan.price * 2);
  const discount = 50;

  return (
    <>
      <div
        className="snap-center flex-shrink-0 w-[calc(100vw-32px)] md:w-[320px] pb-4"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div
          className={`relative rounded-3xl overflow-hidden transition-all duration-300 h-full flex flex-col group backdrop-blur-md border-2 hover:shadow-2xl hover:-translate-y-2 ${tier.cardBg} ${tier.borderColor} ${isPopular ? 'ring-2 ring-amber-400 shadow-xl' : 'shadow-lg'}`}
        >
          {/* Best Value Badge */}
          {isPopular && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-amber-500 text-white text-[10px] uppercase font-bold tracking-wider py-1 px-4 rounded-b-lg shadow-sm flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Best Value
              </div>
            </div>
          )}

          {/* Card Content */}
          <div className={`p-6 flex flex-col flex-1 ${isPopular ? 'pt-8' : 'pt-6'}`}>

            {/* Header Section */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  {tier.tagline}
                </p>
                <div className={`w-12 h-12 rounded-2xl ${tier.color} flex items-center justify-center mb-2`}>
                  <TierIcon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <BadgeIcon className="w-3 h-3" />
                {features.length} Features
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-4">{tier.name}</h3>

            {/* Pricing Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-slate-400 line-through decoration-slate-400/50">MRP ₹{mrp}</span>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SAVE {discount}%</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-extrabold bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                  ₹{plan.price}
                </span>
                <span className="text-sm text-slate-500 font-medium">/one-time</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-slate-900/5 mb-6" />

            {/* Features List */}
            <ul className="space-y-3 mb-8 flex-1">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm group/item">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${tier.color.split(' ')[0]} bg-opacity-20`}>
                    <Check className={`w-3 h-3 ${tier.color.split(' ')[1]}`} />
                  </div>
                  <span className="text-slate-700 group-hover/item:text-slate-900 transition-colors leading-tight">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link to={`/package/${plan.code}`} className="block mt-auto">
              <Button
                className={`w-full h-12 text-sm font-bold rounded-xl shadow-lg transition-all duration-300 ${tier.buttonColor}`}
              >
                View Details & Enroll
              </Button>
            </Link>

          </div>
        </div>
      </div>
    </>
  );
};

const IncomeSection = () => {
  return (
    <div className="mt-20">
      <div className="text-center mb-8 animate-fade-in">
        <p className="text-sm font-medium text-amber-500 mb-2">Not sure which plan is right for you? <span className="font-bold cursor-pointer hover:underline">Talk to our team</span></p>
      </div>
    </div>
  );
};

export default PlansSection;