import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  QrCode,
  Copy,
  Check,
  Upload,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  IndianRupee,
  Loader2,
  Bitcoin,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.png";
import { packages } from "@/data/packages";

type PaymentMethod = "upi" | "crypto" | null;

const PaymentGateway = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  const isCartSource = searchParams.get("source") === "cart";
  const { cart, totalPrice, totalCashback, clearCart } = useCart();
  const planName = searchParams.get("plan") || "Creator Pack";
  const selectedPlan = packages.find(p => p.name === planName) || packages[0];

  const [productData, setProductData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isVerified, setIsVerified] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [existingPayment, setExistingPayment] = useState<any>(null);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // 1. Check for existing pending payments
  useEffect(() => {
    const checkPending = async () => {
      if (!user) {
        setCheckingExisting(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("payments")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "pending")
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          console.log("Found existing pending payment:", data);
          setExistingPayment(data);
          setTransactionId(data.transaction_id);
          setIsSubmitted(true);
        }
      } catch (err) {
        console.error("Error checking pending payments:", err);
      } finally {
        setCheckingExisting(false);
      }
    };

    checkPending();
  }, [user]);

  // 2. Fetch Payment Settings
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("site_settings")
          .select("*")
          .eq("id", "global")
          .single();

        if (isMounted && data) {
          console.log("Payment settings loaded:", data);
          setSettings(data);
        } else if (error) {
          console.error("Error fetching site settings:", error);
        }
      } catch (err) {
        console.error("Unexpected error fetching settings:", err);
      }
    };
    fetchSettings();
    return () => { isMounted = false; };
  }, []);

  // 3. Fetch Product if exists
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const { data } = await supabase.from("products").select("*").eq("id", productId).single();
        if (data) setProductData(data);
      };
      fetchProduct();
    }
  }, [productId]);

  const finalAmount = isCartSource ? totalPrice : (productData ? productData.price : selectedPlan.price);
  const itemName = isCartSource ? `${cart.length} Items in Cart` : (productData ? productData.name : selectedPlan.name);
  const displayCashback = isCartSource ? totalCashback : (productData ? productData.cashback_amount : 0);

  // Timer & Real-time Check
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let subscription: any;

    if (isSubmitted && !isVerified) {
      // 1. Start Countdown
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // 2. Subscribe to Payment Status Changes
      console.log("Subscribing to payment updates for user:", user?.id);
      subscription = supabase
        .channel('payment-status')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'payments',
            filter: `user_id=eq.${user?.id}`
          },
          (payload) => {
            console.log("Payment update received:", payload);
            if (payload.new.status === 'approved') {
              setIsVerified(true);
              toast({ title: "Payment Verified!", description: "Your account is now active.", variant: "default" });
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (timer) clearInterval(timer);
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [isSubmitted, isVerified, user?.id, transactionId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please upload an image smaller than 5MB", variant: "destructive" });
        return;
      }
      setScreenshot(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast({ title: "Error", description: "Please enter the Transaction ID/UTR", variant: "destructive" });
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting payment for plan:", selectedPlan.name);

    // Timeout safety
    const submissionTimeout = setTimeout(() => {
      if (isSubmitting) {
        setIsSubmitting(false);
        toast({
          title: "Submission taking long",
          description: "Connection is slow. If it doesn't complete, please refresh and check if your payment shows as pending.",
          variant: "destructive"
        });
      }
    }, 15000);

    try {
      let screenshotUrl = "";

      // 1. Upload Screenshot if exists
      if (screenshot) {
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const filePath = `payments/${fileName}`;

        console.log("Uploading screenshot to:", filePath);
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("payments")
          .upload(fileName, screenshot, { upsert: true });

        if (uploadError) {
          console.error("Screenshot upload error:", uploadError);
          // Don't block the whole process, but notify
          toast({ title: "Upload Failed", description: "Proceeding without screenshot. Please share it on WhatsApp.", variant: "destructive" });
        } else if (uploadData) {
          const { data: { publicUrl } } = supabase.storage.from("payments").getPublicUrl(fileName);
          screenshotUrl = publicUrl;
          console.log("Screenshot URL:", screenshotUrl);
        }
      }

      // 2. Insert Payment/Order Record
      if (isCartSource) {
        // Handle Cart Checkout
        const orderPromises = cart.map(item =>
          supabase.from("shopping_orders").insert({
            user_id: user.id,
            product_id: item.id,
            total_price: item.price * item.quantity,
            unit_price: item.price,
            cashback_amount: (item.cashback || 0) * item.quantity,
            quantity: item.quantity,
            transaction_id: transactionId.trim(),
            screenshot_url: screenshotUrl,
            shipping_address: { address: shippingAddress },
            status: "pending"
          })
        );
        const results = await Promise.all(orderPromises);
        const errors = results.filter(r => r.error);
        if (errors.length > 0) throw errors[0].error;

        clearCart();
      } else if (productData) {
        const { error: orderError } = await supabase
          .from("shopping_orders")
          .insert({
            user_id: user.id,
            product_id: productData.id,
            total_price: productData.price,
            unit_price: productData.price,
            cashback_amount: productData.cashback_amount || 0,
            transaction_id: transactionId.trim(),
            screenshot_url: screenshotUrl,
            shipping_address: { address: shippingAddress },
            status: "pending"
          });
        if (orderError) throw orderError;
      } else {
        const { error: insertError } = await supabase
          .from("payments")
          .insert({
            user_id: user.id,
            amount: selectedPlan.price,
            plan_name: selectedPlan.name,
            transaction_id: transactionId.trim(),
            screenshot_url: screenshotUrl,
            status: "pending",
          });

        if (insertError) {
          console.error("Payment insert error:", insertError);
          throw new Error(insertError.message || "Failed to save payment record.");
        }

        // 3. Mark plan as intent in profile (but not verified yet)
        await supabase
          .from("profiles")
          .update({ purchased_plan: selectedPlan.name })
          .eq("user_id", user.id);
      }

      clearTimeout(submissionTimeout);

      setIsSubmitted(true);
      toast({ title: "Order Placed", description: "Verifying your transaction..." });
    } catch (error: any) {
      console.error("Submission catch error:", error);
      toast({ title: "Submission Failed", description: error.message || "An unexpected error occurred", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const phone = settings?.whatsapp_number || "+910000000000";
    const message = `Hello, I just made a payment for the ${selectedPlan.name} plan.\n\nEmail: ${user?.email}\nUTR/Transaction ID: ${transactionId}\n\nPlease activate my account instantly.`;
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // --- RENDERING LOGIC ---

  // 1. Payment Success View
  if (isVerified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card p-10 rounded-3xl max-w-lg w-full text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-emerald/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Check className="w-12 h-12 text-emerald" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold font-display mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Welcome to the elite circle of <span className="text-primary font-bold">{selectedPlan.name}</span>.
            Your account is now fully active.
          </p>
          <Button variant="hero" size="lg" className="w-full" onClick={() => navigate("/dashboard/courses")}>
            Get Started Now
          </Button>
        </div>
      </div>
    );
  }

  // 2. Waiting / Timer View
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="glass-card p-8 rounded-3xl max-w-lg w-full text-center border-primary/20 shadow-2xl">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-primary/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold font-mono">
              {timeLeft}s
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Connecting to Merchant...</h2>
          <p className="text-muted-foreground mb-8">
            Verifying your transaction <span className="font-mono text-primary">{transactionId}</span>
          </p>

          <div className="grid gap-4 mb-8">
            {timeLeft > 0 ? (
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4 text-left">
                <Timer className="w-8 h-8 text-primary animate-pulse" />
                <p className="text-sm">Stay on this screen. Our system is auto-verifying your payment status with the bank.</p>
              </div>
            ) : (
              <div className="p-4 bg-amber/5 rounded-2xl border border-amber/20 flex items-center gap-4 text-left">
                <AlertCircle className="w-8 h-8 text-amber" />
                <p className="text-sm text-amber-700">Verification is taking longer than usual. Please wait a moment or use the button below.</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Button variant="hero" className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] border-none shadow-lg" onClick={openWhatsApp}>
              <MessageCircle className="w-6 h-6 mr-2" />
              Chat for Instant Activation
            </Button>
            <p className="text-xs text-muted-foreground">Clicking will share your UTR with our support team</p>
          </div>
        </div>

        <button onClick={() => navigate("/user-home")} className="mt-8 text-muted-foreground hover:text-primary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    );
  }

  // 3. Selection View
  if (!paymentMethod) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4">
          <div className="text-center mb-10">
            <img src={logo} alt="Skill Learners" className="h-12 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Select Payment Method</h1>
            <p className="text-muted-foreground">Choose how you'd like to pay ₹{selectedPlan.price.toLocaleString()}</p>
          </div>

          <div className="grid gap-4">
            <button
              onClick={() => setPaymentMethod("upi")}
              className="glass-card p-6 rounded-2xl flex items-center justify-between group hover:border-primary/50 transition-all text-left"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <IndianRupee className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Pay via UPI</h3>
                  <p className="text-sm text-muted-foreground">PhonePe, Google Pay, Paytm</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setPaymentMethod("crypto")}
              className="glass-card p-6 rounded-2xl flex items-center justify-between group hover:border-primary/50 transition-all text-left"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-amber/10 flex items-center justify-center group-hover:bg-amber group-hover:text-white transition-colors">
                  <Bitcoin className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Pay via Crypto</h3>
                  <p className="text-sm text-muted-foreground">USDT (TRC20 Network)</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <Link to={-1 as any} className="block text-center mt-10 text-muted-foreground hover:text-primary transition-colors">
            Cancel and Return
          </Link>
        </div>
      </div>
    );
  }

  // 4. Payment View (UPI/Crypto)
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setPaymentMethod(null)} className="p-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xl font-bold font-display">Finalize Payment</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase font-bold">Total Payable</p>
            <p className="text-xl font-bold text-primary">₹{selectedPlan.price.toLocaleString()}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-8">

          {/* Left: Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 rounded-3xl overflow-hidden relative">
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${selectedPlan.color}`}></div>
              <h2 className="font-bold mb-4">You are buying</h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black">{itemName}</h3>
                  <p className="text-sm text-muted-foreground">{productData || isCartSource ? "Official Store Items" : "Complete Access Bundle"}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹{finalAmount.toLocaleString()}</p>
                  <p className="text-xs text-emerald font-bold">{productData || isCartSource ? `CASHBACK ₹${displayCashback}` : `SAVED ₹${selectedPlan.savings.toLocaleString()}`}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-dashed">
                {selectedPlan.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-4">
              <Shield className="w-10 h-10 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground">
                Your transaction is protected by 256-bit SSL encryption. We use a manual verification protocol to ensure maximum security for your funds.
              </p>
            </div>
          </div>

          {/* Right: Payment Details */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-8 rounded-3xl relative">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black">
                  {paymentMethod === 'upi' ? 'UPI Payment' : 'Crypto Transfer'}
                </h2>
                <div className="px-3 py-1 bg-muted rounded-full text-xs font-bold uppercase tracking-wider">
                  Step 2 of 2
                </div>
              </div>

              {/* UPI CONTENT */}
              {paymentMethod === 'upi' && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-white rounded-3xl shadow-xl mb-6 relative group transform hover:scale-105 transition-transform">
                      {settings?.qr_code_url ? (
                        <img src={settings.qr_code_url} className="w-48 h-48 object-contain" alt="Payment QR" />
                      ) : (
                        <div className="w-48 h-48 bg-muted rounded-2xl flex items-center justify-center text-center p-4">
                          <QrCode className="w-12 h-12 text-muted-foreground mb-2" />
                          <p className="text-[10px] text-muted-foreground uppercase">QR Code Loading...</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
                        <Button variant="secondary" size="sm" className="rounded-full">Scan Me</Button>
                      </div>
                    </div>

                    <div className="w-full space-y-4">
                      <Label className="text-sm uppercase font-bold text-muted-foreground">Transfer to UPI ID</Label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-muted/30 border border-border h-14 flex items-center px-4 rounded-2xl font-mono text-lg truncate">
                          {settings?.upi_id || "skillhonors@upi"}
                        </div>
                        <Button
                          variant="hero"
                          className="h-14 w-14 rounded-2xl p-0"
                          onClick={() => copyToClipboard(settings?.upi_id || "skillhonors@upi", "UPI ID")}
                        >
                          {copiedText === "UPI ID" ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CRYPTO CONTENT */}
              {paymentMethod === 'crypto' && (
                <div className="space-y-6">
                  <div className="p-6 bg-amber/5 rounded-2xl border border-amber/20 mb-6">
                    <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      Important Network Notice
                    </h3>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Please send only **USDT** using the **TRC20 (Tron)** network. Sending any other currency or using another network (like ERC20/BEP20) will result in permanent loss of funds.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm uppercase font-bold text-muted-foreground">USDT Wallet Address (TRC20)</Label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-muted/30 border border-border h-14 flex items-center px-4 rounded-2xl font-mono text-xs break-all leading-tight">
                        {settings?.usdt_address || "TRC20_ADDRESS_HERE"}
                      </div>
                      <Button
                        variant="hero"
                        className="h-14 w-14 rounded-2xl p-0"
                        onClick={() => copyToClipboard(settings?.usdt_address || "TRC20_ADDRESS_HERE", "Wallet Address")}
                      >
                        {copiedText === "Wallet Address" ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBMISSION FORM */}
              <form onSubmit={handleSubmit} className="mt-10 pt-10 border-t border-dashed border-border space-y-6">
                <div>
                  <Label className="text-sm font-bold mb-3 block">Transaction ID / UTR Number *</Label>
                  <Input
                    placeholder="Enter 12-digit UTR or TxHash"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="h-14 rounded-2xl border-2 focus:border-primary px-6"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2 italic flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Double check your ID before submitting
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-bold mb-3 block">Payment Proof (Screenshot)</Label>
                  <label className="flex flex-col items-center justify-center h-24 w-full border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{screenshot ? screenshot.name : "Choose file..."}</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>

                {productData && (
                  <div>
                    <Label className="text-sm font-bold mb-3 block">Shipping Address *</Label>
                    <Textarea
                      placeholder="Enter your full address with PIN code and Mobile Number for delivery"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="min-h-[100px] rounded-2xl border-2 focus:border-primary px-6 py-4"
                      required
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full h-16 rounded-2xl text-lg font-black shadow-xl transform active:scale-95 transition-transform"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      SECURELY SUBMITTING...
                    </div>
                  ) : (
                    "FINALIZE & ACTIVATE"
                  )}
                </Button>

                <p className="text-center text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                  Secure checkout powered by Skill Learners
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentGateway;