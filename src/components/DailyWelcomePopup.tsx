import { useState, useEffect } from "react";
import { X, Sparkles, Gift, ArrowRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyWelcomePopupProps {
  userName: string;
  onClose: () => void;
}

const DailyWelcomePopup = ({ userName, onClose }: DailyWelcomePopupProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if popup was shown today
    const lastShown = localStorage.getItem('dailyPopupLastShown');
    const today = new Date().toDateString();
    
    if (lastShown !== today) {
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 500);
    } else {
      onClose();
    }
  }, [onClose]);

  const handleClose = () => {
    localStorage.setItem('dailyPopupLastShown', new Date().toDateString());
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 rounded-3xl blur-xl opacity-60 animate-pulse" />
        
        <div className="relative glass-card rounded-3xl p-6 lg:p-8 border border-primary/20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-gold opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-accent to-teal-dark opacity-10 rounded-full blur-2xl" />
          
          {/* Close button */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="text-center relative z-10">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-gold flex items-center justify-center shadow-lg shadow-primary/30 animate-bounce-slow">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>

            {/* Welcome message */}
            <h2 className="text-2xl font-bold font-display mb-2">
              Welcome Back, <span className="text-gradient-gold">{userName}!</span> 🎉
            </h2>
            <p className="text-muted-foreground mb-6">
              Great to see you again! Here's what's new today.
            </p>

            {/* Updates/Announcements */}
            <div className="space-y-3 mb-6">
              <UpdateItem 
                icon={Bell}
                title="New Course Added"
                description="AI Trading Strategies is now live!"
                color="text-primary"
              />
              <UpdateItem 
                icon={Gift}
                title="Special Offer"
                description="Refer 2 friends & get ₹500 bonus!"
                color="text-emerald"
              />
            </div>

            {/* CTA */}
            <Button variant="hero" size="lg" className="w-full" onClick={handleClose}>
              Let's Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdateItem = ({ 
  icon: Icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; 
  description: string;
  color: string;
}) => (
  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl text-left">
    <div className={`p-2 rounded-lg bg-card ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default DailyWelcomePopup;
