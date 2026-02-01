import React from "react";
import { useNavigate } from "react-router-dom";
import { X, AlertTriangle, ArrowRight, Sparkles, GraduationCap, Wallet, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentReminderPopupProps {
  planName: string;
  onClose: () => void;
}

const PaymentReminderPopup = React.forwardRef<HTMLDivElement, PaymentReminderPopupProps>(
  ({ planName, onClose }, ref) => {
    const navigate = useNavigate();

    const handleComplete = () => {
      navigate("/payment");
      onClose();
    };

    return (
      <div ref={ref} className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative glass-card-premium max-w-md w-full rounded-3xl overflow-hidden animate-scale-in border border-primary/20 shadow-glow-gold">
          {/* Header with gradient */}
          <div className="h-20 bg-gradient-to-r from-primary/30 via-gold-dark/20 to-primary/30 relative">
            <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
            <Sparkles className="absolute top-4 right-6 w-6 h-6 text-primary animate-pulse" />
            <Sparkles className="absolute top-8 left-8 w-4 h-4 text-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="p-6 pt-0 -mt-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow-gold mb-4 mx-auto">
              <AlertTriangle className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <h3 className="text-xl font-bold font-display text-center mb-2">
              Almost There! 🎯
            </h3>
            
            <p className="text-muted-foreground text-center text-sm mb-4">
              You're one step away from unlocking your full <span className="text-primary font-semibold">{planName}</span> dashboard and all the earning opportunities.
            </p>

            <div className="p-4 bg-muted/30 rounded-xl border border-border/50 mb-6">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Complete your payment to access:
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-1">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">All Courses</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center mx-auto mb-1">
                    <Wallet className="w-5 h-5 text-emerald" />
                  </div>
                  <p className="text-xs text-muted-foreground">7 Incomes</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-1">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-xs text-muted-foreground">Affiliate</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={handleComplete}
              >
                Complete Payment Now
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              <button
                onClick={onClose}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                I'll do it later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PaymentReminderPopup.displayName = "PaymentReminderPopup";

export default PaymentReminderPopup;
