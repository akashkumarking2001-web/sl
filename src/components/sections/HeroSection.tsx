import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Play, Sparkles, GraduationCap, TrendingUp, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/ui/ParticleBackground";
import heroStudent from "@/assets/hero-student.png";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const [content, setContent] = useState({
    title: "",
    subtitle: "",
    ctaText: "",
    ctaLink: ""
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await supabase
          .from('site_content' as any)
          .select('*')
          .eq('section_key', 'hero')
          .maybeSingle();

        if ((data as any)?.content) {
          // @ts-ignore
          setContent((data as any).content);
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      }
    };
    fetchContent();
  }, []);

  const highlights = [
    "10+ Skill-based Video Courses",
    "7+ Income Opportunities",
    "Earn 10%–30% per Affiliate",
    "Lifetime Community Access",
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Clean Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(45,30%,97%)] via-[hsl(200,20%,96%)] to-[hsl(45,25%,95%)] dark:from-[hsl(220,35%,10%)] dark:via-[hsl(220,30%,12%)] dark:to-[hsl(220,35%,11%)]" />

      {/* Fluid Color Blobs - Subtle and Organic */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] -top-[20%] -left-[10%] bg-gradient-to-br from-primary/15 via-amber-400/10 to-transparent rounded-full blur-[100px] animate-pulse opacity-50" style={{ animationDuration: '8s' }} />
        <div className="absolute w-[500px] h-[500px] top-[40%] -right-[15%] bg-gradient-to-bl from-accent/12 via-teal-400/8 to-transparent rounded-full blur-[80px] animate-pulse opacity-40" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute w-[400px] h-[400px] bottom-[10%] left-[20%] bg-gradient-to-t from-emerald-400/10 via-cyan-400/5 to-transparent rounded-full blur-[60px] animate-pulse opacity-35" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      <ParticleBackground />

      {/* Soft Floating Orbs */}
      <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-amber-400/10 blur-2xl animate-float opacity-60" />
      <div className="absolute top-1/3 right-16 w-36 h-36 rounded-full bg-gradient-to-bl from-accent/15 to-teal-400/10 blur-3xl animate-float opacity-50" style={{ animationDelay: '-2s' }} />
      <div className="absolute bottom-1/4 left-1/4 w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400/15 to-cyan-400/10 blur-2xl animate-float opacity-45" style={{ animationDelay: '-4s' }} />

      <div className="container relative mx-auto px-4 py-12 lg:py-20 z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Transform Your Future Today
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {content.title ? content.title : (
                <>
                  Welcome to <span className="drop-shadow-sm font-extrabold" style={{ color: "#F2B035" }}>Skill</span> <span className="drop-shadow-sm font-extrabold" style={{ color: "#2D8077" }}>Learners</span>
                </>
              )}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
              {content.subtitle || (
                <>
                  Upgrade your skills through our <strong className="text-foreground">expert-led courses</strong>, and we'll provide the platform and opportunity for you to achieve{" "}
                  <strong className="text-foreground">financial freedom</strong>.
                </>
              )}
            </p>

            <ul className="space-y-3 text-left max-w-md mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              {highlights.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-foreground/80"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
              <Link to={content.ctaLink || "/register"}>
                <Button className="btn-premium w-full sm:w-auto h-auto text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                  {content.ctaText || "Start Learning Now"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto group rounded-xl border-2 h-auto text-lg px-8 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105"
                onClick={() => document.getElementById('app-download')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Download App
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">10,000+</strong> Active Students
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image with Stats */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative w-full max-w-[500px]">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-[3rem] blur-3xl -z-10 transform rotate-6 scale-95" />

              {/* Main Image Container */}
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden border-4 border-white/5 shadow-2xl bg-white/5 backdrop-blur-sm">
                <img
                  src={heroStudent}
                  alt="Happy Student Learning"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Badge 1 - Course Completed - Adjusted positioning */}
                <div className="absolute top-8 left-2 md:-left-8 glass-card p-3 rounded-2xl flex items-center gap-3 animate-float shadow-xl border-white/10 bg-black/40 backdrop-blur-md max-w-[200px] md:max-w-none">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shrink-0">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-300 font-medium uppercase tracking-wider truncate">Course Completed</p>
                    <p className="text-sm font-bold text-white truncate">Digital Marketing</p>
                  </div>
                </div>

                {/* Floating Badge 2 - Earnings */}
                <div className="absolute bottom-8 -right-4 md:-right-8 glass-card p-3 rounded-2xl flex items-center gap-3 animate-float-delayed shadow-xl border-white/10 bg-black/40 backdrop-blur-md">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">Earnings This Month</p>
                    <p className="text-sm font-bold text-emerald-400">₹25,000+</p>
                  </div>
                </div>

                {/* Floating Coins */}
                <div className="absolute top-1/4 right-4 w-12 h-12 animate-float-slow opacity-90">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600 shadow-lg flex items-center justify-center border border-yellow-200">
                    <span className="text-xl font-bold text-yellow-900">₹</span>
                  </div>
                </div>
                <div className="absolute bottom-1/3 left-4 w-8 h-8 animate-float opacity-80">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600 shadow-lg flex items-center justify-center border border-yellow-200">
                    <span className="text-sm font-bold text-yellow-900">₹</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
