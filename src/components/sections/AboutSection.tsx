import { useState } from "react";
import { Eye, Target, Crosshair, Sparkles, Award, Globe, Users, ArrowRight, Lightbulb, Rocket, Star, Zap, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const aboutCards = [
  {
    icon: Eye,
    title: "Our Vision",
    shortDesc: "To be a global leader in transforming lives through online education.",
    fullDesc: `Our vision is to be a global leader in transforming lives through online education, empowering individuals worldwide to unlock their full potential, thrive in the digital age, and achieve fulfilling lives with financial freedom.

We envision a world where quality education is accessible to everyone, regardless of their background or location. Through innovative learning experiences and cutting-edge technology, we aim to bridge the gap between ambition and achievement.

Our commitment is to create pathways that lead to personal growth, professional success, and lasting prosperity for every member of our community.`,
    color: "from-primary to-gold-dark",
    bgColor: "bg-primary/10",
    bannerImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    accentIcon: Globe,
  },
  {
    icon: Target,
    title: "Our Mission",
    shortDesc: "To empower individuals through quality education and practical training.",
    fullDesc: `Our mission is to empower individuals to unlock their full potential and thrive in the digital age through our online courses. We aim to create a supportive community for learning and career growth, providing high-quality education, practical training, and expert guidance.

We believe in:
• Delivering world-class content created by industry experts
• Providing hands-on, practical learning experiences
• Building a supportive community of learners and mentors
• Offering personalized guidance for career advancement
• Creating multiple income opportunities through skill development

Every course we offer is designed with real-world application in mind, ensuring our students graduate with skills that are immediately valuable in the marketplace.`,
    color: "from-accent to-teal-dark",
    bgColor: "bg-accent/10",
    bannerImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    accentIcon: Users,
  },
  {
    icon: Crosshair,
    title: "Our Goal",
    shortDesc: "To provide innovative courses tailored to future technologies.",
    fullDesc: `Our main goal is to provide innovative online courses tailored to future technologies and market trends, developing practical skills essential for career advancement and creating income-generating opportunities.

We focus on:
• AI & Machine Learning expertise
• Digital Marketing mastery
• E-commerce & Dropshipping strategies
• Cryptocurrency & Web3 knowledge
• High-income skill development
• Freelancing & Remote work opportunities

By staying ahead of industry trends and continuously updating our curriculum, we ensure our students are always prepared for the jobs and opportunities of tomorrow, not yesterday.`,
    color: "from-emerald to-emerald-light",
    bgColor: "bg-emerald/10",
    bannerImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    accentIcon: Award,
  },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Active Learners" },
  { icon: Star, value: "50+", label: "Expert Courses" },
  { icon: Zap, value: "7", label: "Income Streams" },
];

const AboutSection = () => {
  const [selectedCard, setSelectedCard] = useState<typeof aboutCards[0] | null>(null);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);

  return (
    <section id="about" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
      
      {/* Animated Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-[10%] w-20 h-20 border border-primary/20 rounded-full animate-float opacity-40" />
        <div className="absolute top-40 right-[15%] w-16 h-16 border border-accent/20 rotate-45 animate-float-delayed opacity-30" />
        <div className="absolute bottom-32 left-[20%] w-12 h-12 bg-gradient-to-br from-primary/10 to-transparent rounded-lg animate-float-slow opacity-50" />
        <div className="absolute top-1/3 right-[8%] w-24 h-24 border border-emerald/15 rounded-2xl rotate-12 animate-float opacity-25" />
        <div className="absolute bottom-1/4 right-[25%] w-8 h-8 bg-accent/10 rounded-full animate-float-delayed opacity-40" />
      </div>
      
      {/* Gradient pulse background */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/25 text-sm font-bold text-primary mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            About Skill Learners
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold font-display mb-5">
            Empowering Your <span className="text-gradient-gold">Digital Future</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Empowering the next generation of digital entrepreneurs through learning, earning, and future-tech innovation.
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card/80 border border-border/50 backdrop-blur-sm shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Story Section - Premium Design with Read More */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Gradient border effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/50 via-accent/30 to-primary/50 rounded-3xl" />
            
            <div className="relative bg-card/95 backdrop-blur-xl rounded-3xl p-6 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                {/* Content */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 lg:w-14 h-12 lg:h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <Lightbulb className="w-6 lg:w-7 h-6 lg:h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-bold font-display">Our Story</h3>
                      <p className="text-xs lg:text-sm text-muted-foreground">The journey that defines us</p>
                    </div>
                  </div>
                  
                  {/* Teaser text - always visible */}
                  <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                    <span className="text-foreground font-medium italic">"From a spark of an idea to a community of learners."</span> We didn't just build an app; we built a bridge to your future...
                  </p>
                  
                  {/* Expandable content */}
                  <div className={`overflow-hidden transition-all duration-500 ${isStoryExpanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <p className="text-muted-foreground leading-relaxed text-sm lg:text-base mb-4">
                      In a world where technology evolves faster than traditional education can keep up, we created 
                      <strong className="text-foreground"> Skill Learners</strong> — a complete ecosystem designed to transform 
                      lives through practical education and real earning opportunities.
                    </p>
                    
                    <p className="text-muted-foreground leading-relaxed text-sm lg:text-base mb-4">
                      We're not just another e-learning platform. We're building a community where learning leads to earning, 
                      and where every member has access to the skills and opportunities needed to thrive in the digital economy.
                    </p>

                    <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                      Our mission goes beyond teaching—we're here to create <strong className="text-foreground">financial freedom</strong> through 
                      skill development, mentorship, and a supportive network that celebrates every milestone of your journey.
                    </p>
                  </div>

                  {/* Read More Toggle */}
                  <button 
                    onClick={() => setIsStoryExpanded(!isStoryExpanded)}
                    className="inline-flex items-center gap-2 mt-4 text-primary font-semibold text-sm hover:text-primary/80 transition-colors group"
                  >
                    {isStoryExpanded ? 'Read Less' : 'Read More'}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isStoryExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div className="flex flex-wrap items-center gap-2 lg:gap-3 mt-5">
                    <div className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-emerald/15 border border-emerald/25">
                      <Rocket className="w-3.5 lg:w-4 h-3.5 lg:h-4 text-emerald" />
                      <span className="text-xs lg:text-sm font-semibold text-emerald">Future-Focused</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-primary/15 border border-primary/25">
                      <Users className="w-3.5 lg:w-4 h-3.5 lg:h-4 text-primary" />
                      <span className="text-xs lg:text-sm font-semibold text-primary">Community-Driven</span>
                    </div>
                  </div>
                </div>
                
                {/* Image */}
                <div className="relative hidden lg:block">
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" 
                    alt="Team collaboration"
                    className="relative rounded-2xl shadow-2xl w-full h-64 lg:h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid - Modern Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aboutCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => setSelectedCard(card)}
                className="group relative text-left"
              >
                {/* Card */}
                <div className="relative h-full p-6 lg:p-8 rounded-2xl bg-card/80 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-400 group-hover:-translate-y-2 group-hover:shadow-xl overflow-hidden">
                  {/* Background glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-400`} />
                  
                  {/* Icon */}
                  <div className={`relative z-10 w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  
                  <h3 className="relative z-10 text-xl font-bold font-display mb-3 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  
                  <p className="relative z-10 text-muted-foreground leading-relaxed mb-6">
                    {card.shortDesc}
                  </p>
                  
                  <span className="relative z-10 inline-flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                    Learn More
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Premium Modal */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-2xl p-0 border-0 overflow-hidden mx-4 max-h-[85vh] overflow-y-auto">
          {selectedCard && (
            <>
              <div className="relative h-48 md:h-64 overflow-hidden">
                <img 
                  src={selectedCard.bannerImage} 
                  alt={selectedCard.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
                <div className={`absolute bottom-6 left-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedCard.color} flex items-center justify-center shadow-xl`}>
                  <selectedCard.icon className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              
              <div className="p-6 md:p-8 pt-4 bg-card">
                <DialogHeader>
                  <DialogTitle className="text-2xl md:text-3xl font-bold font-display">
                    {selectedCard?.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line mt-4 text-base">
                  {selectedCard?.fullDesc}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AboutSection;