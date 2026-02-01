import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentReminderBarProps {
  planName: string;
  onClose: () => void;
}

const PaymentReminderBar = React.forwardRef<HTMLDivElement, PaymentReminderBarProps>(
  ({ planName, onClose }, ref) => {
    const navigate = useNavigate();

    return (
      <div 
        ref={ref}
        className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary/90 via-gold-dark/90 to-primary/90 backdrop-blur-sm border-b border-primary/30 shadow-glow-gold"
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <AlertCircle className="w-5 h-5 text-primary-foreground shrink-0" />
            <p className="text-sm font-medium text-primary-foreground truncate">
              🔓 Final Step: Complete your payment to unlock your <span className="font-bold">{planName}</span> dashboard
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => navigate("/payment")}
              className="bg-card/90 hover:bg-card text-foreground"
            >
              Complete Payment
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-card/20 transition-colors"
            >
              <X className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

PaymentReminderBar.displayName = "PaymentReminderBar";

export default PaymentReminderBar;
