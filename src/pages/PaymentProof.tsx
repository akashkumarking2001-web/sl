import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
    CheckCircle2,
    Clock,
    ArrowLeft,
    Download,
    Share2,
    Shield,
    Copy,
    ExternalLink,
    Receipt,
    Printer,
    ChevronRight,
    User,
    CreditCard,
    Package,
    Calendar,
    IndianRupee,
    Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface PaymentDetails {
    id: string;
    amount: number;
    item_name: string;
    transaction_id: string;
    status: string;
    created_at: string;
    user_name?: string;
    user_email?: string;
    payment_method: string;
}

const PaymentProof = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<PaymentDetails | null>(null);

    const paymentId = searchParams.get("id") || location.state?.paymentId;

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            if (!paymentId) {
                setLoading(false);
                return;
            }

            try {
                // Try fetching from payments table (packages)
                const { data: payData, error: payError } = await supabase
                    .from('payments')
                    .select('*, profiles(full_name, email)')
                    .eq('id', paymentId)
                    .single();

                if (payData) {
                    setDetails({
                        id: payData.id,
                        amount: payData.amount,
                        item_name: payData.plan_name,
                        transaction_id: payData.transaction_id || "PENDING",
                        status: payData.status || "pending",
                        created_at: payData.created_at,
                        user_name: (payData.profiles as any)?.full_name,
                        user_email: (payData.profiles as any)?.email,
                        payment_method: "Direct Transfer"
                    });

                    if (payData.status === 'approved' || payData.status === 'completed') {
                        triggerConfetti();
                    }
                } else {
                    // Try fetching from shopping_orders
                    const { data: orderData, error: orderError } = await (supabase
                        .from('shopping_orders') as any)
                        .select('*, profiles(full_name, email)')
                        .eq('id', paymentId)
                        .single();

                    if (orderData) {
                        setDetails({
                            id: orderData.id,
                            amount: orderData.total_price,
                            item_name: "Store Purchase",
                            transaction_id: orderData.transaction_id || "PENDING",
                            status: orderData.status || "pending",
                            created_at: orderData.created_at,
                            user_name: (orderData.profiles as any)?.full_name,
                            user_email: (orderData.profiles as any)?.email,
                            payment_method: "Direct Transfer"
                        });

                        if (orderData.status === 'approved' || orderData.status === 'completed' || orderData.status === 'processing') {
                            triggerConfetti();
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching payment details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [paymentId]);

    const triggerConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FBBF24', '#000000', '#FFFFFF']
        });
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: `${label} copied to clipboard`,
        });
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0B] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-xs">Generating Receipt...</p>
            </div>
        );
    }

    if (!details) {
        return (
            <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0B] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-6">
                    <Shield className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Receipt Not Found</h1>
                <p className="text-slate-500 font-bold mb-8 max-w-xs">We couldn't locate the payment details you're looking for.</p>
                <Button onClick={() => navigate('/dashboard')} className="rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black px-8 h-14">
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    const isApproved = details.status === 'approved' || details.status === 'completed' || details.status === 'processing';
    const isRejected = details.status === 'rejected';

    return (
        <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0B] font-sans text-slate-900 pb-20 transition-colors duration-500 print:bg-white print:p-0">
            <nav className="container mx-auto px-4 h-20 flex items-center justify-between no-print">
                <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-full h-12 w-12 p-0">
                    <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </Button>
                <img src={logo} alt="Skill Learners" className="h-8 md:h-10 opacity-80" />
                <div className="w-12"></div>
            </nav>

            <main className="container mx-auto px-4 pt-4 md:pt-8 max-w-2xl">
                {/* Status Header */}
                <div className="text-center mb-10 no-print animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className={cn(
                        "w-20 h-20 mx-auto rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl transition-transform hover:scale-105 duration-500 rotate-3",
                        isApproved ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                            isRejected ? "bg-rose-500 text-white shadow-rose-500/20" :
                                "bg-primary text-black shadow-primary/20"
                    )}>
                        {isApproved ? <CheckCircle2 className="w-10 h-10 stroke-[3]" /> :
                            isRejected ? <Shield className="w-10 h-10" /> :
                                <Clock className="w-10 h-10 animate-pulse" />}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                        {isApproved ? "Payment Verified" : isRejected ? "Payment Failed" : "Verification Pending"}
                    </h1>
                    <p className="text-slate-500 font-bold mt-2">
                        {isApproved ? "Your purchase has been activated and linked to your profile." :
                            isRejected ? "There was an issue verifying your transaction. Please contact support." :
                                "We are currently reviewing your payment proof. This usually takes 5-15 minutes."}
                    </p>
                </div>

                {/* The Receipt Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-black/5 dark:border-white/5 relative overflow-hidden transition-all duration-700 group">
                    {/* Jagged Edges */}
                    <div className="absolute top-0 left-0 right-0 h-3 bg-[radial-gradient(circle_at_50%_100%,transparent_6px,#F8F9FB_7px)] dark:bg-[radial-gradient(circle_at_50%_100%,transparent_6px,#0A0A0B_7px)] bg-[length:24px_12px]"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-3 bg-[radial-gradient(circle_at_50%_0%,transparent_6px,#F8F9FB_7px)] dark:bg-[radial-gradient(circle_at_50%_0%,transparent_6px,#0A0A0B_7px)] bg-[length:24px_12px]"></div>

                    <div className="p-8 md:p-12 relative z-10">
                        {/* Merchant Info */}
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Skill Learners</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Official Academy Receipt</p>
                            </div>
                            <div className="text-right">
                                <div className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    isApproved ? "bg-emerald-500/10 text-emerald-500" :
                                        isRejected ? "bg-rose-500/10 text-rose-500" :
                                            "bg-primary/10 text-primary"
                                )}>
                                    {details.status}
                                </div>
                            </div>
                        </div>

                        {/* Receipt Body */}
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-y-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><User className="w-3 h-3" /> Customer</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate pr-4">{details.user_name || "New Student"}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 justify-end"><Calendar className="w-3 h-3" /> Date & Time</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{new Date(details.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Receipt className="w-3 h-3" /> Document ID</p>
                                    <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{details.id.slice(0, 12).toUpperCase()}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 justify-end"><CreditCard className="w-3 h-3" /> Method</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{details.payment_method}</p>
                                </div>
                            </div>

                            {/* Item Breakdown */}
                            <div className="py-6 border-y-2 border-dashed border-black/5 dark:border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                                            <Package className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{details.item_name}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Qty: 01</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">₹{details.amount.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Total Section */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-slate-400">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                                    <span className="text-xs font-black">₹{details.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Transaction Fee</span>
                                    <span className="text-xs font-black">₹0.00</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Grand Total</span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase">Paid in Full</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-3xl font-black text-primary drop-shadow-sm flex items-center gap-1">
                                            <IndianRupee className="w-5 h-5" /> {details.amount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Reference Footer */}
                            <div className="bg-black/[0.02] dark:bg-white/[0.02] p-4 rounded-2xl border border-black/5 dark:border-white/5 mt-8 group-hover:bg-primary/5 transition-colors duration-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Bank Reference / TXID</p>
                                        <p className="text-xs font-mono font-bold text-slate-900 dark:text-white tracking-widest">{details.transaction_id}</p>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-primary hover:text-black transition-all" onClick={() => copyToClipboard(details.transaction_id, "Transaction ID")}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Security Verification */}
                        <div className="mt-12 flex items-center justify-center gap-6 opacity-40">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Verified Ledger</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Top Tier Secure</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-10 grid grid-cols-2 gap-4 no-print animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                    <Button onClick={handlePrint} variant="outline" className="h-16 rounded-2xl border-2 border-black/5 dark:border-white/5 font-black text-xs uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                        <Printer className="w-5 h-5 mr-3" /> Save Receipt
                    </Button>
                    <Button onClick={() => copyToClipboard(window.location.href, "Proof Link")} variant="outline" className="h-16 rounded-2xl border-2 border-black/5 dark:border-white/5 font-black text-xs uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                        <Share2 className="w-5 h-5 mr-3" /> Share Proof
                    </Button>
                    <Link to="/user-home" className="col-span-2">
                        <Button className="w-full h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all group overflow-hidden relative">
                            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-black transition-colors">
                                Continue to Learning Academy
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                    </Link>
                </div>

                <div className="mt-12 text-center no-print">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Skill Learners • Empowering Future</p>
                </div>
            </main>

            {/* Print Overlay Hide CSS */}
            <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
        </div>
    );
};

export default PaymentProof;
