import { useEffect, useState, useRef } from "react";

interface CircularProgressProps {
  value: number;
  maxValue: number;
  suffix?: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const CircularProgress = ({ value, maxValue, suffix = "", label, color, icon }: CircularProgressProps) => {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const percentage = (value / maxValue) * 100;
  const strokeWidth = 8;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;
    const duration = 2000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, isInView]);

  const strokeDashoffset = circumference - (isInView ? (percentage / 100) * circumference : circumference);

  return (
    <div ref={ref} className="relative group">
      {/* 3D Card Effect */}
      <div className="glass-card p-6 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated relative overflow-hidden">
        {/* Glowing border effect */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${color}20, transparent, ${color}10)`,
            padding: '2px',
          }}
        />
        
        <div className="relative flex flex-col items-center">
          {/* SVG Circle */}
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              {/* Background circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-muted/30"
              />
              {/* Progress circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-[2000ms] ease-out"
                style={{
                  filter: `drop-shadow(0 0 10px ${color}80)`,
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
              >
                {icon}
              </div>
            </div>
          </div>
          
          {/* Value */}
          <div className="text-center">
            <h3 className="text-3xl lg:text-4xl font-bold font-display text-foreground mb-1">
              {count.toLocaleString()}{suffix}
            </h3>
            <p className="text-muted-foreground font-medium">{label}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
