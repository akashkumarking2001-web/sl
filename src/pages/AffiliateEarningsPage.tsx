import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    TrendingUp,
    Users,
    DollarSign,
    Copy,
    CheckCircle2,
    Clock,
    XCircle,
    Link as LinkIcon,
    Search,
    BarChart3,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const AffiliateEarningsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string | null>(null);
    const [stats, setStats] = useState({
        clicks: 0,
        earnings: 0,
        conversions: 0
    });
    const [recentClicks, setRecentClicks] = useState<any[]>([]);
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [generatedLink, setGeneratedLink] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (user) {
            checkStatusAndLoadData();
        } else if (!loading) { // Wait for auth load
            // navigate('/login'); // Handled by auth guard usually, but safe to leave
        }
    }, [user]);

    const checkStatusAndLoadData = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // 1. Check Application Status
            const { data: appData, error: appError } = await supabase
                .from("affiliate_applications")
                .select("status")
                .eq("user_id", user.id)
                .maybeSingle();

            if (!appData) {
                // No application found
                navigate("/affiliate-program");
                return;
            }

            setStatus(appData.status);

            if (appData.status === "approved") {
                await loadDashboardData();
            }

        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDashboardData = async () => {
        if (!user) return;

        // 1. Get Referral Code (from any existing link or generate generic)
        // Ideally we have a user-level code, but the system generates per-product links.
        // Let's check 'affiliate_links' for any link to get the code pattern if it's constant per user.
        // Actually, the plan says "Stores referral code in session". 
        // Let's look at recent clicks to get stats.

        // Get Stats: Clicks
        const { count: clicksCount } = await supabase
            .from("affiliate_clicks")
            .select("*", { count: 'exact', head: true })
            .eq("affiliate_id", user.id);

        // Get Stats: Earnings (from wallet_history) 
        // Assuming there's a reference_type for affiliate commissions
        const { data: earningsData } = await supabase
            .from("wallet_history")
            .select("amount")
            .eq("user_id", user.id)
            .eq("reference_type", "affiliate_commission");

        const totalEarnings = earningsData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

        // Get Stats: Conversions (approximate based on earnings count for now)
        const conversionsCount = earningsData?.length || 0;

        setStats({
            clicks: clicksCount || 0,
            earnings: totalEarnings,
            conversions: conversionsCount
        });

        // Get Recent Clicks
        const { data: clicksData } = await supabase
            .from("affiliate_clicks")
            .select("created_at, product_id, products(name)")
            .eq("affiliate_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);

        setRecentClicks(clicksData || []);

        // Load Products for Link Generator
        const { data: productsData } = await supabase
            .from("products")
            .select("id, name, slug, image_url, price")
            .eq("is_active", true)
            .order("created_at", { ascending: false }); // Get recent ones

        setProducts(productsData || []);
    };

    const handleGenerateLink = async (product: any) => {
        if (!user) return;

        try {
            // Call database function to create link
            const { data, error } = await supabase
                .rpc("create_affiliate_link", {
                    p_user_id: user.id,
                    p_product_id: product.id
                });

            if (error) throw error;

            // Fetch the code
            const { data: linkData } = await supabase
                .from("affiliate_links")
                .select("referral_code")
                .eq("user_id", user.id)
                .eq("product_id", product.id)
                .single();

            if (linkData) {
                const link = `${window.location.origin}/product/${product.slug}?ref=${linkData.referral_code}`;
                setGeneratedLink(link);
                setSelectedProduct(product);
                setShowLinkDialog(true);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to generate link.",
                variant: "destructive"
            });
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        toast({ title: "Copied!", description: "Link copied to clipboard." });
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (status === "pending") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Application Pending</h1>
                        <p className="text-muted-foreground mb-8">
                            Your affiliate application is currently being reviewed by our team.
                            This usually takes 24-48 hours. We'll notify you via email once approved.
                        </p>
                        <Button variant="outline" onClick={() => navigate("/shopping")}>
                            Browse Store Meanwhile
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (status === "rejected") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Application Declined</h1>
                        <p className="text-muted-foreground mb-8">
                            Unfortunately, your affiliate application was not approved at this time.
                            You can re-apply after 30 days if you believe this was a mistake.
                        </p>
                        <Button onClick={() => navigate("/contact")}>
                            Contact Support
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [bankDetails, setBankDetails] = useState({
        accountName: "",
        accountNumber: "",
        ifsc: "",
        bankName: ""
    });
    const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);

    const handleWithdrawRequest = async () => {
        if (!user) return;
        const amount = Number(withdrawAmount);

        if (isNaN(amount) || amount <= 0) {
            toast({ title: "Invalid Amount", description: "Please enter a valid amount.", variant: "destructive" });
            return;
        }

        if (amount > stats.earnings) {
            // Ideally this should check 'available wallet balance' from agent_income, 
            // but stats.earnings is currently summed from history. 
            // Let's assume stats.earnings is roughly the balance or fetch exact balance.
            // Better to fetch exact balance for validation.
        }

        if (amount < 500) {
            toast({ title: "Minimum Withdrawal", description: "Minimum withdrawal amount is ₹500.", variant: "destructive" });
            return;
        }

        if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.ifsc) {
            toast({ title: "Missing Details", description: "Please provide all bank details.", variant: "destructive" });
            return;
        }

        setSubmittingWithdrawal(true);
        try {
            // 1. Verify Balance (Strict Check)
            const { data: incomeData } = await supabase
                .from("agent_income")
                .select("wallet")
                .eq("user_id", user.id)
                .single();

            const currentBalance = Number(incomeData?.wallet || 0);
            if (amount > currentBalance) {
                toast({
                    title: "Insufficient Balance",
                    description: `Your available balance is ₹${currentBalance}`,
                    variant: "destructive"
                });
                setSubmittingWithdrawal(false);
                return;
            }

            // 2. Submit Request
            const { error } = await supabase
                .from("withdrawal_requests")
                .insert({
                    user_id: user.id,
                    amount: amount,
                    status: "pending",
                    bank_details: bankDetails, // Store as JSON
                    request_date: new Date().toISOString()
                });

            if (error) throw error;

            toast({
                title: "Withdrawal Requested",
                description: "Your request has been submitted for approval.",
            });
            setShowWithdrawDialog(false);
            setWithdrawAmount("");

        } catch (error: any) {
            console.error("Withdrawal Error:", error);
            toast({ title: "Error", description: error.message || "Failed to submit request.", variant: "destructive" });
        } finally {
            setSubmittingWithdrawal(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                            Affiliate Dashboard
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-sm py-1">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground">
                            Track your performance and generate links to start earning.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="glass-card p-6 border-primary/20 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-emerald-500" />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border-emerald-200"
                                onClick={() => setShowWithdrawDialog(true)}
                            >
                                Withdraw
                            </Button>
                        </div>
                        <div className="text-3xl font-black mb-1">₹{stats.earnings.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Available Balance</p>
                    </Card>

                    <Card className="glass-card p-6 border-primary/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="text-xs font-bold text-blue-500 bg-blue-500/5 px-2 py-1 rounded-full">
                                Traffic
                            </span>
                        </div>
                        <div className="text-3xl font-black mb-1">{stats.clicks.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total unique clicks</p>
                    </Card>

                    <Card className="glass-card p-6 border-primary/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-purple-500" />
                            </div>
                            <span className="text-xs font-bold text-purple-500 bg-purple-500/5 px-2 py-1 rounded-full">
                                Conversions
                            </span>
                        </div>
                        <div className="text-3xl font-black mb-1">{stats.conversions}</div>
                        <p className="text-xs text-muted-foreground">Completed sales</p>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Link Generator */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card p-6 rounded-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <LinkIcon className="w-5 h-5 text-primary" />
                                    Link Generator
                                </h2>
                                <div className="relative w-full max-w-xs">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search products..."
                                        className="pl-9 h-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors bg-background/50"
                                    >
                                        <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold truncate">{product.name}</h3>
                                            <p className="text-sm text-muted-foreground">₹{product.price.toLocaleString()}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleGenerateLink(product)}
                                            className="shrink-0"
                                        >
                                            Generate Link
                                        </Button>
                                    </div>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No products found matching your search.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Details */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                Recent Activity
                            </h2>
                            <div className="space-y-4">
                                {recentClicks.length > 0 ? (
                                    recentClicks.map((click, i) => (
                                        <div key={i} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                                <Users className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    Click on {click.products?.name || "Product"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(click.created_at).toLocaleDateString()} at {new Date(click.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground text-sm">
                                        No clicks recorded yet. Share your links to start tracking!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generated Link Dialog */}
            <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Affiliate Link Generated</DialogTitle>
                        <DialogDescription>
                            Share this link to earn 10% commission on {selectedProduct?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg break-all text-sm font-mono relative group">
                            {generatedLink}
                        </div>
                        <Button className="w-full" onClick={copyLink}>
                            {copied ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Link
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Withdrawal Dialog */}
            <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Request Withdrawal</DialogTitle>
                        <DialogDescription>
                            Funds will be transferred to your bank account within 24-48 hours.
                            <br /><span className="text-xs text-muted-foreground">Min Withdrawal: ₹500 | 5% Admin Fee applies</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="bg-muted/30 p-4 rounded-lg flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Available Balance</span>
                            <span className="font-bold text-lg">₹{stats.earnings.toLocaleString()}</span>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase mb-1.5 block">Amount (₹)</label>
                            <Input
                                type="number"
                                placeholder="Enter amount..."
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <label className="text-xs font-bold uppercase block border-b pb-1">Bank Details</label>
                            <Input
                                placeholder="Account Holder Name"
                                value={bankDetails.accountName}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                            />
                            <Input
                                placeholder="Account Number"
                                value={bankDetails.accountNumber}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    placeholder="IFSC Code"
                                    value={bankDetails.ifsc}
                                    onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                                />
                                <Input
                                    placeholder="Bank Name"
                                    value={bankDetails.bankName}
                                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>Cancel</Button>
                        <Button onClick={handleWithdrawRequest} disabled={submittingWithdrawal}>
                            {submittingWithdrawal ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Processing...
                                </>
                            ) : "Submit Request"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AffiliateEarningsPage;
