import { useState, useEffect } from "react";
import ShoppingSidebar from "@/components/layout/ShoppingSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, History, Banknote, Landmark, Loader2, AlertCircle, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";

const ShoppingWalletPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [income, setIncome] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [totals, setTotals] = useState({ cashback: 0, commission: 0, spent: 0 });
    const [pending, setPending] = useState({ cashback: 0, commission: 0 });

    // Withdrawal State
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [bankDetails, setBankDetails] = useState({ holder: "", account: "", bank: "", ifsc: "" });

    useEffect(() => {
        if (user) {
            fetchWalletData();
        }
    }, [user]);

    const fetchWalletData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Agent Income for Balance
            const { data: inc } = await supabase.from("agent_income").select("*").eq("user_id", user?.id).maybeSingle();
            setIncome(inc);

            // Still fetch profile for basic info if needed
            const { data: prof } = await supabase.from("profiles").select("*").eq("user_id", user?.id).maybeSingle();
            setProfile(prof);

            // 2. Fetch History
            const { data: hist, error: histErr } = await supabase
                .from("wallet_history")
                .select("*")
                .eq("user_id", user?.id)
                .order("created_at", { ascending: false });

            if (histErr) throw histErr;
            setHistory(hist || []);

            // 3. Calculate Totals
            const calc = (hist || []).reduce((acc: any, curr: any) => {
                const amt = Number(curr.amount);
                if (curr.income_type === 'cashback') acc.cashback += amt;
                else if (curr.income_type === 'affiliate_commission') acc.commission += amt;
                else if (curr.status === 'debit') acc.spent += amt;
                return acc;
            }, { cashback: 0, commission: 0, spent: 0 });
            setTotals(calc);

            // 4. Fetch Pending Earnings (Shopping Orders not yet delivered)
            // A. Cashback for the user
            const { data: pendingOrders } = await supabase
                .from("shopping_orders")
                .select("cashback_amount")
                .eq("user_id", user?.id)
                .in("status", ["pending", "confirmed", "shipping"]);

            // B. Commissions for the affiliate
            const { data: pendingCommissions } = await supabase
                .from("shopping_orders")
                .select("affiliate_commission")
                .eq("affiliate_user_id", user?.id)
                .in("status", ["pending", "confirmed", "shipping"]);

            setPending({
                cashback: (pendingOrders || []).reduce((sum, o) => sum + (Number(o.cashback_amount) || 0), 0),
                commission: (pendingCommissions || []).reduce((sum, o) => sum + (Number(o.affiliate_commission) || 0), 0)
            });

        } catch (error: any) {
            console.error("Wallet Fetch Error:", error);
            toast({ title: "Error", description: "Failed to load wallet data.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        const amount = Number(withdrawAmount);
        if (isNaN(amount) || amount <= 0) return toast({ title: "Invalid Amount" });
        if (amount > (income?.wallet || 0)) return toast({ title: "Insufficient Balance" });
        if (!bankDetails.account || !bankDetails.ifsc) return toast({ title: "Missing Details", description: "Please enter bank account and IFSC." });

        setWithdrawing(true);
        try {
            const { error } = await supabase.from("withdrawal_requests").insert({
                user_id: user?.id,
                amount: amount,
                status: 'pending',
                bank_details: bankDetails as any,
                payment_method: 'bank_transfer'
            });

            if (error) throw error;

            toast({ title: "Request Submitted", description: "Your withdrawal request is pending approval." });
            setIsWithdrawOpen(false);
            setWithdrawAmount("");
            // Optionally refresh or deduct locally? Better to wait for admin approval as per standard flow.
        } catch (error: any) {
            toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
        } finally {
            setWithdrawing(false);
        }
    };

    const Content = () => (
        <div className="container mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Shopping Wallet</h1>
                    <p className="text-muted-foreground font-medium">Earn cashback and commissions from every sale.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1 md:flex-none font-bold gap-2 rounded-xl h-11 border-slate-200">
                                <Banknote className="w-4 h-4" /> Withdraw
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Withdraw Earnings</DialogTitle>
                                <DialogDescription>Transfer your wallet balance to your bank account.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <p className="text-xs font-bold text-primary uppercase mb-1">Available Balance</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">₹{income?.wallet?.toLocaleString() || '0'}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Withdrawal Amount (₹)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Min ₹500"
                                        value={withdrawAmount}
                                        onChange={e => setWithdrawAmount(e.target.value)}
                                        className="h-12 rounded-xl"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>Account Holder</Label>
                                        <Input value={bankDetails.holder} onChange={e => setBankDetails({ ...bankDetails, holder: e.target.value })} placeholder="Name" className="h-10 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Bank Name</Label>
                                        <Input value={bankDetails.bank} onChange={e => setBankDetails({ ...bankDetails, bank: e.target.value })} placeholder="HDFC, SBI..." className="h-10 rounded-xl" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>Account Number</Label>
                                        <Input value={bankDetails.account} onChange={e => setBankDetails({ ...bankDetails, account: e.target.value })} placeholder="Number" className="h-10 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>IFSC Code</Label>
                                        <Input value={bankDetails.ifsc} onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value })} placeholder="IFSC" className="h-10 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="w-full h-12 rounded-xl font-bold bg-primary text-primary-foreground" onClick={handleWithdraw} disabled={withdrawing}>
                                    {withdrawing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Request Payout"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button className="flex-1 md:flex-none bg-[#FBBF24] text-black hover:bg-[#FBBF24]/90 font-bold gap-2 rounded-xl h-11">
                        <CreditCard className="w-4 h-4" /> Add Funds
                    </Button>
                </div>
            </div>

            {/* Balance Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-slate-900 dark:bg-slate-950 text-white border-0 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBF24]/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#FBBF24]/30 transition-all" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Current Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black mb-4 flex items-baseline gap-1">
                            <span className="text-lg text-[#FBBF24]">₹</span>
                            {income?.wallet?.toLocaleString() || '0.00'}
                        </div>
                        <div className="flex gap-2 text-[10px] uppercase font-bold tracking-wider">
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md">Real-time Sync</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ArrowDownLeft className="w-4 h-4 text-emerald-500" /> Affiliate Commission
                            </div>
                            {pending.commission > 0 && (
                                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 px-2 py-0.5 rounded-full animate-pulse">
                                    Pending: ₹{pending.commission.toLocaleString()}
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">₹{totals.commission.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Earnings from referral sales</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-primary" /> Shopping Cashback
                            </div>
                            {pending.cashback > 0 && (
                                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 px-2 py-0.5 rounded-full animate-pulse">
                                    Pending: ₹{pending.cashback.toLocaleString()}
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">₹{(totals.cashback || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Reward points from buying</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-rose-500" /> Total Spent
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">₹{totals.spent.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">On products & purchases</p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        Wallet History
                    </CardTitle>
                    <CardDescription>View all your earnings and spendings.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                    ) : history.length > 0 ? (
                        <div className="space-y-3">
                            {history.map((tx) => (
                                <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                        <div className={`p-3 rounded-xl ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30'}`}>
                                            {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">{tx.description}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase">{new Date(tx.created_at).toLocaleDateString()}</span>
                                                {tx.income_type && (
                                                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-black text-slate-500 uppercase tracking-tighter">
                                                        {tx.income_type.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                                        <span className={`font-black text-base ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                            {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                                        </span>
                                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold ml-2 sm:ml-0 sm:mt-1 capitalize">
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                            <Wallet className="w-12 h-12 mx-auto mb-4 opacity-10" />
                            <p className="text-slate-500 font-bold">No transactions found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div >
    );

    if (user) {
        return (
            <ShoppingSidebar>
                <div className="pt-20">
                    <Content />
                </div>
            </ShoppingSidebar>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pt-20">
            <Navbar />
            <Content />
        </div>
    );
};

export default ShoppingWalletPage;
