import { Link } from "react-router-dom";
import { ArrowRight, Zap, Target, Users, TrendingUp, Crown, Shield, BookOpen, Briefcase, Coins, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const EarningEcosystemSection = () => {
  const benefits = [
    {
      icon: BookOpen,
      title: "Skill Development",
      description: "Master in-demand skills like digital marketing, trading, content creation, and e-commerce that enable freelancing success.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Briefcase,
      title: "Active Income",
      description: "Apply your skills immediately to earn through freelancing, client projects, and digital services.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Users,
      title: "Affiliate Rewards",
      description: "Earn 10-30% commission when you help others join and succeed. Share knowledge, grow together.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Coins,
      title: "Passive Income",
      description: "Seniority-based instant profit sharing on every sale. Earn even when not actively working.",
      color: "from-blue-500 to-indigo-600",
    },
  ];

  const stats = [
    { value: "1000+", label: "Active Students" },
    { value: "7", label: "Income Streams" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section className="py-16 lg:py-28 relative overflow-hidden">
      {/* Premium Dark Theme Background */}
      <div className="absolute inset-0 bg-[#0a0f1a]" />
      
      {/* Rich gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1525] via-[#0a1628] to-[#071018]" />
      
      {/* Subtle mesh gradient for premium feel */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_50%_at_20%_20%,rgba(120,119,198,0.15),transparent)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(251,191,36,0.12),transparent)]" />
      </div>
      
      {/* Decorative glow orbs */}
      <div className="absolute top-1/4 left-[10%] w-80 h-80 rounded-full bg-gradient-to-r from-primary/20 to-amber-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-[10%] w-72 h-72 rounded-full bg-gradient-to-l from-cyan-500/15 to-blue-600/10 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-500/5 blur-[150px]" />

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/15 rounded-full border border-primary/30 mb-6 backdrop-blur-sm">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary tracking-wider uppercase">Premium Ecosystem</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4 text-white leading-tight">
            The <span className="text-gradient-gold">Earning</span> Ecosystem
          </h2>
          
          <p className="text-base lg:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            We sell premium online courses to help you develop high-value skills for freelancing and multiple income streams.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-14 max-w-xl mx-auto">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="text-center p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg"
            >
              <div className="text-2xl lg:text-4xl font-bold font-display text-gradient-gold mb-1">
                {stat.value}
              </div>
              <p className="text-xs lg:text-sm text-white/60 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={benefit.title}
                className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg group hover:-translate-y-2 transition-all duration-300"
              >
                <div 
                  className={`w-14 h-14 mb-5 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-lg font-bold font-display text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Income Types Comparison Box */}
        <div className="max-w-4xl mx-auto mb-14">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-lg">
            <h3 className="text-xl lg:text-2xl font-bold font-display text-center text-white mb-8">
              <Sparkles className="w-5 h-5 inline mr-2 text-primary" />
              Our Dual Income Model
            </h3>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Working Income */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Working Income</h4>
                    <p className="text-xs text-white/50">Active Earnings</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    Apply your learned skills to earn actively
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    Take freelance projects & client work
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    Create digital products & services
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    Effort directly translates to income
                  </li>
                </ul>
              </div>

              {/* Passive Income */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Passive Income</h4>
                    <p className="text-xs text-white/50">Seniority-Based Profit Sharing</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    Instant profit share on every company sale
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    Based on your seniority/hierarchy level
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    Grows as you progress in the system
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    Earn even when not actively working
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Future Ready Section - Updated CTA */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
          <div className="absolute inset-0 backdrop-blur-xl" />
          
          <div className="relative p-6 lg:p-10 border border-primary/20 rounded-2xl">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex items-center gap-4 flex-1">
                <Shield className="w-10 h-10 text-primary" />
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold font-display text-white">
                    <span className="text-gradient-teal">"Bridge the Gap</span> Between Skills and Scalable Income"
                  </h3>
                  <p className="text-sm text-white/70 mt-1">
                    Our ecosystem evolves with industry trends—AI, Web3, automation, and beyond.
                  </p>
                </div>
              </div>
              
              <Link to="/register" className="flex-shrink-0">
                <Button variant="hero" size="lg" className="group shadow-xl shadow-primary/30 text-lg px-8 py-6">
                  <Sparkles className="w-5 h-5" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarningEcosystemSection;