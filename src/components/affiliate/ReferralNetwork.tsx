import { Link } from "react-router-dom";
import { GitBranch, Eye, Users, RefreshCw, UserCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReferralUser {
    id: string;
    full_name: string | null;
    email: string | null;
    has_purchased: boolean | null;
    purchased_plan: string | null;
    created_at: string;
}

interface ReferralNetworkProps {
    loading: boolean;
    referrals: ReferralUser[];
}

const ReferralNetwork = ({ loading, referrals }: ReferralNetworkProps) => {
    return (
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold font-display flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-accent" />
                    Your Referral Network
                </h2>
                <Link to="/dashboard/learners">
                    <Button variant="outline" size="sm" className="gap-1">
                        View All <Eye className="w-4 h-4" />
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
                </div>
            ) : referrals.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No referrals yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Share your referral link to start earning!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {referrals.slice(0, 5).map((referral) => (
                        <div
                            key={referral.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <span className="font-bold text-white">
                                        {referral.full_name?.charAt(0) || "U"}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium">{referral.full_name || "Unknown"}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Joined {new Date(referral.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${referral.has_purchased
                                    ? "bg-emerald/10 text-emerald border border-emerald/20"
                                    : "bg-primary/10 text-primary border border-primary/20"
                                    }`}>
                                    {referral.has_purchased ? (
                                        <>
                                            <UserCheck className="w-3 h-3" />
                                            {referral.purchased_plan || "Active"}
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-3 h-3" />
                                            Pending
                                        </>
                                    )}
                                </span>
                                {referral.has_purchased && (
                                    <p className="text-xs text-emerald mt-1 font-medium">+₹300</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReferralNetwork;
