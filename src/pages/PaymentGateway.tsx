import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  QrCode,
  Copy,
  Check,
  Upload,
  Shield,
  AlertCircle,
  CheckCircle2,
  IndianRupee,
  Loader2,
  Bitcoin,
  ChevronRight,
  MessageCircle,
  Timer,
  MapPin,
  CreditCard,
  Truck,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.png";
import { packages } from "@/data/packages";
import AddressManager from "@/components/shopping/AddressManager";
import { cn } from "@/lib/utils";

type PaymentMethod = "upi" | "crypto" | null;
type CheckoutStep = "address" | "method" | "payment";

const PaymentGateway = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  const isCartSource = searchParams.get("source") === "cart";
  const couponCode = searchParams.get("coupon");

  const { cart, totalPrice: cartSubtotal, totalCashback, clearCart } = useCart();
  const planName = searchParams.get("plan") || "Creator Pack";
  const selectedPlan = packages.find(p => p.name === planName) || packages[0];

  const [productData, setProductData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const isPhysical = isCartSource || !!productId;
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(() => isPhysical ? "address" : "method");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isVerified, setIsVerified] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  // Pricing State
  const [finalCalculatedPrice, setFinalCalculatedPrice] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [abandonedCheckoutId, setAbandonedCheckoutId] = useState<string | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Abandoned Cart Tracking - Silent Fail Safe
  useEffect(() => {
    let mounted = true;
    const logAbandonedCart = async () => {
      try {
        if (user && isCartSource && cart.length > 0 && !abandonedCheckoutId && !isSubmitted && mounted) {
          const { data, error } = await supabase
            .from('abandoned_checkouts')
            .insert({
              user_id: user.id,
              cart_items: cart as any,
              total_amount: cartSubtotal,
              email: user.email
            })
            .select()
            .single();

          if (!error && data && mounted) setAbandonedCheckoutId(data.id);
        }
      } catch (e) {
        // Silent catch for AbortErrors during navigation
      }
    };
    const timeout = setTimeout(logAbandonedCart, 3000);
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [user, isCartSource, cart, abandonedCheckoutId, isSubmitted, cartSubtotal]);

  const location = useLocation();
  const stateProduct = location.state?.product;

  // 1. Initial Data Fetch & Setting up Price
  useEffect(() => {
    const init = async () => {
      console.log("PaymentGateway: Starting initialization...");
      try {
        // RACE CONDITION: 500ms TIMEOUT FOR INSTANT LOAD
        // The user wants ZERO waiting. If DB is slow, we use defaults immediately.
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Init timed out")), 500)
        );

        const fetchPromise = (async () => {
          // Parallel execution for speed
          const productPromise = (async () => {
            if (stateProduct) {
              setProductData(stateProduct);
            } else if (productId) {
              const { data } = await supabase.from("products").select("*").eq("id", productId).maybeSingle();
              if (data) setProductData(data);
            }
          })();

          const settingsPromise = (async () => {
            try {
              // @ts-ignore
              const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
              if (data) setSettings(data);
            } catch (e) { console.warn("Settings fetch skipped"); }
          })();

          await Promise.all([productPromise, settingsPromise]);
          return true;
        })();

        await Promise.race([fetchPromise, timeoutPromise]);
      } catch (err: any) {
        console.warn("PaymentGateway: Fast Load Triggered (DB slow or timeout)");
        // No error toast - we just want to SHOW THE PAGE.
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, [user, productId, stateProduct]);

  // 2. Calculate Totals
  useEffect(() => {
    let basePrice = isCartSource ? cartSubtotal : (productData ? productData.price : selectedPlan.price);
    setFinalCalculatedPrice(Math.max(0, basePrice - (couponDiscount || 0)));
  }, [cartSubtotal, productData, selectedPlan, couponDiscount, isCartSource]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      if (e.target.files[0].size > 5 * 1024 * 1024) {
        toast({ title: "File too large", variant: "destructive" });
        return;
      }
      setScreenshot(e.target.files[0]);
    }
  };

  const isDigital = !isPhysical;
  const [verificationState, setVerificationState] = useState<'idle' | 'verifying' | 'success' | 'timeout'>('idle');
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);

  // Polling for Payment Approval (Digital Only)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (verificationState === 'verifying' && currentPaymentId) {
      interval = setInterval(async () => {
        const { data } = await supabase
          .from('payments')
          .select('status')
          .eq('id', currentPaymentId)
          .single();

        if (data?.status === 'approved' || data?.status === 'completed') {
          setVerificationState('success');
          clearInterval(interval);
          // Redirect to course after delay
          setTimeout(() => navigate(`/payment-proof?id=${currentPaymentId}`), 3000);
        }
      }, 3000); // Check every 3 seconds

      // Timeout after 60 seconds
      const timeoutId = setTimeout(() => {
        setVerificationState(current => {
          if (current !== 'success') {
            clearInterval(interval);
            return 'timeout';
          }
          return current;
        });
      }, 60000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeoutId);
      };
    }
  }, [verificationState, currentPaymentId, navigate]);

  // Timer Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verificationState === 'verifying') {
      setTimeLeft(60); // Reset timer start
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [verificationState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) return toast({ title: "Enter Transaction ID", variant: "destructive" });
    if (!user) return navigate("/login");

    // 🚀 OPTIMISTIC UI: Trigger "Verifying" state INSTANTLY
    if (isDigital) {
      setVerificationState('verifying');
    } else {
      setIsSubmitting(true);
    }

    // Run heavy lifting in background
    (async () => {
      try {
        let screenshotUrl = "";
        if (screenshot) {
          const fileName = `${user.id}/${Date.now()}_${screenshot.name}`;
          const { error: uploadError } = await supabase.storage.from("payments").upload(fileName, screenshot);
          if (!uploadError) {
            const { data } = supabase.storage.from("payments").getPublicUrl(fileName);
            screenshotUrl = data.publicUrl;
          }
        }

        const addressJson = selectedAddress ? {
          full_name: selectedAddress.full_name,
          address_line1: selectedAddress.address_line1,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postal_code: selectedAddress.postal_code,
          phone: selectedAddress.phone
        } : {};

        if (isCartSource) {
          const ordersToInsert = [];
          for (const item of cart) {
            let affiliateUserId = null;
            let commissionAmount = 0;

            if (item.referralCode) {
              const { data: linkData } = await (supabase
                .from("affiliate_links")
                .select("user_id") as any)
                .eq("referral_code", item.referralCode)
                .maybeSingle();

              if (linkData) {
                affiliateUserId = linkData.user_id;
                // Calculate commission: Preferred fixed amount, else percentage
                if (item.commission_amount > 0) {
                  commissionAmount = item.commission_amount * item.quantity;
                } else if (item.commission_percentage > 0) {
                  commissionAmount = (item.price * item.quantity * item.commission_percentage) / 100;
                }
              }
            }

            ordersToInsert.push({
              user_id: user.id,
              product_id: item.id,
              total_price: (item.price * item.quantity),
              unit_price: item.price,
              quantity: item.quantity,
              transaction_id: transactionId,
              shipping_address: addressJson,
              status: "pending",
              affiliate_user_id: affiliateUserId,
              affiliate_commission: commissionAmount,
              cashback_amount: (item.cashback || 0) * item.quantity
            });
          }
          const { data: inserts, error: bulkError } = await (supabase.from("shopping_orders") as any).insert(ordersToInsert).select();
          if (bulkError) throw bulkError;

          clearCart();
          setIsSubmitted(true);
          toast({ title: "Success", description: "Order placed successfully." });

          if (inserts && inserts.length > 0) {
            setTimeout(() => navigate(`/payment-proof?id=${inserts[0].id}`), 1500);
          }

        } else if (productData) {
          let affiliateUserId = null;
          let commissionAmount = 0;
          const refCode = productData.referralCode;

          if (refCode) {
            const { data: linkData } = await (supabase
              .from("affiliate_links")
              .select("user_id") as any)
              .eq("referral_code", refCode)
              .maybeSingle();

            if (linkData) {
              affiliateUserId = linkData.user_id;
              if (productData.affiliate_commission_amount > 0) {
                commissionAmount = productData.affiliate_commission_amount;
              } else if (productData.affiliate_commission_percentage > 0) {
                commissionAmount = (finalCalculatedPrice * productData.affiliate_commission_percentage) / 100;
              }
            }
          }

          const { data: orderData, error: orderError } = await (supabase.from("shopping_orders") as any).insert({
            user_id: user.id,
            product_id: productData.id,
            total_price: finalCalculatedPrice,
            unit_price: productData.price,
            transaction_id: transactionId,
            shipping_address: addressJson,
            status: "pending",
            affiliate_user_id: affiliateUserId,
            affiliate_commission: commissionAmount,
            cashback_amount: productData.cashback_amount || 0
          }).select().single();
          if (orderError) throw orderError;
          setIsSubmitted(true);
          toast({ title: "Order Placed", description: "Verifying transaction..." });
          if (orderData) {
            setTimeout(() => navigate(`/payment-proof?id=${orderData.id}`), 1500);
          }

        } else {
          // DIGITAL PRODUCT - Main Focus
          const { data, error } = await supabase.from("payments").insert({
            user_id: user.id,
            amount: finalCalculatedPrice,
            plan_name: selectedPlan.name,
            transaction_id: transactionId,
            screenshot_url: screenshotUrl,
            status: "pending",
          }).select().single();

          if (error) throw error;

          // Update profile plan immediately (Background)
          await supabase.from("profiles").update({ purchased_plan: selectedPlan.name }).eq("user_id", user.id);

          if (data) {
            setCurrentPaymentId(data.id);
            // Poller will pick this up
          }
        }
      } catch (error: any) {
        console.error("Background Submission Error:", error);
        // Only revert UI if it failed
        if (isDigital) {
          setVerificationState('idle'); // Go back to form
          toast({ title: "Submission Failed", description: "Please try again. " + error.message, variant: "destructive" });
        } else {
          setIsSubmitting(false);
          toast({ title: "Error", description: error.message, variant: "destructive" });
        }
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col items-center gap-6 max-w-sm w-full text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#FBBF24] rounded-full border-t-transparent animate-spin"></div>
            <Shield className="absolute inset-0 m-auto w-8 h-8 text-[#FBBF24]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Secure Checkout</h2>
            <p className="text-slate-500 font-medium">Verifying your selection...</p>
          </div>
        </div>
      </div>
    );
  }

  // CHECKOUT FLOW UI
  const itemName = isCartSource ? `${cart.length} Items` : (productData ? productData.name : selectedPlan.name);
  const basePrice = isCartSource ? cartSubtotal : (productData ? productData.price : selectedPlan.price);

  // Main Render
  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0B] font-sans text-slate-900 pb-20 transition-colors duration-500">
      <header className="bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-black/5 dark:hover:bg-white/5 h-10 w-10">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/10 p-2 rounded-xl">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="font-black text-base md:text-lg tracking-tight text-slate-900 dark:text-white uppercase">Secure Checkout</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {['Address', 'Method', 'Payment'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className={cn("transition-all", (i === 0 && checkoutStep === 'address') || (i === 1 && checkoutStep === 'method') || (i === 2 && checkoutStep === 'payment') ? "text-primary scale-110" : "")}>{step}</span>
                {i < 2 && <ChevronRight className="w-3 h-3 opacity-30" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">

          {/* Left Column: Process Steps */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">

            {/* STEP 1: ADDRESS */}
            {isPhysical && (
              <div className={cn(
                "bg-white dark:bg-zinc-900/50 p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 shadow-sm",
                checkoutStep === 'address' ? "border-primary/50 shadow-xl shadow-primary/5 ring-1 ring-primary/20" : "border-black/5 dark:border-white/5 opacity-80"
              )}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all", checkoutStep === 'address' ? "bg-primary text-black shadow-lg shadow-primary/20" : "bg-black/5 dark:bg-white/5 text-slate-400")}>1</div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Shipping Address</h2>
                  </div>
                  {checkoutStep !== 'address' && <Button variant="ghost" onClick={() => setCheckoutStep('address')} className="text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/10 rounded-xl px-4">Change</Button>}
                </div>

                {checkoutStep === 'address' ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <AddressManager
                      selectedAddressId={selectedAddress?.id}
                      onSelectAddress={setSelectedAddress}
                    />
                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={() => {
                          if (!selectedAddress) return toast({ title: "Select Address", variant: "destructive" });
                          setCheckoutStep('method');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="h-14 px-8 rounded-2xl bg-primary text-black hover:bg-primary/90 font-black text-base shadow-xl shadow-primary/20 w-full sm:w-auto"
                        disabled={!selectedAddress}
                      >
                        Select Payment Method <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pl-14 border-l-2 border-black/5 dark:border-white/5 ml-5 py-2">
                    <p className="font-black text-lg text-slate-900 dark:text-white">{selectedAddress?.full_name}</p>
                    <p className="text-slate-500 font-medium text-sm mt-1">{selectedAddress?.address_line1}, {selectedAddress?.city}</p>
                    <p className="text-slate-500 font-medium text-sm">{selectedAddress?.state} - {selectedAddress?.postal_code}</p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: METHOD */}
            {(checkoutStep === 'method' || checkoutStep === 'payment') && (
              <div className={cn(
                "bg-white dark:bg-zinc-900/50 p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 shadow-sm",
                checkoutStep === 'method' ? "border-primary/50 shadow-xl shadow-primary/5 ring-1 ring-primary/20" : "border-black/5 dark:border-white/5"
              )}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all", checkoutStep === 'method' ? "bg-primary text-black shadow-lg shadow-primary/20" : "bg-black/5 dark:bg-white/5 text-slate-400")}>{isPhysical ? 2 : 1}</div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Payment Method</h2>
                  </div>
                  {checkoutStep === 'payment' && <Button variant="ghost" onClick={() => setCheckoutStep('method')} className="text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/10 rounded-xl px-4">Change</Button>}
                </div>

                {checkoutStep === 'method' ? (
                  <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={cn(
                        "p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group",
                        paymentMethod === 'upi' ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
                      )}
                    >
                      <div className="relative z-10">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", paymentMethod === 'upi' ? "bg-primary text-black shadow-lg shadow-primary/20" : "bg-black/5 dark:bg-white/5 text-slate-400")}><IndianRupee className="w-7 h-7" /></div>
                        <span className="font-black text-xl block mb-2 text-slate-900 dark:text-white">UPI Payment</span>
                        <p className="text-sm text-slate-500 font-bold leading-relaxed">Direct transfer via Google Pay, PhonePe or Paytm</p>
                      </div>
                      {paymentMethod === 'upi' && <div className="absolute top-6 right-6 text-primary animate-in zoom-in duration-300"><CheckCircle2 className="w-8 h-8 fill-current" /></div>}
                    </button>

                    <button
                      onClick={() => setPaymentMethod('crypto')}
                      className={cn(
                        "p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group",
                        paymentMethod === 'crypto' ? "border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/5" : "border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
                      )}
                    >
                      <div className="relative z-10">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6", paymentMethod === 'crypto' ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-black/5 dark:bg-white/5 text-slate-400")}><Bitcoin className="w-7 h-7" /></div>
                        <span className="font-black text-xl block mb-2 text-slate-900 dark:text-white">USDT (TRC20)</span>
                        <p className="text-sm text-slate-500 font-bold leading-relaxed">Fast & Decentralized crypto payment</p>
                      </div>
                      {paymentMethod === 'crypto' && <div className="absolute top-6 right-6 text-amber-500 animate-in zoom-in duration-300"><CheckCircle2 className="w-8 h-8 fill-current" /></div>}
                    </button>

                    <div className="sm:col-span-2 mt-8">
                      <Button
                        onClick={() => {
                          if (!paymentMethod) return toast({ title: "Select Method", variant: "destructive" });
                          setCheckoutStep('payment');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={!paymentMethod}
                        className="h-16 px-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] transition-transform font-black text-lg shadow-2xl w-full"
                      >
                        Continue to Payment <ArrowRight className="w-6 h-6 ml-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pl-14 flex items-center gap-4 text-xl font-black text-slate-900 dark:text-white border-l-2 border-black/5 dark:border-white/5 ml-5 py-2">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", paymentMethod === 'upi' ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-500")}>
                      {paymentMethod === 'upi' ? <IndianRupee className="w-6 h-6" /> : <Bitcoin className="w-6 h-6" />}
                    </div>
                    {paymentMethod === 'upi' ? 'Unified Payments Interface' : 'Tether USDT (TRC20)'}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: PAYMENT FORM */}
            {checkoutStep === 'payment' && (
              <div className="bg-white dark:bg-zinc-900/50 p-6 md:p-10 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-10 pb-8 border-b border-black/5 dark:border-white/5">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/5 transition-transform hover:rotate-12">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Final Step: Pay & Confirm</h2>
                    <p className="text-slate-500 font-bold mt-1">Complete your transaction to activate your purchase</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 mb-10">
                  {/* QR Display */}
                  <div className="bg-black/5 dark:bg-white/5 p-8 rounded-[2rem] border border-black/5 dark:border-white/5 flex flex-col items-center text-center group">
                    {(isPhysical ? settings?.shop_qr_code_url : settings?.qr_code_url) ? (
                      <div className="relative">
                        <img src={isPhysical ? settings.shop_qr_code_url : settings.qr_code_url} className="w-56 h-56 rounded-2xl shadow-2xl bg-white p-3 transition-transform group-hover:scale-105 duration-500" />
                        <div className="absolute inset-0 border-[6px] border-primary/20 rounded-2xl pointer-events-none scale-105 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    ) : (
                      <div className="w-56 h-56 rounded-[2rem] bg-white dark:bg-zinc-800 border-2 border-dashed border-black/10 dark:border-white/10 flex items-center justify-center mb-4 transition-colors group-hover:border-primary/50">
                        <QrCode className="w-16 h-16 text-slate-200 dark:text-zinc-700" />
                      </div>
                    )}
                    <div className="mt-6 space-y-2">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Merchant QR Code</p>
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Scan using any payment app</p>
                    </div>
                  </div>

                  {/* Copy Fields */}
                  <div className="space-y-8 flex flex-col justify-center">
                    {paymentMethod === 'upi' ? (
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest pl-1">Target UPI ID</Label>
                        <div className="flex gap-2 relative group">
                          <Input value={(isPhysical ? settings?.shop_upi_id : settings?.upi_id) || "admin@upi"} readOnly className="h-16 pl-6 pr-16 bg-black/5 dark:bg-white/5 border-none font-black text-lg text-slate-900 dark:text-white rounded-2xl group-hover:bg-primary/5 transition-colors" />
                          <Button size="icon" className="absolute right-2 top-2 h-12 w-12 rounded-xl bg-white dark:bg-zinc-800 shadow-lg border-none hover:bg-primary hover:text-black transition-all" variant="outline" onClick={() => copyToClipboard((isPhysical ? settings?.shop_upi_id : settings?.upi_id), "UPI")}><Copy className="w-5 h-5" /></Button>
                        </div>
                        <div className="bg-primary/10 text-primary p-4 rounded-2xl text-[11px] font-black uppercase tracking-tight flex items-center gap-3">
                          <IndianRupee className="w-4 h-4" /> Transfer exact amount: ₹{finalCalculatedPrice.toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest pl-1">USDT (TRC20) Wallet</Label>
                        <div className="flex gap-2 relative group">
                          <Input value={(isPhysical ? settings?.shop_usdt_address : settings?.usdt_address) || "TRC20..."} readOnly className="h-16 pl-6 pr-16 bg-black/5 dark:bg-white/5 border-none font-black text-xs text-slate-900 dark:text-white rounded-2xl group-hover:bg-amber-500/5 transition-colors" />
                          <Button size="icon" className="absolute right-2 top-2 h-12 w-12 rounded-xl bg-white dark:bg-zinc-800 shadow-lg border-none hover:bg-amber-500 hover:text-white transition-all" variant="outline" onClick={() => copyToClipboard((isPhysical ? settings?.shop_usdt_address : settings?.usdt_address), "Address")}><Copy className="w-5 h-5" /></Button>
                        </div>
                        <div className="bg-amber-500/10 text-amber-500 p-4 rounded-2xl text-[11px] font-black uppercase tracking-tight flex items-start gap-3">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>Ensure you are using the <strong className="underline underline-offset-2">TRC20 Network</strong> only or funds will be lost.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-black text-slate-900 dark:text-white pl-1">Transaction / Ref Number</Label>
                      <Input
                        value={transactionId}
                        onChange={e => setTransactionId(e.target.value)}
                        placeholder="UTR / TxId e.g. 1234..."
                        className="h-16 bg-black/[0.03] dark:bg-white/[0.03] border-2 border-transparent focus:border-primary text-xl font-black tracking-widest rounded-2xl transition-all shadow-inner"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-black text-slate-900 dark:text-white pl-1">Payment Proof (IMG)</Label>
                      <div className="h-16 border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-center text-slate-400 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer relative overflow-hidden group">
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        {screenshot ? (
                          <div className="flex items-center gap-3 px-4 w-full">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20"><Check className="w-5 h-5 text-white" /></div>
                            <span className="font-black text-xs text-emerald-600 dark:text-emerald-400 truncate">{screenshot.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 px-4 transition-transform group-hover:scale-105">
                            <Upload className="w-5 h-5 text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest">Attach Screenshot</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-20 rounded-[2rem] text-xl font-black bg-primary text-black hover:scale-[1.01] transition-all shadow-[0_20px_50px_rgba(251,191,36,0.2)] dark:shadow-[0_20px_50px_rgba(251,191,36,0.1)] mt-4 relative overflow-hidden group" disabled={isSubmitting}>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {isSubmitting ? (
                      <div className="flex items-center gap-4">
                        <Loader2 className="animate-spin w-8 h-8" />
                        <span>Confirming...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <span>Request Final Validation</span>
                        <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center"><ChevronRight className="w-6 h-6" /></div>
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/5 grid grid-cols-3 gap-4">
                  {['Instant', 'Secure', 'Direct'].map((word) => (
                    <div key={word} className="flex flex-col items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{word}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>


          {/* Right Column: Order Summary Card (Receipt Style) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden">
              {/* Receipt Jagged Edge Effect TOP */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[radial-gradient(circle_at_50%_100%,transparent_5px,#F8F9FB_6px)] dark:bg-[radial-gradient(circle_at_50%_100%,transparent_5px,#0A0A0B_6px)] bg-[length:20px_10px]"></div>

              <div className="text-center mb-8">
                <img src={logo} alt="SL" className="h-10 mx-auto mb-4 opacity-80" />
                <h3 className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tighter">Order Summary</h3>
                <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-1">Transaction Ref: #{Math.random().toString(36).slice(2, 10).toUpperCase()}</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Title</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white leading-tight mt-1 truncate max-w-[180px]">{itemName}</span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white mt-1">₹{basePrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between items-center bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 animate-in zoom-in duration-500">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">Coupon Bonus</span>
                      </div>
                      <span className="text-sm font-black text-emerald-600">-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-slate-500 px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest">Processing</span>
                    <span className="text-[10px] font-black uppercase text-emerald-500">Free</span>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-black/5 dark:border-white/5 pt-6 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Grand Total</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Inclusive of taxes</span>
                  </div>
                  <span className="text-4xl font-black text-primary drop-shadow-sm transition-all hover:scale-105 cursor-default">₹{finalCalculatedPrice.toLocaleString()}</span>
                </div>

                <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl flex gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed group">
                  <Shield className="w-5 h-5 shrink-0 text-emerald-500 group-hover:animate-bounce" />
                  <p>Your acquisition is protected by military-grade encryption and real-time ledger verification.</p>
                </div>
              </div>

              {/* Receipt Jagged Edge Effect BOTTOM */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[radial-gradient(circle_at_50%_0%,transparent_5px,#F8F9FB_6px)] dark:bg-[radial-gradient(circle_at_50%_0%,transparent_5px,#0A0A0B_6px)] bg-[length:20px_10px]"></div>
            </div>

            <div className="text-center p-6 bg-primary/5 rounded-[2rem] border border-primary/20 animate-pulse">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Priority Validation Active</p>
              <div className="mt-3 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>)}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* VERIFICATION OVERLAY - REDESIGNED */}
      {verificationState !== 'idle' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 max-w-lg w-full shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden border border-white/10">

            {/* Background Animations */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

            {verificationState === 'verifying' && (
              <div className="text-center relative z-10 space-y-10">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-black/5 dark:text-white/5" />
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray="289" strokeDashoffset={289 - (289 * timeLeft) / 60} className="text-primary transition-all duration-1000 ease-linear" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{timeLeft}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Confirming</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Authenticating Bank Data</h3>
                  <p className="text-slate-500 font-bold leading-relaxed max-w-xs mx-auto">
                    A dedicated validator is reviewing your Transaction ID against the merchant ledger. Stand by...
                  </p>
                </div>

                <div className="pt-8 space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Live Connection Established</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="w-full text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl h-14 text-xs font-black uppercase tracking-widest"
                  >
                    Proceed to Dashboard (Background Check)
                  </Button>
                </div>
              </div>
            )}

            {verificationState === 'success' && (
              <div className="text-center relative z-10 space-y-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 mx-auto bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/40 rotate-12">
                  <Check className="w-12 h-12 text-white stroke-[4]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">Validation Success!</h3>
                  <p className="text-slate-500 font-bold">Your assets have been unlocked and tied to your profile.</p>
                </div>
                <div className="bg-emerald-500/10 p-5 rounded-2xl text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" /> Synchronizing Dashboard...
                </div>
              </div>
            )}

            {verificationState === 'timeout' && (
              <div className="text-center relative z-10 space-y-8">
                <div className="w-24 h-24 mx-auto bg-primary/20 rounded-[2rem] flex items-center justify-center border-2 border-primary/50">
                  <Clock className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Verification Lag Encountered</h3>
                  <p className="text-slate-500 font-bold leading-relaxed">
                    The bank response is delayed. Your transaction has been logged and will be verified manually within 15 minutes.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-primary text-black hover:scale-[1.02] transition-transform font-black rounded-2xl h-16 shadow-xl"
                    onClick={() => navigate('/dashboard')}
                  >
                    Enter Dashboard Now
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-black/10 dark:border-white/10 rounded-2xl h-16 text-xs font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all"
                    onClick={() => window.open(`https://wa.me/${settings?.whatsapp_number || ''}?text=Hi, My payment is taking time. ID: ${transactionId}`, '_blank')}
                  >
                    <MessageCircle className="w-5 h-5 mr-3" /> Report Delay
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGateway;
