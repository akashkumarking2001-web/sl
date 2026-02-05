import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Wallet, Users, Sparkles, ArrowUpRight, Play, Shield, Globe, Award, Zap, ChevronRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { Capacitor } from "@capacitor/core";

// Web Layout Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import AboutSection from "@/components/sections/AboutSection";
import PlansSection from "@/components/sections/PlansSection";
import WhySkillLearnersSection from "@/components/sections/WhySkillLearnersSection";
import EarningEcosystemSection from "@/components/sections/EarningEcosystemSection";
import CoursesSection from "@/components/sections/CoursesSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import UserJourneySection from "@/components/sections/UserJourneySection";
import PlatformEvolutionSection from "@/components/sections/PlatformEvolutionSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import AppDownloadSection from "@/components/sections/AppDownloadSection";
import { ScrollAnimate } from "@/components/ui/ScrollAnimate";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const isNative = Capacitor.isNativePlatform() || ['8080', '5174'].includes(window.location.port);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/user-home");
      }
    };
    checkUser();

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  if (isNative) {
    return (
      <div className="h-[100dvh] w-full premium-bg-light text-foreground flex flex-col items-center justify-between pb-12 pt-[env(safe-area-inset-top,2rem)] px-8 font-sans relative overflow-hidden transition-colors duration-700">
        {/* Theme Toggle in Corner */}
        <div className="absolute top-[env(safe-area-inset-top,1rem)] right-6 z-50">
          <ThemeToggle variant="icon" className="shadow-lg backdrop-blur-md bg-white/40 border-white/40" />
        </div>

        {/* Dynamic Abstract Shapes - Adjusted for Light Mode */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-mesh-bounce opacity-60" />
          <div className="absolute bottom-[-5%] left-[-5%] w-96 h-96 bg-amber-500/5 rounded-full blur-[110px] animate-mesh-bounce [animation-delay:4s]" />
          <div className="absolute top-[30%] left-[-10%] w-64 h-64 bg-royal/5 rounded-full blur-[90px] float-shape" />

          {/* Micro-animations */}
          <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-primary/20 rounded-full animate-pulse" />
          <div className="absolute bottom-[40%] right-[25%] w-3 h-3 bg-primary/10 rounded-full animate-bounce [animation-duration:5s]" />
        </div>

        {/* Top Section: Logo with Recalculated Spacing */}
        <div className="relative z-10 animate-in fade-in zoom-in-95 duration-1000 mt-12 mb-8">
          <div className="p-5 rounded-[2.5rem] bg-white/40 backdrop-blur-3xl border border-white/60 shadow-[0_15px_40px_rgba(45,30,10,0.08)] logo-float">
            <img src={logo} alt="Skill Learners" className="h-14 w-auto drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
          </div>
        </div>

        {/* Middle Section: Typography & Quote with Balanced Spacing */}
        <div className="relative z-10 w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <div className="space-y-3">
            <h1 className="text-4xl xs:text-5xl font-black tracking-tight leading-[1.1] text-foreground">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-500 to-yellow-600">Skill Learners</span>
            </h1>
            <p className="text-muted-foreground font-bold text-[15px] tracking-wide px-6 max-w-[280px] mx-auto leading-relaxed">
              Master the art of elite <br /> professional growth.
            </p>
          </div>

          <div className="relative px-6">
            <div className="h-[2px] w-8 bg-primary/40 mx-auto mb-5 rounded-full" />
            <p className="text-muted-foreground/60 font-medium text-[11px] leading-relaxed italic max-w-[240px] mx-auto">
              "The beautiful thing about learning is that no one can take it away from you."
            </p>
          </div>
        </div>

        {/* Bottom Section: CTAs & Trust Badges */}
        <div className="relative z-10 w-full max-w-[320px] space-y-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500 mb-8 mt-auto">
          <div className="space-y-4">
            <Link to="/login" className="block w-full">
              <Button size="lg" className="w-full h-15 rounded-3xl bg-gradient-to-r from-primary to-amber-500 text-primary-foreground font-black text-base shadow-[0_12px_30px_-5px_rgba(251,191,36,0.4)] hover:scale-[1.02] active:scale-[0.95] transition-all border-none">
                Get Started
                <ArrowUpRight className="ml-2 w-5 h-5 stroke-[2.5]" />
              </Button>
            </Link>

            <Link to="/register" className="block w-full">
              <Button variant="outline" size="lg" className="w-full h-15 rounded-3xl border-primary/20 bg-primary/5 text-foreground font-black text-base hover:bg-primary/10 active:scale-[0.95] transition-all">
                Create Account
              </Button>
            </Link>
          </div>

          {/* Trust Badges - Improved Visibility */}
          <div className="flex items-center justify-between px-4 pt-4 opacity-80">
            <div className="flex flex-col items-center gap-1.5 group">
              <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-tighter">Verified</span>
            </div>
            <div className="w-[1px] h-8 bg-border/50" />
            <div className="flex flex-col items-center gap-1.5 group">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-tighter">Community</span>
            </div>
            <div className="w-[1px] h-8 bg-border/50" />
            <div className="flex flex-col items-center gap-1.5 group">
              <div className="p-2 rounded-xl bg-yellow-600/10 text-yellow-600 group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-tighter">Accredited</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RESTORED ORIGINAL WEBSITE LAYOUT ---
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden selection:bg-primary/30 font-sans">
      <Navbar />

      <main className="relative z-10">
        <HeroSection />

        <ScrollAnimate>
          <StatsSection />
        </ScrollAnimate>

        <ScrollAnimate>
          <AboutSection />
        </ScrollAnimate>

        <ScrollAnimate>
          <PlansSection />
        </ScrollAnimate>

        <ScrollAnimate>
          <WhySkillLearnersSection />
        </ScrollAnimate>

        <ScrollAnimate>
          <EarningEcosystemSection />
        </ScrollAnimate>

        <ScrollAnimate>
          <CoursesSection />
        </ScrollAnimate>

        <ScrollAnimate>
          <ReviewsSection />
        </ScrollAnimate>

        <ScrollAnimate>
          <UserJourneySection />
        </ScrollAnimate>

        <ScrollAnimate>
          <PlatformEvolutionSection />
        </ScrollAnimate>

        <ScrollAnimate>
          <FAQSection />
        </ScrollAnimate>

        <ScrollAnimate>
          <AppDownloadSection />
        </ScrollAnimate>

        <ScrollAnimate>
          <ContactSection />
        </ScrollAnimate>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
