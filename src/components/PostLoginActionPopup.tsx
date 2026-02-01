import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Wallet, 
  Users, 
  Crown,
  Star,
  Gem,
  Trophy,
  CheckCircle,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface PlanInfo {
  name: string;
  displayName: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  price: string;
}

const planDetails: Record<string, PlanInfo> = {
  SPARK: { name: "SPARK", displayName: "Spark", icon: Star, color: "from-orange-500 to-rose-600", price: "₹2,999" },
  MOMENTUM: { name: "MOMENTUM", displayName: "Momentum", icon: Sparkles, color: "from-cyan-500 to-blue-600", price: "₹5,999" },
  SUMMIT: { name: "SUMMIT", displayName: "Summit", icon: Crown, color: "from-emerald-500 to-teal-600", price: "₹9,999" },
  TITAN: { name: "TITAN", displayName: "Titan", icon: Gem, color: "from-amber-500 to-yellow-500", price: "₹14,999" },
  LEGACY: { name: "LEGACY", displayName: "Legacy", icon: Trophy, color: "from-violet-600 to-purple-700", price: "₹24,999" },
};

interface PostLoginActionPopupProps {
  onClose: () => void;
}

const PostLoginActionPopup = React.forwardRef<HTMLDivElement, PostLoginActionPopupProps>(
  ({ onClose }, ref) => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"plan" | "course" | "generic">("generic");

    useEffect(() => {
      // Check sessionStorage for selected plan or course
      const storedPlan = sessionStorage.getItem("selectedPlan");
      const storedCourse = sessionStorage.getItem("selectedCourse");
      
      if (storedPlan && planDetails[storedPlan]) {
        setSelectedPlan(planDetails[storedPlan]);
        setActionType("plan");
      } else if (storedCourse) {
        setSelectedCourse(storedCourse);
        setActionType("course");
      } else if (profile?.purchased_plan && !profile?.has_purchased) {
        // User has a plan in profile but hasn't paid
        const plan = planDetails[profile.purchased_plan];
        if (plan) {
          setSelectedPlan(plan);
          setActionType("plan");
        }
      }
    }, [profile]);

    const handleCompletePayment = () => {
      // Clear session storage
      sessionStorage.removeItem("selectedPlan");
      sessionStorage.removeItem("selectedCourse");
      navigate("/payment");
      onClose();
    };

    const handleBrowsePlans = () => {
      navigate("/dashboard/courses");
      onClose();
    };

    const PlanIcon = selectedPlan?.icon || Star;

    return (
      <div ref={ref} className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/90 backdrop-blur-md"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative glass-card-premium max-w-lg w-full rounded-3xl overflow-hidden animate-scale-in border border-primary/30 shadow-glow-gold">
          {/* Header with gradient */}
          <div className={`h-28 relative overflow-hidden ${
            selectedPlan 
              ? `bg-gradient-to-r ${selectedPlan.color}` 
              : "bg-gradient-to-r from-primary/40 via-gold-dark/30 to-primary/40"
          }`}>
            <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/80" />
            
            {/* Floating sparkles */}
            <Sparkles className="absolute top-4 right-8 w-6 h-6 text-white/60 animate-pulse" />
            <Sparkles className="absolute top-10 left-10 w-4 h-4 text-white/40 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="absolute bottom-8 right-16 w-5 h-5 text-white/50 animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Icon */}
            <div className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl ${
                selectedPlan 
                  ? `bg-gradient-to-br ${selectedPlan.color}` 
                  : "bg-gradient-gold"
              }`}>
                {actionType === "course" ? (
                  <GraduationCap className="w-10 h-10 text-white" />
                ) : (
                  <PlanIcon className="w-10 h-10 text-white" />
                )}
              </div>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="p-6 pt-14">
            {actionType === "plan" && selectedPlan ? (
              <>
                <h3 className="text-2xl font-bold font-display text-center mb-2">
                  Almost There! 🎯
                </h3>
                <p className="text-muted-foreground text-center text-sm mb-2">
                  You selected the
                </p>
                <div className="text-center mb-4">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${selectedPlan.color} text-white font-bold text-lg shadow-lg`}>
                    <PlanIcon className="w-5 h-5" />
                    {selectedPlan.name} Package
                  </span>
                  <p className="text-2xl font-bold text-gradient-gold mt-2">{selectedPlan.price}</p>
                </div>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Complete your payment to unlock all courses and start earning!
                </p>
              </>
            ) : actionType === "course" && selectedCourse ? (
              <>
                <h3 className="text-2xl font-bold font-display text-center mb-2">
                  Ready to Start Learning? 📚
                </h3>
                <p className="text-muted-foreground text-center text-sm mb-4">
                  Complete your enrollment for
                </p>
                <div className="text-center mb-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent to-teal-dark text-white font-bold text-lg shadow-lg">
                    <GraduationCap className="w-5 h-5" />
                    {selectedCourse}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Choose a package to access this course and unlock all premium features!
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold font-display text-center mb-2">
                  Welcome Back! 🎉
                </h3>
                <p className="text-muted-foreground text-center text-sm mb-6">
                  Complete your enrollment to unlock all courses and earning opportunities.
                </p>
              </>
            )}

            {/* Benefits Preview */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border/50 mb-6">
              <p className="text-xs text-muted-foreground text-center mb-3 font-medium">
                {actionType === "plan" ? "Your package includes:" : "With any package, you get:"}
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Premium Courses</p>
                </div>
                <div className="text-center group">
                  <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald/20 transition-colors">
                    <Wallet className="w-6 h-6 text-emerald" />
                  </div>
                  <p className="text-xs text-muted-foreground">7 Income Types</p>
                </div>
                <div className="text-center group">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-accent/20 transition-colors">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-xs text-muted-foreground">Affiliate Program</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={handleCompletePayment}
              >
                {actionType === "plan" ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-1" />
                    Complete Payment Now
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-1" />
                    Choose a Package
                  </>
                )}
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
              
              {actionType !== "plan" && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={handleBrowsePlans}
                >
                  Browse All Packages
                </Button>
              )}
              
              <button
                onClick={onClose}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center py-2"
              >
                I'll complete this later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PostLoginActionPopup.displayName = "PostLoginActionPopup";

export default PostLoginActionPopup;
