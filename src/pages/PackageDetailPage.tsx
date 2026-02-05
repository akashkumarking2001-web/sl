import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    CheckCircle2, ArrowRight, ShieldCheck, Crown, Sparkles, TrendingUp,
    Zap, BookOpen, ArrowLeft, Star,
    Rocket, Gem, Map, GraduationCap, X, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePackages } from "@/hooks/usePackages";
import { packages as staticPackages, incomeTypes } from "@/data/packages";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Capacitor } from "@capacitor/core";
import NativeHeader from "@/components/layout/NativeHeader";

// Advanced Classy Design Config - Updated to match PlansSection VIBRANT colors
const tierConfig: Record<string, {
    name: string;
    mentorTitle: string;
    icon: any;
    gradient: string;      // Text/Icon gradients
    description: string;
    color: string;         // Main card background
    accentBorder: string;  // Border color
    themeHex: string;      // For dynamic shadows/glows
    borderGradient: string;// For gradient borders (unused now but kept for types)
    glassBg: string;       // Secondary backgrounds
}> = {
    bronze: {
        name: "Beginner",
        mentorTitle: "The Creator’s Asset Vault",
        icon: Zap,
        gradient: "from-blue-600 to-blue-400",
        color: "bg-slate-900",
        accentBorder: "border-blue-500/20",
        themeHex: "#3b82f6",
        borderGradient: "from-blue-400 to-blue-600",
        glassBg: "bg-blue-500/10",
        description: "The Creator’s Asset Vault. Perfect for beginners who want to master foundational digital skills with a massive library of assets."
    },
    silver: {
        name: "Intermediate",
        mentorTitle: "Social Media & Content Mastery",
        icon: Sparkles,
        gradient: "from-emerald-500 to-teal-400",
        color: "bg-teal-950",
        accentBorder: "border-emerald-500/20",
        themeHex: "#10b981",
        borderGradient: "from-emerald-400 to-emerald-600",
        glassBg: "bg-emerald-500/10",
        description: "Social Media & Content Mastery. Growth-focused strategies for traffic, views, and social dominance across all platforms."
    },
    gold: {
        name: "Advanced",
        mentorTitle: "E-Commerce & Affiliate Tycoon",
        icon: Star,
        gradient: "from-amber-500 to-orange-500",
        color: "bg-zinc-950",
        accentBorder: "border-amber-500/20",
        themeHex: "#fbbf24",
        borderGradient: "from-amber-400 to-amber-600",
        glassBg: "bg-amber-500/10",
        description: "E-Commerce & Affiliate Tycoon. Master high-ticket sales, psychology, and automated funnels for consistent, automated revenue."
    },
    platinum: {
        name: "Expert",
        mentorTitle: "AI-Powered Digital Marketing Agency",
        icon: Gem,
        gradient: "from-violet-600 to-purple-500",
        color: "bg-indigo-950",
        accentBorder: "border-violet-500/20",
        themeHex: "#8b5cf6",
        borderGradient: "from-violet-400 to-violet-600",
        glassBg: "bg-violet-500/10",
        description: "AI-Powered Digital Marketing Agency. Elite strategies for SEO, performance marketing, and scaling a high-ROAS digital agency."
    },
    diamond: {
        name: "Master",
        mentorTitle: "Wealth Creation & Trading Mastery",
        icon: Crown,
        gradient: "from-emerald-800 to-green-600",
        color: "bg-emerald-950",
        accentBorder: "border-emerald-500/20",
        themeHex: "#059669",
        borderGradient: "from-emerald-700 to-green-900",
        glassBg: "bg-emerald-500/10",
        description: "Wealth Creation & Trading Mastery. Elite financial strategies, forex market structure, and generating generational wealth through smart investing."
    },
};

