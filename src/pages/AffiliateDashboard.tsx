import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Copy,
  Check,
  Star,
  Award,
  Target,
  Layers,
  PieChart,
  CheckSquare,
  ArrowDownRight,
  Zap,
  Crown,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useClipboard } from "@/hooks/useClipboard";
import { useAffiliateData } from "@/hooks/useAffiliateData";
import AffiliateSidebar from "@/components/layout/AffiliateSidebar";
import LockedFeatureOverlay from "@/components/LockedFeatureOverlay";
import AffiliateHero from "@/components/affiliate/AffiliateHero";
import AffiliateStats from "@/components/affiliate/AffiliateStats";
import IncomeStreams from "@/components/affiliate/IncomeStreams";
import ReferralNetwork from "@/components/affiliate/ReferralNetwork";

const AffiliateDashboard = () => {
  const { profile } = useAuth();
  const { copy, hasCopied } = useClipboard();
  const { loading, referrals, earnings } = useAffiliateData();

  const referralCode = profile?.referral_code || "LOADING...";
  const referralLink = `https://skilllearners.com/ref/${referralCode}`;

  // Calculate stats
  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter(r => r.has_purchased).length;
  const pendingReferrals = referrals.filter(r => !r.has_purchased).length;

  // Income Types with calculated data
  const incomeCards = [
    {
      icon: Users,
      label: "Referral Income",
      value: activeReferrals * 300,
      color: "from-[#FBBF24] to-[#D97706]",
    },
    {
      icon: Layers,
      label: "Level Income",
      value: Math.floor(activeReferrals * 150),
      color: "from-slate-900 to-slate-800",
    },
    {
      icon: PieChart,
      label: "Revenue Share",
      value: Math.floor(activeReferrals * 100),
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: CheckSquare,
      label: "Task Income",
      value: 0,
      color: "from-emerald-400 to-emerald-500",
    },
    {
      icon: Zap,
      label: "Auto Upgrade",
      value: 0,
      color: "from-amber-400 to-amber-500",
    },
    {
      icon: ArrowDownRight,
      label: "Spillover Income",
      value: 0,
      color: "from-slate-700 to-slate-800",
    },
  ];

  const totalIncome = incomeCards.reduce((sum, card) => sum + card.value, 0);

  // Show locked overlay if user hasn't purchased
  if (!profile?.has_purchased) {
    return (
      <AffiliateSidebar>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LockedFeatureOverlay inLayout={true} />
        </div>
      </AffiliateSidebar>
    );
  }

  return (
    <AffiliateSidebar>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section */}
        <AffiliateHero
          monthlyEarnings={earnings.monthly}
          totalEarnings={earnings.total}
        />

        {/* Stats Grid */}
        <AffiliateStats
          referralsCount={totalReferrals}
          activeCount={activeReferrals}
          pendingCount={pendingReferrals}
          walletBalance={earnings.balance}
        />

        {/* Income Streams */}
        <IncomeStreams incomeCards={incomeCards} totalIncome={totalIncome} />

        {/* Referral Link Card */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-card to-accent/10 border border-primary/20 p-6">
          <h2 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
            <Copy className="w-5 h-5 text-primary" />
            Your Referral Link
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-card/80 rounded-xl p-4 flex items-center border border-border/50 backdrop-blur-sm">
              <code className="text-sm flex-1 truncate font-mono">{referralLink}</code>
            </div>
            <Button
              variant="hero"
              onClick={() => copy(referralLink, "Referral link")}
              className="shrink-0"
            >
              {hasCopied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Link
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Referral Code: <code className="bg-card px-2 py-1 rounded text-primary font-bold">{referralCode}</code>
          </p>
        </div>

        {/* Referral Network / Tree Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Referrals List */}
          <ReferralNetwork loading={loading} referrals={referrals} />

          {/* Quick Actions & Achievements */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-2xl bg-card border border-border/50 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link to="/dashboard/wallet">
                  <Button variant="outline" className="w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Wallet
                    </span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link to="/dashboard/income/referral">
                  <Button variant="outline" className="w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Income Report
                    </span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link to="/dashboard/leaderboard">
                  <Button variant="outline" className="w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Leaderboard
                    </span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="rounded-2xl bg-card border border-border/50 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Achievements
              </h3>
              <div className="space-y-3">
                {[
                  { title: "First Referral", unlocked: referrals.length >= 1, icon: Star },
                  { title: "5 Referrals", unlocked: referrals.length >= 5, icon: Target },
                  { title: "First Sale", unlocked: activeReferrals >= 1, icon: TrendingUp },
                ].map((achievement) => (
                  <div
                    key={achievement.title}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${achievement.unlocked ? "bg-primary/5 border border-primary/20" : "bg-muted/30"
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${achievement.unlocked
                      ? "bg-gradient-to-br from-primary to-accent"
                      : "bg-muted"
                      }`}>
                      <achievement.icon className={`w-4 h-4 ${achievement.unlocked ? "text-white" : "text-muted-foreground"
                        }`} />
                    </div>
                    <p className="text-sm font-medium flex-1">{achievement.title}</p>
                    {achievement.unlocked && (
                      <Check className="w-4 h-4 text-emerald" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Royal Bonus Teaser */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border-2 border-dashed border-primary/30 p-6 text-center">
              <Crown className="w-10 h-10 text-primary mx-auto mb-2" />
              <h3 className="font-bold text-primary">Royal Bonus</h3>
              <p className="text-xs text-muted-foreground mt-1">Coming Soon!</p>
            </div>
          </div>
        </div>
      </div>
    </AffiliateSidebar>
  );
};

export default AffiliateDashboard;
