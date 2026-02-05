import { Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AffiliateHeroProps {
    monthlyEarnings: number;
    totalEarnings: number;
}

const AffiliateHero = ({ monthlyEarnings, totalEarnings }: AffiliateHeroProps) => {
    const { profile } = useAuth();

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-accent/10 p-6 lg:p-8 border border-primary/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full border border-primary/30 mb-4">
                        <Crown className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-primary">{profile?.purchased_plan || "Affiliate"} Partner</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold font-display mb-2">
                        Welcome back, <span className="text-gradient-gold">{profile?.full_name?.split(' ')[0] || "Partner"}</span>
                    </h1>
                    <p className="text-muted-foreground max-w-md">
                        Track your earnings, manage referrals, and grow your network
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="text-center p-4 bg-card/80 rounded-2xl border border-border/50 backdrop-blur-sm min-w-[120px]">
                        <p className="text-xs text-muted-foreground mb-1">This Month</p>
                        <p className="text-2xl font-bold text-emerald">₹{monthlyEarnings.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 bg-card/80 rounded-2xl border border-border/50 backdrop-blur-sm min-w-[120px]">
                        <p className="text-xs text-muted-foreground mb-1">Total Earned</p>
                        <p className="text-2xl font-bold text-primary">₹{totalEarnings.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AffiliateHero;