const PackageDetailPage = () => {
    const { packageId } = useParams<{ packageId: string }>();
    const navigate = useNavigate();
    const { data: packages, isLoading } = usePackages();
    const [isExpanded, setIsExpanded] = useState(false);
    const isNative = Capacitor.isNativePlatform() || ['8080', '5174'].includes(window.location.port);

    const pkg = useMemo(() => {
        const searchId = packageId?.toLowerCase();
        if (!searchId) return null;

        const findPackage = (list: any[]) => list.find(p =>
            String(p.code || p.name).toLowerCase() === searchId ||
            String(p.name).toLowerCase() === searchId ||
            String(p.displayName).toLowerCase() === searchId
        );

        if (packages && packages.length > 0) {
            const dbPkg = findPackage(packages);
            if (dbPkg) return dbPkg;
        }

        const staticPkg = findPackage(staticPackages);
        if (staticPkg) {
            return {
                ...staticPkg,
                code: staticPkg.name,
                headline: staticPkg.tagline || "",
                color_theme: staticPkg.theme || "bronze"
            };
        }

        return null;
    }, [packages, packageId]);

    const tier = useMemo(() => {
        if (!pkg) return tierConfig.bronze;
        return tierConfig[pkg.color_theme || 'bronze'] || tierConfig.bronze;
    }, [pkg]);

    useEffect(() => {
        if (pkg) {
            document.title = `${pkg.displayName || pkg.name} - Skill Learners Academy`;
            window.scrollTo(0, 0);
        }
    }, [pkg]);

    if (isLoading && !pkg) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary selection:text-white overflow-x-hidden">
                <Navbar />
                <section className="pt-28 pb-16 relative overflow-hidden">
                    <div className="container relative mx-auto px-4 z-10">
                        <div className="flex justify-between items-center mb-8">
                            <Skeleton className="h-6 w-32 rounded-full" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <Skeleton className="h-8 w-40 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-16 w-3/4" />
                                        <Skeleton className="h-16 w-1/2" />
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <Skeleton className="h-4 w-full max-w-lg" />
                                        <Skeleton className="h-4 w-5/6 max-w-lg" />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <Skeleton className="h-14 w-48 rounded-xl" />
                                </div>
                            </div>

                            <div className="relative max-w-md mx-auto lg:mr-0 w-full">
                                <Skeleton className="h-[500px] w-full rounded-[2rem]" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-4xl font-black mb-4">Package Not Found</h1>
                <p className="text-muted-foreground mb-8">The package you are looking for does not exist.</p>
                <Button size="lg" onClick={() => navigate("/")} className="rounded-2xl font-black px-10">Return Home</Button>
            </div>
        );
    }

    const mrp = pkg.mrp || Math.round(pkg.price * 2);
    const TierIcon = tier.icon;
    const modules = pkg.modules || [];

    if (isNative) {
        return (
            <div className="h-[100dvh] w-full bg-black text-white flex flex-col font-sans overflow-hidden">
                <NativeHeader title="Package Details" />

                <main className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
                    {/* Hero Mesh Section */}
                    <div className="relative pt-12 pb-8 px-6 overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20" style={{ backgroundColor: tier.themeHex }} />
                            <div className="absolute bottom-0 left-0 w-48 h-48 blur-[80px] opacity-10 bg-primary" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-[2rem] glass-card flex items-center justify-center mb-6 animate-in zoom-in-50 duration-700">
                                <TierIcon className="w-10 h-10" style={{ color: tier.themeHex }} />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight mb-3">
                                <span className="text-gray-500 block text-xs uppercase tracking-[0.3em] font-black mb-1">Academy Tier</span>
                                {pkg.displayName || pkg.name}
                            </h1>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs mb-8">
                                {tier.description.split('.')[0]}. Elite curriculum for digital pros.
                            </p>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="text-center">
                                    <p className="text-2xl font-black">₹{pkg.price.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-500 font-bold line-through uppercase">MRP ₹{mrp.toLocaleString()}</p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">90% Distrib.</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Affiliate Model</p>
                                </div>
                            </div>

                            {!isExpanded ? (
                                <Button
                                    onClick={() => setIsExpanded(true)}
                                    className="h-12 px-8 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-white"
                                >
                                    Read More & Curriculum
                                </Button>
                            ) : (
                                <Link to={`/payment?plan=${pkg.name}`} className="w-full max-w-xs">
                                    <Button className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-xs shadow-glow-gold/20 active:scale-95 transition-all">
                                        Enroll Now <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="px-6 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="h-px w-full bg-white/5 mb-10" />

                            <h3 className="text-lg font-black tracking-tight italic mb-6">Course Modules</h3>
                            <div className="space-y-4">
                                {modules.map((mod: any, i: number) => (
                                    <div key={i} className="p-5 rounded-[2rem] glass-card relative overflow-hidden group">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-black text-primary border border-white/5">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-black mb-1">{mod.title.replace(/^Module \d+: /, '')}</h4>
                                                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">{mod.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-center">
                                <Award className="w-10 h-10 text-primary mx-auto mb-4" />
                                <h4 className="text-lg font-black mb-2">Ready to Ascend?</h4>
                                <p className="text-xs text-gray-400 mb-8 max-w-[240px] mx-auto font-medium">Join 50k+ students and start building your financial empire today.</p>
                                <Link to={`/payment?plan=${pkg.name}`}>
                                    <Button className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-xs">
                                        Finalize Enrollment
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground font-sans selection:bg-primary selection:text-white overflow-x-hidden">
            <Navbar />

            {/* HERO SECTION - Futuristic Glassmorphism with Entrance Animations */}
            <section className="pt-28 pb-16 relative overflow-hidden">
                {/* Background Blobs for Glass Effect */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[120px] opacity-40 animate-pulse" />
                    <div
                        className="absolute bottom-[0%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-20 animate-pulse delay-1000"
                        style={{ backgroundColor: tier.themeHex }}
                    />
                </div>

                <div className="container relative mx-auto px-4 z-10">
                    <div className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all font-bold uppercase text-[10px] tracking-widest group px-4 py-2 hover:bg-white/5 rounded-full"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Academy
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    <span className={cn("w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]")} style={{ backgroundColor: tier.themeHex, color: tier.themeHex }} />
                                    Official Curriculum
                                </div>

                                <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                                    <span className="text-slate-900 dark:text-white block mb-1">Academy</span>
                                    <span
                                        className="bg-clip-text text-transparent italic tracking-tighter decoration-clone"
                                        style={{ backgroundImage: `linear-gradient(135deg, ${tier.themeHex}, #cbd5e1)` }}
                                    >
                                        {pkg.displayName || pkg.name}
                                    </span>
                                </h1>

                                <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl">
                                    {tier.description} Join <strong className="text-slate-900 dark:text-white">50,000+</strong> students mastering digital wealth.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <Button
                                    onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="h-14 px-8 rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-2xl font-bold text-base"
                                    style={{
                                        backgroundColor: tier.themeHex,
                                        color: '#ffffff'
                                    }}
                                >
                                    Start Learning Now <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        {/* Hero Card - Refined Glass Pricing */}
                        <div className="relative group perspective-1000 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 max-w-md mx-auto lg:mr-0">
                            {/* Glow behind */}
                            <div
                                className="absolute inset-0 rounded-[2rem] blur-[50px] opacity-20 transition-opacity group-hover:opacity-40"
                                style={{ backgroundColor: tier.themeHex }}
                            />

                            {/* The Card */}
                            <div className={cn("relative rounded-[2.5rem] border-2 shadow-2xl overflow-hidden transition-all hover:-translate-y-2", tier.color, tier.accentBorder)}>
                                <div className="p-8 md:p-10 relative overflow-hidden">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-10">
                                        <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg", tier.glassBg)}>
                                            <TierIcon className="w-10 h-10" style={{ color: tier.themeHex }} />
                                        </div>
                                        {pkg.popular && (
                                            <div className="px-4 py-2 rounded-xl bg-amber-500 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-xl flex items-center gap-2">
                                                <Star className="w-3 h-3 fill-current" /> Best Value
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div className="mb-10">
                                        <h2 className="text-3xl font-black text-white mb-2">{tier.name}</h2>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{pkg.headline}</p>
                                    </div>

                                    {/* Price & Savings */}
                                    <div className="space-y-6 mb-10">
                                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Market Value</span>
                                            <span className="text-xl font-bold text-slate-500 line-through">₹{mrp.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block mb-1">Academy Price</span>
                                                <span className="text-5xl font-black text-white tracking-tighter">₹{pkg.price.toLocaleString()}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                                    Save ₹{(mrp - pkg.price).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bundles/Bonus - CLEAR HIGHLIGHTING */}
                                    {pkg.bonus && (
                                        <div className="mb-10 p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-4">
                                            <div className="mt-1">
                                                <Sparkles className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Premium Bonus Includes:</p>
                                                <p className="text-sm font-bold text-white leading-snug">{pkg.bonus}</p>
                                                <p className="text-[10px] text-emerald-400 font-bold mt-2 uppercase tracking-tight">Worth ₹{(pkg.price - 699).toLocaleString()}+ — FREE</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Trust Badges */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Pay
                                        </div>
                                        <div className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                            <Award className="w-4 h-4 text-amber-500" /> Certified
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MODULES SECTION - Professional Grid */}
            <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-black/20">
                <div className="container relative mx-auto px-4 z-10">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4 block">Curriculum</span>
                        <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                            What You Will <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${tier.themeHex}, #cbd5e1)` }}>Master</span>
                        </h2>
                        <p className="text-slate-500 text-lg">Step-by-step training designed by experts to take you from beginner to pro.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {modules.map((module: any, i: number) => (
                            <div
                                key={i}
                                className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Faint Watermark Number */}
                                <span className="absolute right-6 top-4 text-6xl font-black text-slate-50 dark:text-slate-800 pointer-events-none select-none opacity-50">
                                    {i + 1}
                                </span>

                                <div className="relative z-10">
                                    <div className="mb-6 inline-flex p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700">
                                        <BookOpen className="w-6 h-6" style={{ color: tier.themeHex }} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 pr-12">
                                        {module.title.replace(/^Module \d+: /, '')}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        {module.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EARNINGS & COMPARISON */}
            <section className="py-24 bg-white dark:bg-slate-950 relative border-t border-slate-100 dark:border-slate-900">
                <div className="container relative mx-auto px-4 z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">

                        {/* Income Potential */}
                        <div>
                            <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Income Potential</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {incomeTypes.slice(0, 4).map((income, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl flex flex-col items-center text-center hover:border-slate-300 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-3">
                                            <income.icon className="w-5 h-5" style={{ color: tier.themeHex }} />
                                        </div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">{income.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comparison Table - Clean Look */}
                        <div>
                            <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Why Choose Us</h3>
                            <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg">
                                {[
                                    { feature: "Access Duration", competitor: "1 Year", us: "Lifetime Access" },
                                    { feature: "Support", competitor: "Email Only", us: "24/7 Mentorship" },
                                    { feature: "Updates", competitor: "Paid Upgrades", us: "Free Forever" },
                                    { feature: "Earning Model", competitor: "Low Comm.", us: "90% Distribution" }
                                ].map((item, i) => (
                                    <div key={i} className="grid grid-cols-3 p-5 items-center text-sm border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                        <span className="font-semibold text-slate-600 dark:text-slate-300">{item.feature}</span>
                                        <span className="text-slate-400 text-center line-through text-xs">{item.competitor}</span>
                                        <span className={`text-right font-bold ${item.us.includes("90%") || item.us.includes("Lifetime") ? "text-emerald-500 drop-shadow-sm" : "text-slate-900 dark:text-white"}`}>
                                            {item.us}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* REGISTRATION CTA - Compact & Balanced */}
            <section id="enroll" className="py-20 relative overflow-hidden">
                <div className="container relative mx-auto px-4 max-w-4xl z-10">
                    <div className="bg-slate-900 rounded-[3rem] p-10 lg:p-16 text-center border-2 border-white/10 shadow-3xl relative overflow-hidden group">

                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />

                        <div className="relative z-10 space-y-8">
                            <div>
                                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                                    Join the <span style={{ color: tier.themeHex }}>Elite</span> Today.
                                </h2>
                                <p className="text-lg text-slate-400 font-bold max-w-xl mx-auto leading-relaxed">
                                    Secure your spot in the <span className="text-white underline decoration-primary/50 underline-offset-4">{tier.name} Academy</span> and start your ascend.
                                </p>
                            </div>

                            <div className="max-w-md mx-auto space-y-6">
                                <Link to={`/payment?plan=${pkg.name}`}>
                                    <Button
                                        className="w-full h-20 rounded-2xl text-xl font-black shadow-2xl transition-all hover:scale-[1.02] hover:shadow-primary/20"
                                        style={{ backgroundColor: tier.themeHex, color: tier.themeHex === '#fbbf24' ? 'black' : 'white' }}
                                    >
                                        Enroll Now <ArrowRight className="w-6 h-6 ml-3" />
                                    </Button>
                                </Link>
                                <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span className="flex items-center gap-2"><Crown className="w-4 h-4 text-amber-500" /> Exclusive Access</span>
                                    <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" /> Instant Setup</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PackageDetailPage;
