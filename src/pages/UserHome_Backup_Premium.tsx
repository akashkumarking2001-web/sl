import { useState, useEffect } from "react";
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
import { packages } from "@/data/packages";
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
  const { user, profile, signOut } = useAuth();

  // User data from auth
  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const hasPurchased = profile?.has_purchased || false;
  const referralCode = profile?.referral_code || "";
  const purchasedPlan = profile?.purchased_plan || "";

  const quickActions = [
    { icon: User, label: "Profile", href: "/dashboard/profile", color: "from-primary to-gold-dark", desc: "View & edit", locked: false },
    { icon: Wallet, label: "Affiliate Wallet", href: "/dashboard/affiliate", color: "from-accent to-teal-dark", desc: "Your earnings", locked: !hasPurchased },
    { icon: BookOpen, label: "My Courses", href: "/dashboard/courses", color: "from-purple-500 to-purple-600", desc: "Continue learning", locked: false },
    { icon: ShoppingCart, label: "Available Courses", href: "/dashboard/courses", color: "from-emerald to-emerald-light", desc: "Explore plans", locked: false },
  ];

  // Fetch earnings
  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("agent_income")
        .select("total_income")
        .eq("user_id", user.id)
        .single();
      if (data) setTotalEarnings(data.total_income || 0);
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

  const availableCourses = packages.filter(p => p.name !== purchasedPlan);
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
          {/* Welcome Section - Desktop Premium */}
          <div className="hidden lg:block mb-8">
            <div className="glass-card p-8 rounded-[2.5rem] flex items-center justify-between relative overflow-hidden bg-gradient-to-r from-card/60 to-muted/20 border border-white/10 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -ml-32 -mb-32" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 uppercase tracking-widest text-[10px] font-black">
                    Executive Dashboard
                  </Badge>
                  <span className="text-muted-foreground/40">|</span>
                  <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Secure & Verified
                  </div>
                </div>
                <h2 className="text-5xl font-black font-display tracking-tight mb-3">
                  Welcome back, <span className="text-gradient-gold">{userName}!</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
                  Your academy career is flourishing. You've earned <span className="text-foreground font-bold italic">₹{totalEarnings.toLocaleString()}</span> so far. Keep pushing!
                </p>
              </div>

              <div className="relative z-10 flex flex-col gap-3">
                <Link to="/plans">
                  <Button variant="hero" className="rounded-2xl px-8 py-7 h-auto text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                    Upgrade to {nextPlan}
                    <ArrowUpRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest opacity-60">Unlock 10x higher commissions</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            <div className="lg:col-span-8 space-y-8">
              {/* Ad Section */}
              <div onClick={() => handleAdClick(adsData[currentAd].link)} className="relative glass-card rounded-[2rem] overflow-hidden cursor-pointer group border border-white/5">
                <div className="relative h-48 md:h-64">
                  {adsData[currentAd].type === "video" ? (
                    <video src={adsData[currentAd].src} autoPlay muted loop className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <img src={adsData[currentAd].src} alt="Advertisement" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="px-3 py-1 bg-primary/90 text-primary-foreground rounded-full text-[10px] font-black tracking-widest mb-3 inline-flex items-center gap-1 uppercase">
                      <Megaphone className="w-3 h-3" />Sponsored
                    </span>
                    <p className="text-2xl md:text-3xl font-black mt-2 emoji-text tracking-tight">{adsData[currentAd].headline}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ width: `${adProgress}%` }} />
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.label} to={action.locked ? "#" : action.href} onClick={(e) => {
                    if (action.locked) { e.preventDefault(); toast({ title: "Feature Locked 🔒", description: "Purchase a plan to unlock.", variant: "destructive" }); }
                  }} className={`glass-card p-6 rounded-3xl group transition-all duration-500 relative border border-white/5 ${action.locked ? 'opacity-60 cursor-not-allowed grayscale' : 'hover:-translate-y-2 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5'}`}>
                    {action.locked && <div className="absolute top-4 right-4"><Lock className="w-4 h-4 text-muted-foreground/40" /></div>}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-black text-sm tracking-tight group-hover:text-primary transition-colors">{action.label}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">{action.desc}</p>
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
              {/* Referral Panel */}
              <div className="glass-card p-8 rounded-[2.5rem] border-2 border-dashed border-primary/20 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Users className="w-24 h-24" /></div>
                <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                  <Gift className="w-6 h-6 text-primary" />
                  Refer & Earn
                </h3>
                <p className="text-sm text-muted-foreground mb-6">Earn up to <span className="text-primary font-bold">30% commission</span> for every student you invite to the academy.</p>

                {hasPurchased ? (
                  <div className="space-y-4">
                    <div className="bg-card/50 p-4 rounded-2xl border border-border flex items-center justify-between group">
                      <span className="font-mono font-bold text-primary truncate mr-4">{referralCode}</span>
                      <Button variant="ghost" size="sm" onClick={copyReferralLink} className="group-hover:bg-primary group-hover:text-primary-foreground">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button variant="hero" className="w-full rounded-2xl py-6" onClick={copyReferralLink}>
                      Copy Sharing Link
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10 text-center space-y-4">
                    <Lock className="w-10 h-10 text-destructive/40 mx-auto" />
                    <p className="text-xs font-bold text-destructive/80 uppercase tracking-widest leading-loose">Earnings are locked. Purchase a plan to start collecting commissions.</p>
                    <Button variant="outline" className="w-full rounded-xl" onClick={() => navigate("/dashboard/courses")}>Activate My Account</Button>
                  </div>
                )}
              </div>

              {/* Course Ad Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Premium Plans</h2>
                  <Link to="/dashboard/courses" className="text-xs font-bold text-primary hover:underline">View All</Link>
                </div>
                {availableCourses.slice(0, 3).map((course) => {
                  const Icon = planIcons[course.name] || Star;
                  return (
                    <div key={course.name} className="glass-card p-6 rounded-3xl group hover:border-primary/30 transition-all border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-xl shrink-0`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-sm tracking-tight mb-1 truncate">{course.name}</h3>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xl font-black text-gradient-gold">₹{course.price.toLocaleString()}</p>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary" onClick={() => navigate("/payment")}>
                              <ChevronRight className="w-4 h-4" />
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
      </main>

      {/* Footer Space padding */}
      <footer className="py-12 text-center text-muted-foreground/30 text-[10px] uppercase font-black tracking-[0.2em]">
        Skill Learners Academy &copy; 2024 • Excellence in Education
      </footer>
    </div>
  );
};

export default UserHome;
