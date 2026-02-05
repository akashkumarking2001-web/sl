import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Wallet,
  BookOpen,
  Users,
  Bell,
  Gift,
  PlayCircle,
  ArrowRight,
  ChevronRight,
  Megaphone,
  Copy,
  ExternalLink,
  Zap,
  Star,
  Crown,
  Gem,
  Trophy,
  Sparkles,
  ShoppingCart,
  ShoppingBag,
  Lock,
  LogOut,
  Menu,
  X,
  Home,
  Settings,
  LayoutDashboard,
  Video,
  FileText,
  MessageSquare,
  TrendingUp,
  Play,
  Smartphone,
  Package,
  Award,
  CheckCircle,
  Clock,
  ArrowUpRight,
  UserPlus,
  Compass,
  ZapOff,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import DailyWelcomePopup from "@/components/DailyWelcomePopup";
import PaymentReminderBar from "@/components/PaymentReminderBar";
import PostLoginActionPopup from "@/components/PostLoginActionPopup";
import AIRecommendations from "@/components/AIRecommendations";
import ProgressDashboard from "@/components/dashboard/ProgressDashboard";
import NativeHeader from "@/components/layout/NativeHeader";
import { usePackages } from "@/hooks/usePackages";
import { useCourses } from "@/hooks/useCourses";
import { ScrollAnimate } from "@/components/ui/ScrollAnimate";
import { supabase } from "@/integrations/supabase/client";
import { Capacitor } from "@capacitor/core";
import { packages as staticPackages } from "@/data/packages";
import { courses as staticCourses } from "@/components/sections/CoursesSection";

// Ads data
const adsData = [
  { id: 1, type: "image", src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop", headline: "🔥 New Course Launch: AI Mastery", link: "https://youtube.com/@skilllearners" },
  { id: 2, type: "image", src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop", headline: "💰 Refer & Earn Up to 30%!", link: "/dashboard/affiliate" },
  { id: 3, type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", headline: "🎬 Watch Our Success Stories", link: "https://youtube.com/@skilllearners" },
];

const announcements = [
  "🎉 New AI Course launching next week! Get early access.",
  "💰 Refer 3 friends this month and get ₹500 bonus!",
  "📚 Live webinar on E-commerce strategies - Register now!",
];

const planIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "IGNITE": Star,
  "VELOCITY": Sparkles,
  "APEX": Crown,
  "ZENITH": Gem,
  "PINNACLE": Trophy,
};

const navItems = [
  { icon: Home, label: "Home", href: "/user-home" },
  { icon: BookOpen, label: "My Courses", href: "/dashboard/courses" },
  { icon: Wallet, label: "Affiliate", href: "/dashboard/affiliate" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
];

const UserHome = () => {
  const [currentAd, setCurrentAd] = useState(0);
  const [adProgress, setAdProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showReminderBar, setShowReminderBar] = useState(true);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut, profile } = useAuth();
  const { data: dbPackages } = usePackages();
  const { data: dbCourses, isLoading: coursesLoading } = useCourses();
  const isNative = Capacitor.isNativePlatform() || ['8080', '5174'].includes(window.location.port);

  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const referralCode = profile?.referral_code || "";
  const purchasedPlan = profile?.purchased_plan || "";
  const hasPurchased = !!purchasedPlan;

  const packagesList = dbPackages || staticPackages;

  // Combine DB courses with static ones
  const allAvailableCourses = [...(dbCourses || [])];
  const staticIds = new Set(allAvailableCourses.map(c => c.id));
  staticCourses.forEach(sc => {
    if (!staticIds.has(sc.id)) allAvailableCourses.push(sc);
  });

  const displayCourses = allAvailableCourses.slice(0, 4);

  // Fetch performance data
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const { data: incomeData } = await (supabase
        .from('agent_income')
        .select('total_income')
        .eq('user_id', user.id)
        .maybeSingle() as any);

      if (incomeData) {
        setTotalEarnings(Number(incomeData.total_income || 0));
      }
    };

    fetchStats();

    // Auto-scroll ads
    const timer = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 100) {
          setCurrentAd((curr) => (curr + 1) % adsData.length);
          return 0;
        }
        return prev + 1;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [user]);

  // Show action popup on first login if not purchased
  useEffect(() => {
    if (!hasPurchased && !isNative) {
      const hasSeenPopup = sessionStorage.getItem('hasSeenPostLoginPopup');
      const hasSelectedPlan = sessionStorage.getItem('selectedPlan');
      const hasSelectedCourse = sessionStorage.getItem('selectedCourse');

      if (!hasSeenPopup || hasSelectedPlan || hasSelectedCourse) {
        setShowPaymentPopup(true);
        sessionStorage.setItem('hasSeenPostLoginPopup', 'true');
      }
    }
  }, [hasPurchased, isNative]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://skilllearners.com/ref/${referralCode}`);
    toast({ title: "Copied!", description: "Referral link copied to clipboard" });
  };

  const handleAdClick = (link: string) => {
    if (link.startsWith("http")) {
      window.open(link, "_blank");
    } else {
      navigate(link);
    }
  };

  if (isNative) {
    const nativeActions = [
      { label: "Profile", icon: User, color: "bg-primary", href: "/dashboard/profile", desc: "My Account" },
      { label: "Affiliate Wallet", icon: Wallet, color: hasPurchased ? "bg-amber-500" : "bg-gray-500", href: hasPurchased ? "/dashboard/wallet" : "#", desc: hasPurchased ? "Earnings" : "Locked", locked: !hasPurchased },
      { label: "My Courses", icon: BookOpen, color: "bg-blue-600", href: "/dashboard/courses", desc: "Start Learning" },
      { label: "Available Courses", icon: ShoppingCart, color: "bg-emerald-600", href: "/courses", desc: "Explore Skills" },
      { label: "Combo Package", icon: Package, color: "bg-orange-500", href: "/plans", desc: "Premium plans" },
      { label: "Online Shopping", icon: ShoppingBag, color: "bg-indigo-600", href: "/shopping", desc: "Store" },
    ];

    return (
      <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30">
        <NativeHeader title="Home" />

        <main className="flex-1 overflow-y-auto pb-24">
          {/* Welcome Message */}
          <section className="px-6 pt-8 pb-4">
            <h2 className="text-xl font-bold text-muted-foreground tracking-widest text-[10px]">Active Session</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black tracking-tight text-foreground">Hello,</h3>
                <p className="text-4xl font-black text-primary -mt-2">{userName.split(" ")[0]}!</p>
              </div>
              <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center shadow-glow-gold/20 animate-pulse">
                <span className="text-2xl font-black text-primary">{userName.charAt(0)}</span>
              </div>
            </div>
          </section>

          {/* 6 Action Boxes Grid */}
          <section className="px-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              {nativeActions.map((action, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (action.locked) {
                      toast({
                        title: "Access Restricted",
                        description: "Wallet unlocks after purchasing a Combo Package.",
                        variant: "destructive"
                      });
                    } else {
                      navigate(action.href);
                    }
                  }}
                  className="glass-card p-5 rounded-3xl flex flex-col items-center text-center gap-3 active:scale-95 transition-all border border-white/5 relative"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors", action.color)}>
                    {action.locked ? <Lock className="w-7 h-7 text-white/50" /> : <action.icon className="w-7 h-7 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight leading-tight">{action.label}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 font-bold tracking-wider">{action.desc}</p>
                  </div>
                  {action.locked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3 h-3 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Advertisement / Banner Section */}
          <section className="px-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black tracking-[0.2em] text-muted-foreground">Premium Insights</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
              {adsData.map((ad, i) => (
                <div
                  key={i}
                  onClick={() => handleAdClick(ad.link)}
                  className="min-w-[85vw] h-48 rounded-[2rem] relative overflow-hidden group border border-white/5 active:scale-[0.98] transition-all shadow-2xl"
                >
                  <img src={ad.src} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-primary text-black rounded-md">Featured</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </div>
                    <p className="text-xl font-black text-white leading-[1.1] line-clamp-2 uppercase tracking-tight">{ad.headline}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mobile Featured Packages Section */}
          <section className="px-6 mt-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Combo Packages</h3>
              <Link to="/plans" className="text-[10px] font-black text-primary uppercase tracking-widest">View All</Link>
            </div>
            <div className="space-y-4">
              {packagesList.slice(0, 5).map((pkg) => (
                <div key={pkg.id} className="glass-card p-4 rounded-3xl border border-white/5 flex items-center gap-4 bg-white/[0.02]" onClick={() => navigate(`/package/${pkg.id}`)}>
                  <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg",
                    pkg.color_theme === 'diamond' ? 'from-green-500 to-emerald-700' : 'from-primary to-orange-600'
                  )}>
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black truncate tracking-tight">{pkg.name} Academy</h4>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest">{pkg.code}</p>
                    <p className="text-lg font-black text-primary mt-1">₹{pkg.price.toLocaleString()}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground/30" />
                </div>
              ))}
            </div>
          </section>

          {/* Mobile Available Courses Section */}
          <section className="px-6 mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Mastery Courses</h3>
              <Link to="/courses" className="text-[10px] font-black text-primary uppercase tracking-widest">Explore</Link>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {displayCourses.map((course) => (
                <div key={course.id} className="glass-card rounded-[2rem] overflow-hidden border border-white/5 active:scale-[0.98] transition-all" onClick={() => navigate(`/course/${course.id}`)}>
                  <div className="h-44 relative">
                    <img src={course.image} className="w-full h-full object-cover" alt={course.title} />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-white uppercase tracking-widest">
                      {course.modules} Units
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-black tracking-tight leading-none mb-2">{course.title}</h4>
                    <div className="flex items-center justify-between items-end">
                      <div>
                        <div className="flex items-center gap-1 text-primary text-xs font-black">
                          <Star className="w-3 h-3 fill-primary" />
                          <span>{course.rating}</span>
                        </div>
                        <p className="text-xl font-black mt-1">₹{course.price.toLocaleString()}</p>
                      </div>
                      <Button size="sm" className="rounded-xl h-10 px-5 bg-white text-black font-black uppercase text-[10px] tracking-widest shadow-xl">Enroll Now</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="py-16 mt-8 text-center">
            <img src={logo} alt="Logo" className="h-10 mx-auto opacity-20 grayscale mb-8" />
            <p className="text-[8px] text-muted-foreground/30 font-black uppercase tracking-[0.4em]">
              Skill Learners Academy Global &copy; 2024
            </p>
          </footer>
        </main>
      </div>
    );
  }

  // --- RESTORED ORIGINAL WEBSITE LAYOUT ---
  return (
    <div className="min-h-screen bg-background overflow-x-hidden flex flex-col font-sans">
      {/* Payment Reminder Bar */}
      {!hasPurchased && purchasedPlan && showReminderBar && (
        <PaymentReminderBar
          planName={purchasedPlan}
          onClose={() => setShowReminderBar(false)}
        />
      )}

      {/* Post-Login Action Popup */}
      {showPaymentPopup && !hasPurchased && (
        <PostLoginActionPopup
          onClose={() => setShowPaymentPopup(false)}
        />
      )}

      {/* Welcome Popup */}
      {showWelcome && (
        <DailyWelcomePopup userName={userName.split(" ")[0]} onClose={() => setShowWelcome(false)} />
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[55] lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border animate-slide-in-right shadow-elevated">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <img src={logo} alt="Skill Learners" className="h-10 w-auto" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-primary-foreground">{userName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold">{userName}</p>
                  <p className="text-sm text-muted-foreground">{referralCode || "New User"}</p>
                </div>
              </div>
            </div>

            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={`bg-card/80 backdrop-blur-xl border-b border-border sticky z-50 ${!hasPurchased && purchasedPlan && showReminderBar ? 'top-10' : 'top-0'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/"><img src={logo} alt="Skill Learners" className="h-10 lg:h-12 w-auto drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] transition-transform hover:scale-105" /></Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle variant="icon" />
            <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button onClick={handleSignOut} className="p-2 rounded-full hover:bg-muted transition-colors hidden sm:flex" title="Sign Out">
              <LogOut className="w-5 h-5" />
            </button>
            <Link to="/dashboard/profile" className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-lg font-bold text-primary-foreground">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-bold text-sm tracking-tight">{userName}</p>
                <Badge variant="outline" className="text-[10px] h-4 font-mono border-primary/20 text-primary uppercase">{referralCode || "NEWBIE"}</Badge>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-secondary/50 backdrop-blur-sm border-b border-border overflow-hidden">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground rounded-full text-xs font-bold shrink-0 shadow-sm">
              <Zap className="w-3 h-3 inline mr-1" />LIVE
            </span>
            <div className="overflow-hidden flex-1">
              <div className="animate-marquee whitespace-nowrap flex gap-8">
                {[...announcements, ...announcements].map((a, i) => (<span key={i} className="inline-block emoji-text">{a}</span>))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 pb-12 pt-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="hidden lg:block mb-8">
            <div className="glass-card p-8 rounded-[2.5rem] flex items-center justify-between relative overflow-hidden bg-gradient-to-r from-card/60 to-muted/20 border border-white/10 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -ml-32 -mb-32" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 uppercase tracking-wider text-[10px] font-bold">
                    Executive Dashboard
                  </Badge>
                  <span className="text-muted-foreground/40">|</span>
                  <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Secure & Verified
                  </div>
                </div>
                <h2 className="text-5xl font-bold font-display tracking-tight mb-3">
                  Welcome back, <span className="text-gradient-gold">{userName}!</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
                  Your academy career is flourishing. You've earned <span className="text-foreground font-bold italic">₹{totalEarnings.toLocaleString()}</span> so far. Keep pushing!
                </p>
              </div>
              <div className="relative z-10 flex flex-col gap-3">
                <Link to="/plans">
                  <Button variant="hero" className="rounded-2xl px-8 py-7 h-auto text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                    Upgrade to Premium
                    <ArrowUpRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            <div className="lg:col-span-8 space-y-8">
              <div onClick={() => handleAdClick(adsData[currentAd].link)} className="relative glass-card rounded-[2rem] overflow-hidden cursor-pointer group border border-white/5">
                <div className="relative h-48 md:h-64">
                  <img src={adsData[currentAd].src} alt="Ad" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-2xl md:text-3xl font-bold mt-2 emoji-text tracking-tight">{adsData[currentAd].headline}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-100 ease-linear" style={{ width: `${adProgress}%` }} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: User, label: "Profile", href: "/dashboard/profile", color: "from-primary to-gold-dark", desc: "View & edit" },
                  { icon: Package, label: "Combo Package", href: "/plans", color: "from-orange-500 to-red-600", desc: "Premium Packages" },
                  { icon: Wallet, label: "Affiliate Wallet", href: "/dashboard/affiliate", color: "from-accent to-teal-dark", desc: "Your earnings" },
                  { icon: ShoppingBag, label: "Online Shopping", href: "/shopping", color: "from-blue-500 to-indigo-600", desc: "Knowledge Store" },
                  { icon: ShoppingCart, label: "Available Courses", href: "/courses", color: "from-emerald to-emerald-light", desc: "New Skills" },
                  { icon: BookOpen, label: "My Courses", href: "/dashboard/courses", color: "from-purple-500 to-purple-600", desc: "My Learning" }
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.href}
                    className="glass-card p-6 rounded-3xl group transition-all duration-500 relative border border-white/5 hover:-translate-y-2 hover:border-primary/20"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{action.label}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">{action.desc}</p>
                  </Link>
                ))}
              </div>

              <div className="space-y-12">
                {/* Quick Preview: Top 2 Packages */}
                <section className="space-y-6 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="w-6 h-6 text-orange-500" />
                        Featured Packages
                      </h2>
                      <p className="text-sm text-muted-foreground">Premium bundles with maximum value and affiliate benefits.</p>
                    </div>
                    <Link to="/plans">
                      <Button variant="ghost" className="text-primary hover:text-primary/80">
                        View All <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packagesList?.slice(0, 2).map((pkg) => (
                      <div key={pkg.id} className="glass-card rounded-3xl overflow-hidden group hover:border-primary/30 transition-all border border-white/5 bg-gradient-to-br from-card to-muted/30">
                        <div className="p-1 h-32 relative overflow-hidden">
                          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", pkg.color_theme === 'diamond' ? 'from-green-500 to-emerald-900' : 'from-primary to-orange-600')} />
                          <div className="relative z-10 p-6 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                              <Crown className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{pkg.name} Academy</h3>
                              <Badge variant="secondary" className="bg-white/10 text-white border-white/10 text-[10px] uppercase font-bold">{pkg.code}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 pt-2">
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{pkg.headline || "Complete digital transformation blueprint."}</p>
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Enrollment Fee</p>
                              <p className="text-2xl font-bold text-gradient-gold">₹{pkg.price.toLocaleString()}</p>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-white" onClick={() => navigate(`/package/${pkg.id}`)}>
                              View Details
                            </Button>
                          </div>
                          <Button className="w-full rounded-2xl bg-primary text-black font-bold h-12 shadow-lg shadow-primary/20" onClick={() => navigate("/payment")}>
                            Upgrade Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Quick Preview: Top 4 Courses */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6 text-emerald" />
                        Featured Courses
                      </h2>
                      <p className="text-sm text-muted-foreground">Master specific skills with our expert-led modules.</p>
                    </div>
                    <Link to="/courses">
                      <Button variant="ghost" className="text-primary hover:text-primary/80">
                        View All <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayCourses.map((course) => (
                      <div
                        key={course.id}
                        className="glass-card rounded-3xl overflow-hidden group hover:border-primary/30 transition-all border border-white/5 cursor-pointer"
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        <div className="relative h-40 overflow-hidden">
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">
                            {course.modules} Modules
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-lg mb-1 truncate">{course.title}</h3>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                              <span className="text-xs font-bold">{course.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground text-xs">
                              <Users className="w-3.5 h-3.5" />
                              <span>{course.students.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">₹{course.price.toLocaleString()}</span>
                            <Button size="sm" variant="hero" className="rounded-xl px-4 text-xs font-bold">Buy Now</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <ProgressDashboard hasPurchased={hasPurchased} purchasedPlan={purchasedPlan} />
                <AIRecommendations userName={userName} purchasedPlan={purchasedPlan} />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="glass-card p-8 rounded-[2.5rem] border-2 border-dashed border-primary/20 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Users className="w-24 h-24" /></div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Gift className="w-6 h-6 text-primary" />
                  Refer & Earn
                </h3>
                <p className="text-sm text-muted-foreground mb-6">Earn up to <span className="text-primary font-bold">30% commission</span> for every student you invite.</p>
                {hasPurchased ? (
                  <div className="space-y-4">
                    <div className="bg-card/50 p-4 rounded-2xl border border-border flex items-center justify-between">
                      <span className="font-mono font-bold text-primary truncate mr-4">{referralCode}</span>
                      <Button variant="ghost" size="sm" onClick={copyReferralLink}><Copy className="w-4 h-4" /></Button>
                    </div>
                    <Button variant="hero" className="w-full rounded-2xl py-6" onClick={copyReferralLink}>Copy Link</Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full rounded-xl" onClick={() => navigate("/dashboard/courses")}>Activate Account</Button>
                )}
              </div>

              {/* The sidebar packages are now moved to the main content area */}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-muted-foreground/30 text-[10px] uppercase font-bold tracking-widest mt-auto">
        Skill Learners Academy &copy; 2024 • Excellence Platform
      </footer>

      {/* Onboarding Tour for Native App experience if needed */}
    </div>
  );
};

export default UserHome;
