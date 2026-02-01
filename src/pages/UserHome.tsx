import { useState, useEffect, useMemo } from "react";
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
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import DailyWelcomePopup from "@/components/DailyWelcomePopup";
import PaymentReminderBar from "@/components/PaymentReminderBar";
import PostLoginActionPopup from "@/components/PostLoginActionPopup";
import AIRecommendations from "@/components/AIRecommendations";
import ProgressDashboard from "@/components/dashboard/ProgressDashboard";
import { usePackages } from "@/hooks/usePackages"; // Import hook
import { ScrollAnimate } from "@/components/ui/ScrollAnimate";
import { supabase } from "@/integrations/supabase/client";

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
  "SPARK": Star,
  "MOMENTUM": Sparkles,
  "SUMMIT": Crown,
  "TITAN": Gem,
  "LEGACY": Trophy,
};

const navItems = [
  { icon: Home, label: "Home", href: "/user-home" },
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
  const { user, profile, signOut } = useAuth();

  // Fetch dynamic packages
  const { data: packages } = usePackages();

  // User data from auth
  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const hasPurchased = profile?.has_purchased || false;
  const referralCode = profile?.referral_code || "";
  const purchasedPlan = profile?.purchased_plan || "";

  const quickActions = [
    { icon: User, label: "Profile", href: "/dashboard/profile", color: "from-primary to-gold-dark", desc: "View & edit", locked: false },
    { icon: Wallet, label: "Affiliate Wallet", href: "/dashboard/affiliate", color: "from-accent to-teal-dark", desc: "Your earnings", locked: !hasPurchased },
    { icon: ShoppingBag, label: "Online Shopping", href: "/dashboard/shopping", color: "from-pink-500 to-rose-600", desc: "Premium Store", locked: false },
    { icon: ShoppingCart, label: "Available Courses", href: "/dashboard/courses", color: "from-emerald to-emerald-light", desc: "Explore masterclasses", locked: false },
  ];

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("agent_income")
          .select("total_income")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
          console.error("Error fetching earnings:", error);
          return;
        }
        if (data) setTotalEarnings(data.total_income || 0);
      } catch (err: any) {
        if (err.name !== 'AbortError' && !err.message?.includes('aborted')) {
          console.error("Earnings fetch exception:", err);
        }
      }
    };
    fetchEarnings();
  }, [user]);

  // Show action popup on first login if not purchased
  useEffect(() => {
    if (!hasPurchased) {
      const hasSeenPopup = sessionStorage.getItem('hasSeenPostLoginPopup');
      const hasSelectedPlan = sessionStorage.getItem('selectedPlan');
      const hasSelectedCourse = sessionStorage.getItem('selectedCourse');

      if (!hasSeenPopup || hasSelectedPlan || hasSelectedCourse) {
        setShowPaymentPopup(true);
        sessionStorage.setItem('hasSeenPostLoginPopup', 'true');
      }
    }
  }, [hasPurchased]);

  useEffect(() => {
    const currentAdData = adsData[currentAd];
    const adDuration = currentAdData.type === "video" ? 10000 : 5000;
    const progressInterval = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 100) {
          setCurrentAd((curr) => (curr + 1) % adsData.length);
          return 0;
        }
        return prev + 2;
      });
    }, adDuration / 50);
    return () => clearInterval(progressInterval);
  }, [currentAd]);

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Create a unified list: 5 Premium Packages first, then others
  const allAvailableCourses = useMemo(() => {
    const comboPacks = ["SPARK", "MOMENTUM", "SUMMIT", "TITAN", "LEGACY"];

    // Safety check for packages
    const safePackages = packages || [];

    // Sort packages first
    const sorted = [...safePackages].sort((a, b) => {
      const aIdx = comboPacks.indexOf(a.code || a.name); // Check code first
      const bIdx = comboPacks.indexOf(b.code || b.name);
      if (aIdx !== -1 && bIdx === -1) return -1;
      if (aIdx === -1 && bIdx !== -1) return 1;
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      return 0;
    });

    // Add some sample standard courses if they exist or mock them
    const standardCourses = [
      { name: "Web Development", price: 499, color: "from-blue-500 to-indigo-600", isStandard: true },
      { name: "UI/UX Design", price: 399, color: "from-pink-500 to-rose-600", isStandard: true }
    ];

    return [...sorted, ...standardCourses];
  }, [packages]);

  const nextPlan = purchasedPlan === "LEGACY" ? "ELITE" : "UPGRADE";

  return (
    <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
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
            {/* Mobile menu button */}
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
                <Badge variant="outline" className="text-[10px] h-4 font-mono border-primary/20 text-primary uppercase">{purchasedPlan || "Trial Student"}</Badge>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Header section spacing */}
      <div className="h-4" />

      <main className="flex-1 pb-12 pt-6">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Welcome Section - Responsive Premium */}
          <div className="mb-6">
            <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden bg-gradient-to-r from-card/60 to-muted/20 border border-border/30 shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />

              <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 uppercase tracking-widest text-[9px] font-black">
                    Executive Portal
                  </Badge>
                  <div className="hidden sm:flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold">
                    <CheckCircle className="w-3 h-3" /> Secure
                  </div>
                </div>
                <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-2 text-foreground">
                  Welcome back, <span className="text-primary">{userName.split(" ")[0]}!</span>
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-md leading-relaxed font-medium">
                  Your journey to excellence continues. Explore our latest premium masterclasses.
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-2">
                <Link to="/dashboard/courses" className="w-full sm:w-auto">
                  <Button variant="hero" className="rounded-xl px-6 py-5 h-auto text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform w-full sm:w-auto whitespace-nowrap">
                    Unlock Your Future
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Professional Grade Education</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            <div className="lg:col-span-8 space-y-8">
              {/* Featured Ad Box - Subtle Glass */}
              <div onClick={() => handleAdClick(adsData[currentAd].link)} className="relative rounded-[2rem] overflow-hidden cursor-pointer group border border-border/40 bg-card/40 backdrop-blur-md shadow-xl">
                <div className="relative h-48 md:h-72">
                  {adsData[currentAd].type === "video" ? (
                    <video src={adsData[currentAd].src} autoPlay muted loop className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <img src={adsData[currentAd].src} alt="Advertisement" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-black tracking-widest mb-3 inline-flex items-center gap-1 uppercase">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                    <p className="text-2xl md:text-4xl font-black mt-2 tracking-tight text-foreground drop-shadow-sm">{adsData[currentAd].headline}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-primary/80 transition-all duration-100 ease-linear" style={{ width: `${adProgress}%` }} />
              </div>

              {/* Quick Navigation Cards - Standard & Compact */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {quickActions.map((action) => (
                  <Link key={action.label} to={action.locked ? "#" : action.href} onClick={(e) => {
                    if (action.locked) { e.preventDefault(); toast({ title: "Locked", description: "Unlock with a plan.", variant: "destructive" }); }
                  }} className={`p-4 md:p-5 rounded-2xl group transition-all duration-300 relative border border-border/30 bg-card/30 backdrop-blur-sm shadow-md ${action.locked ? 'opacity-60 grayscale' : 'hover:-translate-y-1 hover:border-primary/40 hover:bg-card/50'}`}>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-md`}>
                      <action.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-xs md:text-sm tracking-tight text-foreground">{action.label}</h3>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">{action.desc}</p>
                  </Link>
                ))}
              </div>

              {/* Progress & Charts */}
              <div className="space-y-6">
                <ProgressDashboard hasPurchased={hasPurchased} purchasedPlan={purchasedPlan} />
                <AIRecommendations userName={userName} purchasedPlan={purchasedPlan} />
              </div>
            </div>

            {/* Right Column - 4/12 */}
            <div className="lg:col-span-4 space-y-8">
              {/* Course Ad Cards - Unified Column */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-lg font-black tracking-tight text-foreground">Unlock Masterclasses</h2>
                  <Link to="/dashboard/courses" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">View Library</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
                  {allAvailableCourses.slice(0, 7).map((course) => {
                    const isEnrolled = course.name === purchasedPlan;
                    const Icon = (course as any).icon || BookOpen;
                    const level = (course as any).level || 0;

                    // Combo Offer Logic
                    let bonusText = null;
                    if (level === 2) bonusText = "Includes Package 1 for FREE";
                    else if (level === 3) bonusText = "Includes Package 1 & 2 for FREE";
                    else if (level === 4) bonusText = "Includes All Previous Packages for FREE";
                    else if (level === 5) bonusText = "Ultimate Bundle: Get Everything FREE";

                    return (
                      <div key={course.name} className={`p-4 rounded-2xl group transition-all border border-border/30 bg-card/30 backdrop-blur-sm relative overflow-hidden shadow-sm ${isEnrolled ? 'opacity-80 border-primary/20 bg-primary/5' : 'hover:border-primary/40'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${(course as any).color || "from-gray-500 to-slate-600"} flex items-center justify-center shadow-md shrink-0`}>
                            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-xs md:text-sm tracking-tight truncate text-foreground">{course.name}</h3>
                              {isEnrolled && <Badge variant="outline" className="h-4 text-[8px] bg-primary/10 text-primary border-primary/20 px-1 py-0">Enrolled</Badge>}
                            </div>

                            {bonusText && (
                              <div className="mt-1">
                                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-tight">
                                  {bonusText}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-2 mt-1">
                              <p className="text-base md:text-lg font-black text-primary">₹{course.price.toLocaleString()}</p>
                              <Button
                                size="icon"
                                variant={isEnrolled ? "outline" : "hero"}
                                className="h-7 w-7 md:h-8 md:w-8 rounded-full shadow-md hover:scale-110 transition-transform"
                                onClick={() => navigate(isEnrolled ? "/dashboard/courses" : "/payment")}
                              >
                                {isEnrolled ? <BookOpen className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Space padding */}
      <footer className="py-12 text-center text-muted-foreground/30 text-[10px] uppercase font-black tracking-[0.2em]">
        Skill Learners Academy &copy; 2024 • Excellence in Education
      </footer>
    </div>
  );
};

export default UserHome;
