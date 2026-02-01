import { useState } from "react";
import { ArrowRight, CheckCircle2, Sparkles, Target, GraduationCap, Wallet, Rocket, Crown, TrendingUp, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const journeySteps = [
  {
    step: 1,
    icon: Target,
    title: "Choose Your Path",
    subtitle: "Select a Combo Package",
    description: "Browse our carefully curated combo packages designed to give you maximum value.",
    fullDescription: "Browse our carefully curated combo packages designed to give you maximum value. Each package combines complementary courses that work together to build complete skill sets. Whether you're starting fresh or upgrading your abilities, there's a perfect package waiting for you.",
    highlights: [
      "Multiple courses bundled together",
      "Significant savings vs individual courses",
      "Access to exclusive community",
    ],
    gradient: "from-blue-600 via-cyan-500 to-teal-400",
    bgColor: "bg-blue-500/10",
  },
  {
    step: 2,
    icon: GraduationCap,
    title: "Master Skills",
    subtitle: "Learn from Experts",
    description: "Dive into comprehensive courses taught by professionals actively working in their fields.",
    fullDescription: "Dive into comprehensive courses taught by professionals who are actively working in their fields. Our curriculum is constantly updated to match industry demands. Learn through practical, project-based modules that prepare you for real-world challenges.",
    highlights: [
      "Practical, project-based learning",
      "Live mentoring sessions",
      "Industry-recognized certificates",
    ],
    gradient: "from-emerald-500 via-green-400 to-teal-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    step: 3,
    icon: Wallet,
    title: "Start Earning",
    subtitle: "Multiple Income Streams",
    description: "Apply your new skills immediately through freelancing and our affiliate program.",
    fullDescription: "Apply your new skills immediately. Take on freelance projects, build your portfolio, and leverage our affiliate program for additional income while you learn. Multiple income streams await you from day one.",
    highlights: [
      "Freelance opportunities",
      "Affiliate income potential",
      "Direct client connections",
    ],
    gradient: "from-amber-500 via-orange-400 to-yellow-400",
    bgColor: "bg-amber-500/10",
  },
  {
    step: 4,
    icon: Rocket,
    title: "Financial Freedom",
    subtitle: "Build Your Future",
    description: "With mastered skills and multiple income streams, position yourself for lasting success.",
    fullDescription: "With mastered skills and multiple income streams, you're positioned for lasting success. Our community continues to support you as you scale your ventures and achieve the financial freedom you deserve.",
    highlights: [
      "Passive income opportunities",
      "Business building guidance",
      "Lifetime community access",
    ],
    gradient: "from-violet-600 via-purple-500 to-pink-400",
    bgColor: "bg-violet-500/10",
  },
];

const UserJourneySection = () => {
  const [selectedStep, setSelectedStep] = useState<typeof journeySteps[0] | null>(null);

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-5 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-5 w-64 h-64 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/25 text-sm font-bold text-primary mb-5 shadow-sm">
            <Crown className="w-4 h-4" />
            Your Success Blueprint
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            Your <span className="text-gradient-gold">Journey</span> to Success
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Follow our proven 4-step path from beginner to financially independent professional.
          </p>
        </div>

        {/* Journey Path */}
        <div className="max-w-5xl mx-auto relative">
          {/* Horizontal Road - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-3 -translate-y-1/2 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-emerald-500 via-amber-500 to-violet-500 rounded-full shadow-lg" />
            {/* Lane markers */}
            <div className="absolute inset-y-0 inset-x-8 flex justify-around items-center">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-5 h-1 bg-white/50 rounded-full" />
              ))}
            </div>
          </div>

          {/* Vertical Road - Mobile */}
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-1.5 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-emerald-500 via-amber-500 to-violet-500 rounded-full shadow-md" />
          </div>

          {/* Journey Cards */}
          <div className="grid lg:grid-cols-4 gap-4 lg:gap-5 relative z-10">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              
              return (
                <button 
                  key={step.step}
                  onClick={() => setSelectedStep(step)}
                  className="group relative text-left"
                >
                  {/* Mobile Road Node */}
                  <div className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(50%-1.5rem)] w-6 h-6 rounded-full bg-card flex items-center justify-center border-2 border-primary shadow-md z-20">
                    <span className="text-[10px] font-bold text-primary">{step.step}</span>
                  </div>

                  {/* Card - Solid background for readability */}
                  <div className={`ml-10 lg:ml-0 p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-400 group-hover:-translate-y-2 group-hover:shadow-xl`}>
                    {/* Step Number - Desktop */}
                    <div className="hidden lg:flex absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-card items-center justify-center shadow-lg border-2 border-primary z-20">
                      <span className={`text-xs font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                        {step.step}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`w-11 h-11 mb-3 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-400`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-base font-bold font-display mb-1 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className={`text-xs font-semibold mb-2 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                      {step.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {step.description}
                    </p>

                    {/* Highlights Preview */}
                    <div className="mt-3 space-y-1">
                      {step.highlights.slice(0, 2).map((highlight, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px]">
                          <CheckCircle2 className="w-3 h-3 flex-shrink-0 text-emerald" />
                          <span className="text-foreground/70 line-clamp-1">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <span className="inline-flex items-center text-[10px] text-primary font-semibold mt-3 group-hover:gap-1.5 transition-all">
                      Learn More
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-3 bg-gradient-to-r from-primary/25 via-accent/25 to-primary/25 rounded-2xl blur-xl opacity-60" />
            
            <div className="relative p-8 rounded-2xl bg-card border border-primary/20 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald" />
                <span className="text-xs font-bold text-emerald">Join 10,000+ learners who started their journey</span>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold font-display mb-3">
                Ready to <span className="text-gradient-teal">Transform</span> Your Future?
              </h3>
              
              <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto leading-relaxed">
                Master in-demand skills, take freelance projects, and build multiple income streams. 
                We're here to guide you every step of the way.
              </p>
              
              <Link to="/register">
                <Button variant="hero" size="lg" className="group shadow-lg shadow-primary/20">
                  <Sparkles className="w-4 h-4" />
                  Start Your Journey Today
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Step Detail Modal */}
      <Dialog open={!!selectedStep} onOpenChange={() => setSelectedStep(null)}>
        <DialogContent className="max-w-sm p-0 border-0 overflow-hidden mx-4 max-h-[85vh] overflow-y-auto">
          {selectedStep && (
            <>
              {/* Header */}
              <div className={`relative p-5 bg-gradient-to-br ${selectedStep.gradient}`}>
                <button 
                  onClick={() => setSelectedStep(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <selectedStep.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                      Step {selectedStep.step}
                    </span>
                    <h3 className="text-base font-bold text-white">{selectedStep.title}</h3>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5 bg-card">
                <p className="text-sm font-semibold text-primary mb-2">{selectedStep.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{selectedStep.fullDescription}</p>
                
                <h4 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">What You Get:</h4>
                <ul className="space-y-2 mb-5">
                  {selectedStep.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${selectedStep.gradient} flex items-center justify-center flex-shrink-0`}>
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-foreground/80">{highlight}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => setSelectedStep(null)} 
                  variant="hero" 
                  className="w-full"
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

export default UserJourneySection;