import { Clock, Users, Lightbulb, TrendingUp, Shield, Headphones, GraduationCap, Briefcase, Target, Sparkles, Check, X, Crown, HeartHandshake, Rocket } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Expert-Led Training",
    description: "Learn from industry professionals with real-world experience, not just theory.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Briefcase,
    title: "Career-Ready Skills",
    description: "Graduate with skills employers and clients are actively seeking.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: TrendingUp,
    title: "Multiple Income Paths",
    description: "7 different income opportunities including affiliate earnings and profit sharing.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: HeartHandshake,
    title: "Lifetime Community",
    description: "Join a supportive network of learners and mentors with 24/7 access.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Lightbulb,
    title: "Future-Ready Curriculum",
    description: "AI, Web3, digital marketing, and emerging technologies.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Rocket,
    title: "Direct Opportunities",
    description: "Freelance marketplace and job portal connecting you with clients. (Coming Soon)",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: Users,
    title: "Thriving Community",
    description: "10,000+ like-minded learners. Collaborate and grow together.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Shield,
    title: "Certified Excellence",
    description: "Industry-recognized certificates that boost your professional credibility.",
    color: "from-amber-500 to-orange-500",
  },
];

const comparisonPoints = [
  {
    others: "Generic video courses",
    us: "Expert-led training with mentorship"
  },
  {
    others: "Learn and leave",
    us: "Complete earning ecosystem"
  },
  {
    others: "No income support",
    us: "7 built-in income opportunities"
  },
  {
    others: "Limited community",
    us: "Active 10,000+ member network"
  },
];

const WhySkillLearnersSection = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-5">
            <Sparkles className="w-4 h-4" />
            The Skill Learners Difference
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            Why Choose <span className="text-gradient-gold">Skill Learners</span>?
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're not just another e-learning platform. We're your partner in building a successful career 
            and achieving financial independence.
          </p>
        </div>

        {/* Modern Comparison Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient border effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 via-accent/30 to-primary/50 rounded-2xl" />
            
            <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl font-bold font-display text-center mb-6">
                Others vs <span className="text-gradient-gold">Skill Learners</span>
              </h3>
              
              {/* Column Headers */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
                  <span className="text-sm font-bold text-destructive">❌ Others</span>
                </div>
                <div className="text-center p-2.5 rounded-xl bg-emerald/10 border border-emerald/20">
                  <span className="text-sm font-bold text-emerald">✓ Skill Learners</span>
                </div>
              </div>
              
              {/* Comparison Rows */}
              <div className="space-y-2">
                {comparisonPoints.map((point, index) => (
                  <div key={index} className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/50">
                      <X className="w-4 h-4 text-destructive flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{point.others}</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald/5 border border-emerald/20">
                      <Check className="w-4 h-4 text-emerald flex-shrink-0" />
                      <span className="text-sm text-foreground font-medium">{point.us}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Compact Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative p-5 rounded-xl bg-card/80 border border-border/50 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 transition-all duration-400"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold font-display mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-block p-6 rounded-2xl bg-card/80 border border-border/50 max-w-xl">
            <Target className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-bold font-display mb-2">Your Success is Our Mission</h3>
            <p className="text-sm text-muted-foreground">
              With the right skills and our support system, you can achieve anything. 
              We're here to guide you every step of the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySkillLearnersSection;