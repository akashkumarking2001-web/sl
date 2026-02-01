import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  UserCheck,
  Wallet,
  TrendingUp,
  Copy,
  Check,
  ChevronRight,
  Star,
  Award,
  Target,
  Layers,
  PieChart,
  CheckSquare,
  ArrowDownRight,
  Zap,
  Crown,
  RefreshCw,
  GitBranch,
  ArrowUpRight,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AffiliateSidebar from "@/components/layout/AffiliateSidebar";
import LockedFeatureOverlay from "@/components/LockedFeatureOverlay";

interface ReferralUser {
  id: string;
  full_name: string | null;
  email: string | null;
  has_purchased: boolean | null;
  purchased_plan: string | null;
  created_at: string;
}

const AffiliateDashboard = () => {
  const [copied, setCopied] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const referralCode = profile?.referral_code || "LOADING...";
  const referralLink = `https://skilllearners.com/ref/${referralCode}`;

  // Fetch referrals (users who used this user's referral code)
  useEffect(() => {
    const fetchReferrals = async () => {
      if (!profile?.id) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email, has_purchased, purchased_plan, created_at")
          .eq("referred_by", profile.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReferrals(data || []);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
    setIsLocked(!profile?.has_purchased);
  }, [profile]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate stats
  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter(r => r.has_purchased).length;
  const pendingReferrals = referrals.filter(r => !r.has_purchased).length;

  // Real earnings fetching
  const [earningsData, setEarningsData] = useState({
    total: 0,
    monthly: 0,
    balance: 0
  });

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!profile?.id) return;

      try {
        // 1. Fetch Income
        const { data: incomeData, error: incomeError } = await (supabase as any)
          .from('agent_income')
          .select('amount, created_at')
          .eq('agent_id', profile.id);

        if (incomeError) {
          console.error("Error fetching income:", incomeError);
          // Fallback or just continue
        }

        const income = (incomeData as any[]) || [];
        const total = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const monthly = income
          .filter(item => item.created_at >= startOfMonth)
          .reduce((sum, item) => sum + Number(item.amount || 0), 0);

        // 2. Fetch Withdrawals to calculate balance
        const { data: withdrawData, error: withdrawError } = await supabase
          .from('withdrawal_requests')
          .select('amount, status')
          .eq('user_id', profile.id);

        if (withdrawError && withdrawError.code !== 'PGRST116') {
          console.error("Error fetching withdrawals:", withdrawError);
        }

        const withdrawals = (withdrawData as any[]) || [];
        // Subtract all requests except rejected ones? Or just approved?
        // Usually balance is locked once requested. So subtract Pending + Approved.
        // Only 'rejected' returns money to wallet (conceptually).
        const totalWithdrawn = withdrawals
          .filter(w => w.status !== 'rejected')
          .reduce((sum, w) => sum + Number(w.amount || 0), 0);

        setEarningsData({
          total,
          monthly,
          balance: total - totalWithdrawn
        });

      } catch (err) {
        console.error("Failed to fetch earnings data", err);
      }
    };

    fetchEarnings();
  }, [profile?.id]);

  // Use real data
  const totalEarnings = earningsData.total;
  const thisMonthEarnings = earningsData.monthly;
  const walletBalance = earningsData.balance;

  // Income Types with calculated data
  const incomeCards = [
    {
      icon: Users,
      label: "Referral Income",
      value: activeReferrals * 300,
      color: "from-[#FBBF24] to-[#D97706]",
      description: "Direct referral earnings"
    },
    {
      icon: Layers,
      label: "Level Income",
      value: Math.floor(activeReferrals * 150),
      color: "from-slate-900 to-slate-800",
      description: "Multi-level team earnings"
    },
    {
      icon: PieChart,
      label: "Revenue Share",
      value: Math.floor(activeReferrals * 100),
      color: "from-emerald-500 to-emerald-600",
      description: "Share in company profits"
    },
    {
      icon: CheckSquare,
      label: "Task Income",
      value: 0,
      color: "from-emerald-400 to-emerald-500",
      description: "Task completion rewards"
    },
    {
      icon: Zap,
      label: "Auto Upgrade",
      value: 0,
      color: "from-amber-400 to-amber-500",
      description: "Automatic upgrade bonuses"
    },
    {
      icon: ArrowDownRight,
      label: "Spillover Income",
      value: 0,
      color: "from-slate-700 to-slate-800",
      description: "Overflow from upline"
    },
  ];

  const stats = [
    { icon: Users, label: "Total Referrals", value: totalReferrals, color: "from-[#FBBF24] to-[#D97706]" },
    { icon: UserCheck, label: "Active Members", value: activeReferrals, color: "from-emerald-500 to-emerald-600" },
    { icon: UserPlus, label: "Pending", value: pendingReferrals, color: "from-slate-400 to-slate-500" },
    { icon: Wallet, label: "Wallet Balance", value: `₹${walletBalance.toLocaleString()}`, color: "from-[#FBBF24] via-[#FBBF24] to-[#D97706]" },
  ];

  const totalIncome = incomeCards.reduce((sum, card) => sum + card.value, 0);

  // Show locked overlay if user hasn't purchased
  if (isLocked) {
    return <LockedFeatureOverlay />;
  }

  return (
    <AffiliateSidebar>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Premium Hero Section */}
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
                <p className="text-2xl font-bold text-emerald">₹{thisMonthEarnings.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-card/80 rounded-2xl border border-border/50 backdrop-blur-sm min-w-[120px]">
                <p className="text-xs text-muted-foreground mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-primary">₹{totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-5 hover:border-primary/30 transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Income Streams Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Income Streams
            </h2>
            <p className="text-sm text-muted-foreground">
              Total: <span className="text-primary font-bold">₹{totalIncome.toLocaleString()}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {incomeCards.map((card) => (
              <div
                key={card.label}
                className="group relative overflow-hidden rounded-xl bg-card border border-border/50 p-4 hover:border-primary/30 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg font-bold">₹{card.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground font-medium truncate">{card.label}</p>
              </div>
            ))}
          </div>
        </div>

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
            <Button variant="hero" onClick={copyToClipboard} className="shrink-0">
              {copied ? (
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
                <Link to="/affiliate/leaderboard">
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
