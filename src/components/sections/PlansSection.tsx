import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Shield, TrendingUp, Crown, Star, Gem, Bookmark, Zap, Rocket, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packages as staticPackages } from "@/data/packages";
import { usePackages, Package } from "@/hooks/usePackages";
import { cn } from "@/lib/utils";

const PlansSection = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Use usePackages but don't rely on it for immediate render
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
  }, [packages]);

  const scrollTo = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const cardWidth = window.innerWidth < 768 ? window.innerWidth - 48 : 340;
    const gap = 24;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : (cardWidth + gap),
      behavior: "smooth",
    });
  };

  // Prepare display packages (prioritize static for instant load, verify against DB)
  // We map static packages to the schema used by the component
  const displayPackages: Package[] = (packages && packages.length > 0)
    ? packages
    : staticPackages.map(p => ({
      id: String(p.id),
      code: p.name,
      name: p.name,
      price: p.price,
      headline: p.tagline,
      description: p.description,
      features: p.features,
      bonus: p.bonus,
      level: typeof p.level === 'string' ? 0 : 0,
      color_theme: p.theme
    }));

  return (
    <section id="plans" className="py-20 lg:py-24 relative overflow-hidden bg-slate-950">
      <div className="container relative mx-auto px-4 z-10">

        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="text-slate-900 dark:text-white">Premium </span>
            <span className="text-amber-400">Learning Packages</span>
          </h2>

          <p className="text-lg text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed mb-8">
            Invest in yourself with our expertly crafted packages. Each tier unlocks more <br className="hidden md:block" /> value and income opportunities.
          </p>

          <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-80">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Proven results</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Premium quality</span>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative group/carousel">
          {/* Mobile Nav */}
          <div className="absolute -top-12 right-4 flex gap-3 lg:hidden">
            <button
              onClick={() => scrollTo("left")}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${canScrollLeft ? 'bg-background border-border shadow-md' : 'opacity-50'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollTo("right")}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${canScrollRight ? 'bg-background border-border shadow-md' : 'opacity-50'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Nav */}
          {canScrollLeft && (
            <button
              onClick={() => scrollTo("left")}
              className="absolute -left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white dark:bg-slate-900 shadow-xl border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all z-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollTo("right")}
              className="absolute -right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white dark:bg-slate-900 shadow-xl border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all z-30"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Cards */}
          <div
            ref={carouselRef}
            className="flex gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory pb-12 scrollbar-hide px-2 -mx-2 items-stretch"
          >
            {displayPackages.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} index={index} allPackages={displayPackages} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const tierConfig: Record<string, {
  levelName: string;
  courseCount: string;
  name: string;
  icon: React.ElementType;
  cardBg: string; // Tailored gradient for each tier
  borderColor: string;
  textColor: string;
  badgeColor: string;
  buttonColor: string;
  buttonShadow: string;
  checkColor: string;
  iconBg: string;
  accentColor: string;
  accent: string;
  glowColor: string;
  iconGlow: string;
}> = {
  bronze: {
    levelName: "BEGINNER",
    courseCount: "5 Courses",
    name: "Basic",
    icon: Zap,
    cardBg: "bg-gradient-to-b from-slate-900 to-slate-950",
    borderColor: "border-blue-500/20 hover:border-blue-500/50",
    textColor: "text-blue-400",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    buttonColor: "bg-blue-600 hover:bg-blue-500 text-white",
    buttonShadow: "shadow-lg shadow-blue-900/20",
    checkColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    iconBg: "bg-blue-500/10",
    accentColor: "text-blue-400",
    accent: "bg-blue-600",
    glowColor: "hover:shadow-blue-500/10",
    iconGlow: "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
  },
  silver: {
    levelName: "INTERMEDIATE",
    courseCount: "15 Courses",
    name: "Starter",
    icon: Sparkles,
    cardBg: "bg-gradient-to-b from-slate-900 to-slate-950",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/50",
    textColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    buttonColor: "bg-emerald-600 hover:bg-emerald-500 text-white",
    buttonShadow: "shadow-lg shadow-emerald-900/20",
    checkColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    accentColor: "text-emerald-400",
    accent: "bg-emerald-600",
    glowColor: "hover:shadow-emerald-500/10",
    iconGlow: "drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
  },
  gold: {
    levelName: "ADVANCED",
    courseCount: "35 Courses",
    name: "Professional",
    icon: Star,
    cardBg: "bg-gradient-to-b from-slate-900 to-slate-950",
    borderColor: "border-amber-500/20 hover:border-amber-500/50",
    textColor: "text-amber-400",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    buttonColor: "bg-amber-500 hover:bg-amber-400 text-black font-bold",
    buttonShadow: "shadow-lg shadow-amber-900/20",
    checkColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    iconBg: "bg-amber-500/10",
    accentColor: "text-amber-400",
    accent: "bg-amber-500",
    glowColor: "hover:shadow-amber-500/10",
    iconGlow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
  },
  platinum: {
    levelName: "EXPERT",
    courseCount: "60 Courses",
    name: "Premium",
    icon: Gem,
    cardBg: "bg-gradient-to-b from-slate-900 to-slate-950",
    borderColor: "border-violet-500/20 hover:border-violet-500/50",
    textColor: "text-violet-400",
    badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    buttonColor: "bg-violet-600 hover:bg-violet-500 text-white",
    buttonShadow: "shadow-lg shadow-violet-900/20",
    checkColor: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    iconBg: "bg-violet-500/10",
    accentColor: "text-violet-400",
    accent: "bg-violet-600",
    glowColor: "hover:shadow-violet-500/10",
    iconGlow: "drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]"
  },
  diamond: {
    levelName: "MASTER",
    courseCount: "100 Courses",
    name: "Enterprise",
    icon: Crown,
    cardBg: "bg-gradient-to-b from-slate-900 to-slate-950",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/50",
    textColor: "text-emerald-400",
    badgeColor: "bg-emerald-600/10 text-emerald-400 border-emerald-600/20",
    buttonColor: "bg-emerald-600 hover:bg-emerald-500 text-white",
    buttonShadow: "shadow-lg shadow-emerald-900/20",
    checkColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    accentColor: "text-emerald-400",
    accent: "bg-emerald-800",
    glowColor: "hover:shadow-emerald-500/10",
    iconGlow: "drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
  }
};

const PlanCard = ({ plan, index, allPackages }: { plan: Package; index: number; allPackages: Package[] }) => {
  const isPopular = plan.code === 'GOLD' || plan.name === 'Professional';
  const tier = tierConfig[plan.color_theme || 'bronze'];
  const TierIcon = tier.icon;
  const features = plan.features || [];

  // Pricing calcs
  const mrp = Math.round(plan.price * 2);
  const discount = 50;

  // Bonus Logic
  const previousPackages = allPackages.slice(0, index);
  const bonusValue = previousPackages.reduce((acc, p) => acc + p.price, 0);

  let bonusText = "";
  if (index === 1) bonusText = "Basic Package FREE";
  else if (index === 2) bonusText = "2 Previous Packs FREE";
  else if (index === 3) bonusText = "3 Previous Packs FREE";
  else if (index === 4) bonusText = "All Previous Packs FREE";

  return (
    <div
      className="snap-center flex-shrink-0 w-[85vw] md:w-[350px] flex flex-col pt-4"
    >
      <div className={cn(
        "relative h-full flex flex-col rounded-3xl border-2 transition-all duration-300 overflow-hidden group hover:-translate-y-2",
        tier.cardBg,
        tier.borderColor,
        tier.glowColor
      )}>

        {/* Popular Tag */}
        {isPopular && (
          <div className="absolute top-0 right-0 z-20">
            <div className="bg-[#FBBF24] text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-black" /> BEST VALUE
            </div>
          </div>
        )}

        <div className="p-6 flex-grow flex flex-col">

          {/* Header Compact */}
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] block", tier.textColor)}>{tier.levelName}</span>
              <h3 className="text-2xl font-black text-white leading-none">
                {plan.name}
              </h3>
            </div>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border border-white/5", tier.iconBg)}>
              <TierIcon className={cn("w-6 h-6", tier.textColor)} />
            </div>
          </div>

          {/* Pricing Compact */}
          <div className="mb-6 bg-black/20 rounded-2xl p-4 border border-white/5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-400 line-through">MRP ₹{mrp.toLocaleString()}</span>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border", tier.badgeColor)}>
                SAVE {discount}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-white tracking-tight">
                ₹{plan.price.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-500">/one-time</span>
            </div>
            {index > 0 && (
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
                <Sparkles className={cn("w-3 h-3", tier.textColor)} />
                <span className="text-xs text-slate-300 font-medium">Includes <span className="text-white font-bold">{bonusText}</span></span>
              </div>
            )}
          </div>

          {/* Features List */}
          <ul className="space-y-3 mb-8 flex-grow">
            {features.slice(0, 6).map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={cn("mt-0.5 min-w-[16px] h-4 rounded-full flex items-center justify-center border", tier.checkColor)}>
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className="text-sm font-medium text-slate-300 leading-snug">
                  {feature}
                </span>
              </li>
            ))}
            {features.length > 6 && (
              <li className="text-xs font-bold text-slate-500 pl-7">+ {features.length - 6} more benefits</li>
            )}
          </ul>

          {/* Button */}
          <Link to={`/package/${plan.code}`} className="mt-auto">
            <Button className={cn(
              "w-full h-12 rounded-xl font-bold text-base shadow-lg transition-transform active:scale-[0.98]",
              tier.buttonColor,
              tier.buttonShadow
            )}>
              Get Started <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default PlansSection;