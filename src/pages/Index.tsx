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
      <div className="h-[100dvh] w-full premium-mesh-bg text-white flex flex-col items-center justify-between py-8 px-8 font-sans relative overflow-hidden">
        {/* Dynamic Abstract Shapes */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-primary/10 rounded-full blur-[120px] animate-mesh-bounce" />
          <div className="absolute bottom-[-5%] left-[-5%] w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] animate-mesh-bounce [animation-delay:4s]" />
          <div className="absolute top-[30%] left-[-10%] w-64 h-64 bg-royal/10 rounded-full blur-[100px] float-shape" />

          {/* Micro-animations */}
          <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse" />
          <div className="absolute bottom-[30%] right-[20%] w-2 h-2 bg-white/20 rounded-full animate-bounce [animation-duration:4s]" />
        </div>

        {/* Top Section: Logo */}
        <div className="relative z-10 animate-in fade-in zoom-in-95 duration-1000 mt-4">
          <div className="p-4 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] logo-float">
            <img src={logo} alt="Skill Learners" className="h-12 w-auto drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
          </div>
        </div>

        {/* Middle Section: Typography & Quote */}
        <div className="relative z-10 w-full text-center space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <div className="space-y-2">
            <h1 className="text-4xl xs:text-5xl font-black tracking-tight leading-[1.1] text-white">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-300 to-yellow-500">Skill Learners</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm tracking-wide px-4">
              Master the art of elite professional growth.
            </p>
          </div>

          <div className="relative px-6">
            <div className="h-px w-10 bg-primary/30 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-[11px] leading-relaxed italic max-w-[240px] mx-auto opacity-70">
              "The beautiful thing about learning is that no one can take it away from you."
            </p>
          </div>
        </div>

        {/* Bottom Section: CTAs & Trust Badges */}
        <div className="relative z-10 w-full max-w-[320px] space-y-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500 mb-4">
          <div className="space-y-3">
            <Link to="/login" className="block w-full">
              <Button size="lg" className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-amber-500 text-black font-black text-base shadow-[0_15px_35px_-5px_rgba(251,191,36,0.4)] hover:scale-[1.02] active:scale-[0.95] transition-all border-none ring-1 ring-white/20">
                Get Started
                <ArrowUpRight className="ml-2 w-4 h-4 stroke-[2.5]" />
              </Button>
            </Link>

            <Link to="/register" className="block w-full">
              <Button variant="outline" size="lg" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-white font-black text-base backdrop-blur-2xl hover:bg-white/10 active:scale-[0.95] transition-all">
                Create Account
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-between px-2 pt-2 opacity-50">
            <div className="flex flex-col items-center gap-1">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Verified</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <Users className="w-4 h-4 text-amber-500" />
              <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Community</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <Award className="w-4 h-4 text-yellow-600" />
              <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Accredited</span>
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
