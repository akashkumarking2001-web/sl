import { useEffect, useState, useRef } from "react";
import { Users, UserCheck, BookOpen, Trophy, TrendingUp, Award, Headphones } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 10000,
    maxValue: 15000,
    suffix: "+",
    label: "Total Students",
    color: "#FBBF24", // Gold
    bgGradient: "from-primary to-gold-dark",
  },
  {
    icon: UserCheck,
    value: 5000,
    maxValue: 10000,
    suffix: "+",
    label: "Active Members",
    color: "#22C55E", // Emerald
    bgGradient: "from-emerald to-emerald-light",
  },
  {
    icon: BookOpen,
    value: 50,
    maxValue: 100,
    suffix: "+",
    label: "Expert Courses",
    color: "#14B8A6", // Teal
    bgGradient: "from-accent to-teal-light",
  },
  {
    icon: Trophy,
    value: 100,
    maxValue: 200,
    suffix: "K+",
    label: "Earnings Distributed",
    color: "#8B5CF6", // Purple
    bgGradient: "from-purple-500 to-purple-600",
  },
];

// Circular Progress Component with 3D effects
const CircularStatCard = ({ 
  stat, 
  index, 
  isInView 
}: { 
  stat: typeof stats[0]; 
  index: number; 
  isInView: boolean 
}) => {
  const [count, setCount] = useState(0);
  const Icon = stat.icon;
  
  const percentage = (stat.value / stat.maxValue) * 100;
  const strokeWidth = 6;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;
    const duration = 2000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function - easeOutQuart
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * stat.value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [stat.value, isInView]);

  const strokeDashoffset = circumference - (isInView ? (percentage / 100) * circumference : circumference);

  return (
    <div
      className="relative group"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* 3D Floating Card - More compact */}
      <div className="glass-card p-4 lg:p-6 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated relative overflow-hidden group-hover:scale-[1.02]">
        {/* Glowing border effect on hover */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: `0 0 30px ${stat.color}40, inset 0 0 20px ${stat.color}10`,
          }}
        />
        
        {/* Background glow */}
        <div 
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{ background: stat.color }}
        />
        
        <div className="relative flex flex-col items-center">
          {/* SVG Circle Progress - Compact */}
          <div className="relative w-24 h-24 lg:w-28 lg:h-28 mb-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-muted/20"
              />
              {/* Progress circle with glow */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={stat.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-[2000ms] ease-out"
                style={{
                  filter: `drop-shadow(0 0 6px ${stat.color}80)`,
                }}
              />
            </svg>
            
            {/* Center icon with 3D effect - Compact */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                style={{
                  boxShadow: `0 8px 20px ${stat.color}40`,
                }}
              >
                <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
            </div>
          </div>
          
          {/* Value with animation - Compact */}
          <div className="text-center">
            <h3 className="text-2xl lg:text-3xl font-bold font-display text-foreground mb-1">
              <span style={{ color: stat.color }}>{count.toLocaleString()}</span>
              <span className="text-foreground">{stat.suffix}</span>
            </h3>
            <p className="text-muted-foreground font-medium text-xs lg:text-sm">{stat.label}</p>
          </div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-40 animate-pulse" style={{ background: stat.color }} />
        <div className="absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full opacity-30 animate-pulse" style={{ background: stat.color, animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 right-6 w-1 h-1 rounded-full opacity-20 animate-pulse" style={{ background: stat.color, animationDelay: '1s' }} />
      </div>
    </div>
  );
};

const StatsSection = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" ref={sectionRef} className="py-12 lg:py-20 relative overflow-hidden">
      {/* Background with depth */}
      <div className="absolute inset-0 bg-muted/50" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      
      {/* Floating blobs for depth */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald/5 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <TrendingUp className="w-4 h-4" />
            Growing Every Day
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            Our <span className="text-gradient-gold">Impact</span> in Numbers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful learners who have transformed their careers and achieved financial independence.
          </p>
        </div>

        {/* Stats Grid with 3D Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <CircularStatCard 
              key={stat.label} 
              stat={stat} 
              index={index} 
              isInView={isInView} 
            />
          ))}
        </div>

        {/* Additional Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Award className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Industry Recognized Certificates</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Headphones className="w-6 h-6 text-accent" />
            <span className="text-sm font-medium">24/7 Expert Support</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Trophy className="w-6 h-6 text-emerald" />
            <span className="text-sm font-medium">Proven Success Track Record</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
