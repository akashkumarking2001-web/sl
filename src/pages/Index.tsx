import { useEffect, useState } from "react";
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
import { ScrollAnimate } from "@/components/ui/ScrollAnimate";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Dark mode ambient animations */}
      <div className="dark-ambient-bg">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>
      
      {/* Parallax Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Large gradient orbs */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"
          style={{ 
            top: '10%', 
            left: '-10%',
            transform: `translateY(${scrollY * 0.1}px)` 
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl"
          style={{ 
            top: '40%', 
            right: '-5%',
            transform: `translateY(${scrollY * 0.15}px)` 
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full bg-electric/3 blur-3xl"
          style={{ 
            bottom: '20%', 
            left: '20%',
            transform: `translateY(${scrollY * -0.1}px)` 
          }}
        />

        {/* Geometric shapes */}
        <div 
          className="absolute w-24 h-24 border border-primary/10 rotate-45"
          style={{ 
            top: '15%', 
            right: '20%',
            transform: `translateY(${scrollY * 0.2}px) rotate(45deg)` 
          }}
        />
        <div 
          className="absolute w-16 h-16 border border-accent/10 rotate-12"
          style={{ 
            top: '50%', 
            left: '8%',
            transform: `translateY(${scrollY * 0.25}px) rotate(12deg)` 
          }}
        />
        <div 
          className="absolute w-20 h-20 border border-emerald/10 rounded-full"
          style={{ 
            top: '70%', 
            right: '15%',
            transform: `translateY(${scrollY * -0.15}px)` 
          }}
        />

        {/* Small floating dots */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              top: `${10 + i * 12}%`,
              left: `${5 + i * 10}%`,
              transform: `translateY(${scrollY * (0.05 + i * 0.02)}px)`,
            }}
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <div
            key={`r-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-accent/20"
            style={{
              top: `${20 + i * 14}%`,
              right: `${3 + i * 8}%`,
              transform: `translateY(${scrollY * (0.08 + i * 0.015)}px)`,
            }}
          />
        ))}

        {/* Gradient lines */}
        <div 
          className="absolute w-px h-40 bg-gradient-to-b from-transparent via-primary/20 to-transparent"
          style={{ 
            top: '25%', 
            left: '25%',
            transform: `translateY(${scrollY * 0.12}px)` 
          }}
        />
        <div 
          className="absolute w-px h-32 bg-gradient-to-b from-transparent via-accent/20 to-transparent"
          style={{ 
            top: '60%', 
            right: '30%',
            transform: `translateY(${scrollY * -0.08}px)` 
          }}
        />
      </div>

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
          <ContactSection />
        </ScrollAnimate>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
