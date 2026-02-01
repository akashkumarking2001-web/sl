import { Lock, ShoppingCart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LockedFeatureOverlayProps {
  title?: string;
  description?: string;
}

const LockedFeatureOverlay = ({ 
  title = "Feature Locked",
  description = "Purchase a membership plan to unlock affiliate features, referral links, and income dashboard."
}: LockedFeatureOverlayProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl">
      <div className="max-w-md mx-4 text-center">
        {/* Lock Icon */}
        <div className="relative mx-auto mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow-gold">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl md:text-3xl font-bold font-display mb-3">{title}</h1>
        <p className="text-muted-foreground mb-8">{description}</p>

        {/* Benefits List */}
        <div className="glass-card p-6 rounded-2xl mb-6 text-left">
          <h3 className="font-bold mb-4 text-center">🔓 Unlock These Features:</h3>
          <ul className="space-y-3">
            {[
              "Affiliate Dashboard & Referral Link",
              "7 Types of Income Streams",
              "Commission Tracking & Wallet",
              "Leaderboard & Achievements",
              "Task-Based Earnings",
              "Premium Support Access",
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ChevronRight className="w-3 h-3 text-primary" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate("/user-home")}>
            Go Back
          </Button>
          <Button variant="hero" onClick={() => navigate("/dashboard/courses")}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Membership Plans
          </Button>
        </div>

        {/* Payment Pending Notice */}
        <p className="text-xs text-muted-foreground mt-6">
          Already paid? Your payment is being verified by admin.
          <br />
          Access will be unlocked within 24 hours.
        </p>
      </div>
    </div>
  );
};

export default LockedFeatureOverlay;