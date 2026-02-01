import { useState, useEffect, useRef } from "react";
import { GraduationCap, Users, Briefcase, ShoppingBag, Bitcoin, Wallet, Globe, Rocket, Sparkles, X, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const platformPhases = [
  {
    phase: 1,
    icon: GraduationCap,
    title: "Educational Excellence",
    subtitle: "Extensive Online Courses & Certifications",
    description: "World-class video courses covering digital marketing, trading, e-commerce, AI, and more.",
    fullDescription: "Our comprehensive educational platform offers world-class video courses meticulously crafted by industry experts. From digital marketing to stock trading, e-commerce strategies to AI fundamentals—we cover every skill needed to thrive in the digital economy. Each course comes with industry-recognized certifications.",
    status: "Active",
    color: "from-blue-500 to-cyan-500",
    dotColor: "bg-blue-500",
  },
  {
    phase: 2,
    icon: Users,
    title: "Skill Development",
    subtitle: "Live & Offline Expert Training",
    description: "Interactive live sessions, hands-on workshops, and regional offline training events.",
    fullDescription: "Go beyond recorded content with interactive live sessions led by industry professionals. Participate in hands-on workshops, Q&A sessions, and regional offline training events. This phase bridges the gap between theoretical knowledge and practical application.",
    status: "Coming 2025",
    color: "from-emerald-500 to-teal-500",
    dotColor: "bg-emerald-500",
  },
  {
    phase: 3,
    icon: Briefcase,
    title: "Career Growth",
    subtitle: "Freelancing & Job Opportunities Hub",
    description: "Direct job placements, freelance marketplace, and client connections.",
    fullDescription: "Our dedicated career hub connects skilled learners directly with employers and clients. Access job placements, freelance opportunities, and a marketplace where your newly acquired skills translate into real income.",
    status: "Coming 2025",
    color: "from-violet-500 to-purple-500",
    dotColor: "bg-violet-500",
  },
  {
    phase: 4,
    icon: ShoppingBag,
    title: "Digital Commerce",
    subtitle: "E-commerce Platform Launch",
    description: "In-house production, exclusive products, and seller programs.",
    fullDescription: "Launch of our own e-commerce ecosystem featuring in-house manufactured products, dropshipping opportunities, and exclusive seller programs for community members.",
    status: "Coming 2026",
    color: "from-amber-500 to-orange-500",
    dotColor: "bg-amber-500",
  },
  {
    phase: 5,
    icon: Bitcoin,
    title: "Financial Ecosystem",
    subtitle: "Skill Learners Crypto Coin",
    description: "Native cryptocurrency for platform transactions and rewards.",
    fullDescription: "Introduction of our native cryptocurrency—Skill Learners Coin. Use it for platform transactions, earn it as rewards, and unlock exclusive member benefits.",
    status: "Coming 2026",
    color: "from-yellow-400 to-amber-500",
    dotColor: "bg-yellow-400",
  },
  {
    phase: 6,
    icon: Wallet,
    title: "Digital Assets",
    subtitle: "Secure Wallet & Exchange",
    description: "Integrated crypto wallet and exchange platform.",
    fullDescription: "Complete digital asset management with our secure wallet and native exchange platform. Seamlessly manage, trade, and grow your digital assets within the Skill Learners ecosystem.",
    status: "Coming 2027",
    color: "from-rose-500 to-pink-500",
    dotColor: "bg-rose-500",
  },
  {
    phase: 7,
    icon: Globe,
    title: "Global Income Hub",
    subtitle: "Multi-stream Passive Income",
    description: "Complete ecosystem for generating multiple income streams globally.",
    fullDescription: "The ultimate vision—a complete global ecosystem enabling members to generate multiple passive and active income streams with minimal effort. From investments to royalties, from referrals to dividends—build lasting wealth.",
    status: "Vision",
    color: "from-indigo-500 to-blue-600",
    dotColor: "bg-indigo-500",
  },
];

const PlatformEvolutionSection = () => {
  const [selectedPhase, setSelectedPhase] = useState<typeof platformPhases[0] | null>(null);
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 relative overflow-hidden">
      {/* Clean Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-background" />
      
      {/* Subtle colorful orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/5 blur-[100px]" />
      <div className="absolute bottom-1/4 right-10 w-56 h-56 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/5 blur-[80px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-[120px]" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-5 backdrop-blur-sm">
            <Rocket className="w-4 h-4" />
            Our Vision of the Future
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4 text-foreground">
            Platform <span className="text-gradient-gold">Evolution</span> Roadmap
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Our journey to build a complete ecosystem for learning, earning, and financial freedom.
          </p>
        </div>

        {/* Winding Road Roadmap */}
        <div className="relative max-w-5xl mx-auto">
          {/* Desktop Winding Road SVG */}
          <svg 
            className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 h-full w-[600px]" 
            viewBox="0 0 600 1400" 
            fill="none"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Road path - winding curves */}
            <path 
              d="M300 0 
                 C400 100, 450 150, 400 200 
                 C350 250, 200 250, 200 350 
                 C200 450, 350 450, 400 500 
                 C450 550, 450 600, 400 650 
                 C350 700, 200 700, 200 800 
                 C200 900, 350 900, 400 950 
                 C450 1000, 450 1050, 400 1100
                 C350 1150, 200 1150, 200 1250
                 C200 1350, 300 1400, 300 1400" 
              stroke="url(#roadGradient)" 
              strokeWidth="60" 
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-lg"
            />
            {/* Road center line (dashed) */}
            <path 
              d="M300 0 
                 C400 100, 450 150, 400 200 
                 C350 250, 200 250, 200 350 
                 C200 450, 350 450, 400 500 
                 C450 550, 450 600, 400 650 
                 C350 700, 200 700, 200 800 
                 C200 900, 350 900, 400 950 
                 C450 1000, 450 1050, 400 1100
                 C350 1150, 200 1150, 200 1250
                 C200 1350, 300 1400, 300 1400" 
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth="3" 
              strokeDasharray="20 15"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />
            {/* Road edge lines */}
            <path 
              d="M300 0 
                 C400 100, 450 150, 400 200 
                 C350 250, 200 250, 200 350 
                 C200 450, 350 450, 400 500 
                 C450 550, 450 600, 400 650 
                 C350 700, 200 700, 200 800 
                 C200 900, 350 900, 400 950 
                 C450 1000, 450 1050, 400 1100
                 C350 1150, 200 1150, 200 1250
                 C200 1350, 300 1400, 300 1400" 
              stroke="hsl(var(--primary))" 
              strokeWidth="64" 
              strokeLinecap="round"
              fill="none"
              opacity="0.15"
            />
            <defs>
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.9"/>
                <stop offset="50%" stopColor="hsl(var(--card))" stopOpacity="1"/>
                <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.9"/>
              </linearGradient>
            </defs>
          </svg>

          {/* Mobile Vertical Road */}
          <div className="lg:hidden absolute left-8 top-0 bottom-0 w-3">
            <div className="absolute inset-0 bg-gradient-to-b from-muted via-card to-muted rounded-full shadow-lg" />
            <div className="absolute inset-y-0 left-0 w-0.5 bg-primary/30 rounded-l-full" />
            <div className="absolute inset-y-0 right-0 w-0.5 bg-primary/30 rounded-r-full" />
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] flex flex-col gap-4 py-4">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="flex-shrink-0 h-4 w-full bg-muted-foreground/30 rounded-full" />
              ))}
            </div>
          </div>

          {/* Timeline Items */}
          <div className="relative space-y-6 lg:space-y-0" style={{ minHeight: 'calc(7 * 160px + 60px)' }}>
            {platformPhases.map((phase, index) => {
              const Icon = phase.icon;
              const isLeft = index % 2 === 0;
              
              // Fixed consistent spacing for desktop
              const topPosition = index * 160 + 20;
              
              return (
                <div 
                  key={phase.phase}
                  className="relative lg:absolute lg:w-full lg:left-0"
                  style={{ top: `${topPosition}px` }}
                >
                  {/* Milestone Marker - Mobile */}
                  <button
                    onClick={() => setSelectedPhase(phase)}
                    className="lg:hidden absolute left-5 top-6 z-20"
                  >
                    <div 
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center border-4 border-background shadow-xl ${
                        sectionVisible ? 'animate-[pulse-milestone_2s_ease-in-out_infinite]' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {sectionVisible && (
                      <div 
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${phase.color} opacity-30`}
                        style={{
                          animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                          animationDelay: `${index * 0.15}s`
                        }}
                      />
                    )}
                  </button>

                  {/* Content Card - Mobile */}
                  <div className="lg:hidden ml-20 pr-4">
                    <button 
                      onClick={() => setSelectedPhase(phase)}
                      className="w-full text-left p-5 rounded-2xl bg-card/90 border border-border/60 hover:bg-card hover:border-primary/30 transition-all duration-300 group shadow-lg backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r ${phase.color} text-white shadow-md`}>
                          Phase {phase.phase}
                        </span>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                          phase.status === 'Active' 
                            ? 'bg-emerald/15 text-emerald border border-emerald/30' 
                            : 'bg-amber/15 text-amber-600 dark:text-amber-400 border border-amber/30'
                        }`}>
                          {phase.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{phase.title}</h3>
                      <p className="text-primary text-xs font-semibold mb-2">{phase.subtitle}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{phase.description}</p>
                      
                      <span className="inline-flex items-center text-xs text-primary font-semibold mt-3 group-hover:gap-1.5 transition-all">
                        Learn More
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>

                  {/* Desktop Layout - Fixed Grid Alignment */}
                  <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] items-center gap-0">
                    {/* Left Side Content */}
                    <div className={`pr-8 ${isLeft ? 'text-right' : ''}`}>
                      {isLeft && (
                        <button 
                          onClick={() => setSelectedPhase(phase)}
                          className="inline-block text-right p-4 rounded-xl bg-card/90 border border-border/50 hover:bg-card hover:border-primary/30 hover:-translate-x-1 transition-all duration-300 group shadow-md backdrop-blur-sm w-[280px] ml-auto"
                        >
                          <div className="flex items-center justify-end gap-2 mb-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              phase.status === 'Active' 
                                ? 'bg-emerald/15 text-emerald border border-emerald/30' 
                                : 'bg-amber/15 text-amber-600 dark:text-amber-400 border border-amber/30'
                            }`}>
                              {phase.status}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${phase.color} text-white`}>
                              Phase {phase.phase}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">{phase.title}</h3>
                          <p className="text-primary text-xs font-semibold mb-1">{phase.subtitle}</p>
                          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{phase.description}</p>
                        </button>
                      )}
                    </div>

                    {/* Center Milestone Marker */}
                    <div className="relative flex justify-center w-20">
                      <button
                        onClick={() => setSelectedPhase(phase)}
                        className="group relative z-20"
                      >
                        <div 
                          className={`w-14 h-14 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center border-4 border-background shadow-xl transition-all duration-500 group-hover:scale-110 ${
                            sectionVisible 
                              ? 'animate-[pulse-milestone_2s_ease-in-out_infinite]' 
                              : ''
                          }`}
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {sectionVisible && (
                          <div 
                            className={`absolute inset-0 rounded-full bg-gradient-to-br ${phase.color} opacity-30`}
                            style={{
                              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                              animationDelay: `${index * 0.15}s`
                            }}
                          />
                        )}
                      </button>
                    </div>

                    {/* Right Side Content */}
                    <div className={`pl-8 ${!isLeft ? 'text-left' : ''}`}>
                      {!isLeft && (
                        <button 
                          onClick={() => setSelectedPhase(phase)}
                          className="inline-block text-left p-4 rounded-xl bg-card/90 border border-border/50 hover:bg-card hover:border-primary/30 hover:translate-x-1 transition-all duration-300 group shadow-md backdrop-blur-sm w-[280px]"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${phase.color} text-white`}>
                              Phase {phase.phase}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              phase.status === 'Active' 
                                ? 'bg-emerald/15 text-emerald border border-emerald/30' 
                                : 'bg-amber/15 text-amber-600 dark:text-amber-400 border border-amber/30'
                            }`}>
                              {phase.status}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">{phase.title}</h3>
                          <p className="text-primary text-xs font-semibold mb-1">{phase.subtitle}</p>
                          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{phase.description}</p>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/20 shadow-lg backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-foreground font-medium text-sm">Join us on this revolutionary journey</span>
          </div>
        </div>
      </div>

      {/* Phase Detail Modal */}
      <Dialog open={!!selectedPhase} onOpenChange={() => setSelectedPhase(null)}>
        <DialogContent className="max-w-md p-0 border-0 overflow-hidden mx-4 max-h-[85vh] overflow-y-auto">
          {selectedPhase && (
            <>
              {/* Header with gradient */}
              <div className={`relative p-6 bg-gradient-to-br ${selectedPhase.color}`}>
                <button 
                  onClick={() => setSelectedPhase(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <selectedPhase.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                      Phase {selectedPhase.phase} • {selectedPhase.status}
                    </span>
                    <h3 className="text-xl font-bold text-white">{selectedPhase.title}</h3>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 bg-card">
                <p className="text-sm font-semibold text-primary mb-3">{selectedPhase.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedPhase.fullDescription}</p>
                
                <Button 
                  onClick={() => setSelectedPhase(null)} 
                  variant="hero" 
                  className="w-full mt-6"
                  size="default"
                >
                  Got it!
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PlatformEvolutionSection;