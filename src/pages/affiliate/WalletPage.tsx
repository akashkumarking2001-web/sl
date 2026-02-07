import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  IndianRupee,
  Bitcoin,
  Building,
  CreditCard,
  Loader2,
  Lock,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AffiliateSidebar from "@/components/layout/AffiliateSidebar";

interface WalletHistory {
  id: string;
  created_at: string;
  amount: number;
  description: string;
  status: string;
}

interface WithdrawalRequest {
  id: string;
  created_at: string;
  amount: number;
  status: string | null;
  processed_at: string | null;
}

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState<"withdraw" | "history" | "withdrawals">("withdraw");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletHistory, setWalletHistory] = useState<WalletHistory[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRequest[]>([]);
  const { toast } = useToast();
  const { user, profile } = useAuth(); // Destructure profile
  const [hasPurchased, setHasPurchased] = useState(false);
  const navigate = useNavigate();

  const minWithdraw = 500;

  useEffect(() => {
    if (user) {
      fetchWalletData();
      checkPurchaseStatus();
    }
  }, [user, profile]); // Add profile to dependency

  const checkPurchaseStatus = () => {
    if (profile?.has_purchased) {
      setHasPurchased(true);
    }
  };

  const fetchWalletData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // 1. Calculate Balance directly from Income - Withdrawals
      const { data: incomeData } = await (supabase as any)
        .from("agent_income")
        .select("amount")
        .eq("agent_id", user.id); // Assuming agent_id maps to user.id

      const income = (incomeData as any[]) || [];
      const totalEarned = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);

      const { data: withdrawData } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const withdrawals = (withdrawData as any[]) || [];
      const totalWithdrawn = withdrawals
        .filter(w => w.status !== 'rejected')
        .reduce((sum, w) => sum + Number(w.amount || 0), 0);

      setWalletBalance(totalEarned - totalWithdrawn);
      setWithdrawalHistory(withdrawals);

      // Fetch wallet history (if used for other logs)
      const { data: historyData } = await supabase
        .from("wallet_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      setWalletHistory(historyData || []);

    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
    setLoading(false);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);

    if (!user) {
      toast({ title: "Error", description: "Please login to request withdrawal", variant: "destructive" });
      return;
    }

    if (amount < minWithdraw) {
      toast({ title: "Error", description: `Minimum withdrawal is ₹${minWithdraw}`, variant: "destructive" });
      return;
    }
    if (amount > walletBalance) {
      toast({ title: "Error", description: "Insufficient balance", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user's bank details
      const { data: bankDetails } = await supabase
        .from("bank_accounts" as any)
        .select("*")
        .eq("user_id", user.id)
        .single();

      // Create withdrawal request
      const { error } = await supabase
        .from("withdrawal_requests")
        .insert({
          user_id: user.id,
          amount: amount,
          status: "pending",
          bank_details: bankDetails ? {
            bank_name: (bankDetails as any).bank_name,
            account_number: (bankDetails as any).account_number,
            ifsc_code: (bankDetails as any).ifsc_code,
            account_holder: (bankDetails as any).account_holder,
            upi_id: (bankDetails as any).upi_id,
            method: withdrawMethod,
          } : { method: withdrawMethod },
        });

      if (error) throw error;

      toast({
        title: "Withdrawal Requested!",
        description: `₹${amount} will be processed within 24-48 hours.`
      });
      setWithdrawAmount("");
      fetchWalletData();
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      toast({ title: "Error", description: "Failed to submit withdrawal request", variant: "destructive" });
    }

    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <AffiliateSidebar>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AffiliateSidebar>
    );
  }

  if (!hasPurchased && !loading) {
    return (
      <AffiliateSidebar>
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 animate-pulse shadow-glow-gold">
            <Lock className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-4">Wallet Restricted</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 font-medium leading-relaxed">
            Your Affiliate Wallet is currently locked. To activate your earning account and access withdrawals, you must purchase a <span className="text-primary font-bold">Combo Package</span> from the Academy.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <Button onClick={() => navigate("/plans")} className="h-14 rounded-2xl bg-primary text-black font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Package className="w-4 h-4 mr-2" />
              View Packages
            </Button>
            <Button variant="outline" onClick={() => navigate("/user-home")} className="h-14 rounded-2xl border-white/10 font-bold text-sm bg-white/5 hover:bg-white/10 active:scale-95 transition-all">
              Dashboard
            </Button>
          </div>
        </div>
      </AffiliateSidebar>
    );
  }

  return (
    <AffiliateSidebar>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 lg:p-8 rounded-3xl mb-6 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold font-display mb-2">Wallet Management</h1>
              <p className="text-muted-foreground">Withdraw earnings & view transaction history</p>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-2xl border border-border/50">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-3xl font-bold text-gradient-gold">₹{walletBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-xl w-fit">
          <Button
            variant={activeTab === "withdraw" ? "hero" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("withdraw")}
          >
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Withdraw
          </Button>
          <Button
            variant={activeTab === "history" ? "hero" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("history")}
          >
            <ArrowDownLeft className="w-4 h-4 mr-1" />
            Wallet History
          </Button>
          <Button
            variant={activeTab === "withdrawals" ? "hero" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("withdrawals")}
          >
            <Clock className="w-4 h-4 mr-1" />
            Withdrawals
          </Button>
        </div>

        {/* Withdraw Form */}
        {activeTab === "withdraw" && (
          <div className="glass-card p-6 rounded-3xl">
            <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Withdraw Money
            </h2>

            <form onSubmit={handleWithdraw} className="space-y-6">
              {/* Amount */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Amount to Withdraw</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="pl-10 h-12 text-lg"
                    min={minWithdraw}
                    max={walletBalance}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum: ₹{minWithdraw} | Available: ₹{walletBalance.toLocaleString()}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Payment Method</Label>
                <RadioGroup value={withdrawMethod} onValueChange={setWithdrawMethod} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className={`glass-card p-4 rounded-xl cursor-pointer transition-all ${withdrawMethod === "bank" ? "ring-2 ring-[#FBBF24] bg-[#FBBF24]/5" : ""}`}>
                    <RadioGroupItem value="bank" className="sr-only" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FBBF24]/10 flex items-center justify-center">
                        <Building className="w-5 h-5 text-[#FBBF24]" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Bank Transfer</p>
                        <p className="text-xs text-muted-foreground">INR</p>
                      </div>
                    </div>
                  </label>

                  <label className={`glass-card p-4 rounded-xl cursor-pointer transition-all ${withdrawMethod === "upi" ? "ring-2 ring-[#FBBF24] bg-[#FBBF24]/5" : ""}`}>
                    <RadioGroupItem value="upi" className="sr-only" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">UPI</p>
                        <p className="text-xs text-muted-foreground">INR</p>
                      </div>
                    </div>
                  </label>

                  <label className={`glass-card p-4 rounded-xl cursor-pointer transition-all ${withdrawMethod === "usdt" ? "ring-2 ring-primary" : ""}`}>
                    <RadioGroupItem value="usdt" className="sr-only" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Bitcoin className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">USDT (TRC20)</p>
                        <p className="text-xs text-muted-foreground">Crypto</p>
                      </div>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full h-12" disabled={isSubmitting || walletBalance < minWithdraw}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                    Request Withdrawal
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Withdrawals are processed within 24-48 hours during business days.
            </p>
          </div>
        )}

        {/* Wallet History */}
        {activeTab === "history" && (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold font-display">Wallet Transaction History</h2>
            </div>
            <div className="divide-y divide-border/50">
              {walletHistory.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No transaction history yet
                </div>
              ) : (
                walletHistory.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.status === 'credit' ? 'bg-emerald-500/10' : 'bg-destructive/10'
                        }`}>
                        {txn.status === 'credit' ? (
                          <ArrowDownLeft className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{txn.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(txn.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${txn.status === 'credit' ? 'text-emerald-500' : 'text-destructive'}`}>
                        {txn.status === 'credit' ? '+' : '-'}₹{Math.abs(txn.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Withdrawal History */}
        {activeTab === "withdrawals" && (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold font-display">Withdrawal Requests</h2>
            </div>
            <div className="divide-y divide-border/50">
              {withdrawalHistory.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No withdrawal requests yet
                </div>
              ) : (
                withdrawalHistory.map((wd) => (
                  <div key={wd.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${wd.status === 'approved' ? 'bg-emerald-500/10' :
                        wd.status === 'rejected' ? 'bg-destructive/10' : 'bg-primary/10'
                        }`}>
                        {wd.status === 'approved' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">₹{wd.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Requested: {new Date(wd.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${wd.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : wd.status === 'rejected'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-primary/10 text-primary'
                        }`}>
                        {wd.status || 'pending'}
                      </span>
                      {wd.processed_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Processed: {new Date(wd.processed_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </AffiliateSidebar>
  );
};

export default WalletPage;
