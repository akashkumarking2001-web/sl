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
  Clock
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
          setTimeout(() => navigate('/dashboard'), 3000);
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
          const { error: bulkError } = await (supabase.from("shopping_orders") as any).insert(ordersToInsert);
          if (bulkError) throw bulkError;

          clearCart();
          setIsSubmitted(true);
          toast({ title: "Success", description: "Order placed successfully." });

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

          const { error: orderError } = await (supabase.from("shopping_orders") as any).insert({
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
          });
          if (orderError) throw orderError;
          setIsSubmitted(true);
          toast({ title: "Order Placed", description: "Verifying transaction..." });

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Shield className="w-5 h-5 text-emerald-600 fill-current" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">Secure Checkout</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            {isPhysical && (
              <>
                <span className={cn("transition-colors", checkoutStep === 'address' ? "text-slate-900" : "")}>Address</span>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            <span className={cn("transition-colors", checkoutStep === 'method' ? "text-slate-900" : "")}>Method</span>
            <ChevronRight className="w-3 h-3" />
            <span className={cn("transition-colors", checkoutStep === 'payment' ? "text-slate-900" : "")}>Payment</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* ... existing content ... */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* ... existing grid content ... */}
          {/* Left Column: Steps */}
          <div className="lg:col-span-8 space-y-8">

            {/* STEP 1: ADDRESS (Physical Only) */}
            {isPhysical && (checkoutStep === 'address' || selectedAddress) && (
              <div className={cn(
                "bg-white p-8 rounded-[2rem] border transition-all duration-500",
                checkoutStep === 'address' ? "border-[#FBBF24] shadow-xl shadow-[#FBBF24]/5 ring-4 ring-[#FBBF24]/10" : "border-slate-100 opacity-60 grayscale-[0.5]"
              )}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black flex items-center gap-3 text-slate-900">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">1</div>
                    Delivery Address
                  </h2>
                  {checkoutStep !== 'address' && <Button variant="link" onClick={() => setCheckoutStep('address')} className="text-[#FBBF24] font-bold">Change</Button>}
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
                        className="h-14 px-8 rounded-xl bg-[#FBBF24] text-black hover:bg-[#FBBF24]/90 font-bold text-lg shadow-lg shadow-[#FBBF24]/20"
                        disabled={!selectedAddress}
                      >
                        Proceed to Method <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pl-14">
                    <p className="font-bold text-lg text-slate-900">{selectedAddress?.full_name}</p>
                    <p className="text-slate-500">{selectedAddress?.address_line1}, {selectedAddress?.city}</p>
                    <p className="text-slate-500">{selectedAddress?.state} - {selectedAddress?.postal_code}</p>
                  </div>
                )}
              </div>
            )}


            {/* STEP 2: METHOD */}
            {(checkoutStep === 'method' || checkoutStep === 'payment') && (
              <div className={cn(
                "bg-white p-8 rounded-[2rem] border transition-all duration-500",
                checkoutStep === 'method' ? "border-[#FBBF24] shadow-xl shadow-[#FBBF24]/5 ring-4 ring-[#FBBF24]/10" : "border-slate-100"
              )}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black flex items-center gap-3 text-slate-900">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold border", checkoutStep === 'method' ? "bg-slate-900 text-white border-slate-900" : "bg-slate-100 text-slate-500 border-slate-200")}>{isPhysical ? 2 : 1}</div>
                    Payment Method
                  </h2>
                  {checkoutStep === 'payment' && <Button variant="link" onClick={() => setCheckoutStep('method')} className="text-[#FBBF24] font-bold">Change</Button>}
                </div>

                {checkoutStep === 'method' ? (
                  <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pl-2">
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={cn(
                        "p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg relative overflow-hidden group",
                        paymentMethod === 'upi' ? "border-blue-500 bg-blue-50/50" : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                      )}
                    >
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform"><IndianRupee className="w-6 h-6" /></div>
                        <span className="font-bold text-lg block mb-1 text-slate-900">UPI Payment</span>
                        <p className="text-sm text-slate-500 font-medium">Google Pay, PhonePe, Paytm</p>
                      </div>
                      {paymentMethod === 'upi' && <div className="absolute top-4 right-4 text-blue-500"><CheckCircle2 className="w-6 h-6 fill-current" /></div>}
                    </button>

                    <button
                      onClick={() => setPaymentMethod('crypto')}
                      className={cn(
                        "p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg relative overflow-hidden group",
                        paymentMethod === 'crypto' ? "border-amber-500 bg-amber-50/50" : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                      )}
                    >
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform"><Bitcoin className="w-6 h-6" /></div>
                        <span className="font-bold text-lg block mb-1 text-slate-900">Crypto (USDT)</span>
                        <p className="text-sm text-slate-500 font-medium">TRC20 Network Only</p>
                      </div>
                      {paymentMethod === 'crypto' && <div className="absolute top-4 right-4 text-amber-500"><CheckCircle2 className="w-6 h-6 fill-current" /></div>}
                    </button>

                    <div className="sm:col-span-2 mt-6 flex justify-end">
                      <Button
                        onClick={() => {
                          if (!paymentMethod) return toast({ title: "Select Method", variant: "destructive" });
                          setCheckoutStep('payment');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={!paymentMethod}
                        className="h-14 px-8 rounded-xl bg-[#FBBF24] text-black hover:bg-[#FBBF24]/90 font-bold text-lg shadow-lg shadow-[#FBBF24]/20 w-full sm:w-auto"
                      >
                        Continue to Pay <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pl-14 flex items-center gap-3 text-lg font-bold text-slate-900">
                    <div className={cn("p-2 rounded-lg", paymentMethod === 'upi' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600")}>
                      {paymentMethod === 'upi' ? <IndianRupee className="w-5 h-5" /> : <Bitcoin className="w-5 h-5" />}
                    </div>
                    {paymentMethod === 'upi' ? 'UPI Transfer' : 'Crypto (USDT)'}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: PAYMENT FORM */}
            {checkoutStep === 'payment' && (
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Complete Payment</h2>
                    <p className="text-slate-500 font-medium">Scan the code or copy details below</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* QR / Details */}
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                    {(isPhysical ? settings?.shop_qr_code_url : settings?.qr_code_url) ? (
                      <img src={isPhysical ? settings.shop_qr_code_url : settings.qr_code_url} className="w-48 h-48 rounded-xl shadow-sm mb-4 bg-white p-2" />
                    ) : (
                      <div className="w-48 h-48 rounded-xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center mb-4 text-slate-300">
                        <QrCode className="w-12 h-12" />
                      </div>
                    )}
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Scan to Pay</p>
                  </div>

                  {/* Copy Fields */}
                  <div className="space-y-6 flex flex-col justify-center">
                    {paymentMethod === 'upi' ? (
                      <div className="space-y-4">
                        <Label className="text-slate-500 uppercase text-xs font-bold tracking-wider">UPI ID</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-slate-400 font-bold">@</span>
                            </div>
                            <Input value={(isPhysical ? settings?.shop_upi_id : settings?.upi_id) || "admin@upi"} readOnly className="pl-8 h-12 bg-slate-50 border-slate-200 font-bold text-slate-900" />
                          </div>
                          <Button size="icon" className="h-12 w-12 rounded-xl" variant="outline" onClick={() => copyToClipboard((isPhysical ? settings?.shop_upi_id : settings?.upi_id), "UPI")}><Copy className="w-4 h-4" /></Button>
                        </div>
                        <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-xs font-bold">
                          Use Google Pay, PhonePe or Paytm to transfer the exact amount.
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Label className="text-slate-500 uppercase text-xs font-bold tracking-wider">Tether (USDT) Address</Label>
                        <div className="flex gap-2">
                          <Input value={(isPhysical ? settings?.shop_usdt_address : settings?.usdt_address) || "TRC20..."} readOnly className="h-12 bg-slate-50 border-slate-200 font-mono text-xs font-bold text-slate-900" />
                          <Button size="icon" className="h-12 w-12 rounded-xl" variant="outline" onClick={() => copyToClipboard((isPhysical ? settings?.shop_usdt_address : settings?.usdt_address), "Address")}><Copy className="w-4 h-4" /></Button>
                        </div>
                        <div className="bg-amber-50 text-amber-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" /> Important: Send to TRC20 Network only.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 space-y-6">
                  <div>
                    <Label className="text-slate-900 font-bold mb-2 block">Transaction ID / UTR Number</Label>
                    <Input
                      value={transactionId}
                      onChange={e => setTransactionId(e.target.value)}
                      placeholder="e.g. 123456789012"
                      className="h-14 bg-white border-slate-200 focus:border-[#FBBF24] text-lg tracking-wide rounded-xl shadow-sm"
                      required
                    />
                    <p className="text-xs text-slate-500 mt-2 font-medium">Enter the 12-digit reference number from your payment app.</p>
                  </div>
                  <div>
                    <Label className="text-slate-900 font-bold mb-2 block">Payment Screenshot</Label>
                    <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center text-slate-400 hover:border-[#FBBF24] hover:text-[#FBBF24] transition-colors cursor-pointer relative">
                      <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {screenshot ? (
                        <span className="font-bold text-emerald-500 flex items-center gap-2"><Check className="w-4 h-4" /> {screenshot.name} selected</span>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 mb-1" />
                          <span className="text-xs font-bold">Upload Proof</span>
                        </>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black bg-black hover:bg-zinc-800 text-white shadow-xl mt-4 border border-zinc-800/10" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : `Confirm & Pay ₹${finalCalculatedPrice.toLocaleString()}`}
                  </Button>
                </form>
              </div>
            )}
          </div>


          {/* Right Column: Order Summary (Conditionally Rendered) */}
          {!isDigital && (
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <h3 className="font-black text-xl mb-6 text-slate-900">Order Summary</h3>
                {/* ... content ... */}
                {/* ... reusing existing summary block ... */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Product</span>
                    <span className="text-slate-900 font-bold truncate max-w-[150px]">{itemName}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Subtotal</span>
                    <span>₹{basePrice.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm font-bold text-emerald-500">
                      <span>Coupon Applied</span>
                      <span>-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-bold">Free</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2" />
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-lg text-slate-900">Total</span>
                    <span className="font-black text-3xl text-[#FBBF24]">₹{finalCalculatedPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl flex gap-3 text-xs font-medium text-slate-500 leading-relaxed border border-slate-100">
                  <Shield className="w-5 h-5 shrink-0 text-emerald-500" />
                  <p>Your payment information is encrypted. We do not store your credit card details.</p>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                  <div className="h-6 w-10 bg-slate-200 rounded"></div>
                  <div className="h-6 w-10 bg-slate-200 rounded"></div>
                  <div className="h-6 w-10 bg-slate-200 rounded"></div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Need Help?</p>
                <Button variant="link" className="text-[#FBBF24] font-bold">Contact Support</Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Verification Overlay for Digital Products */}
      {verificationState !== 'idle' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/20 relative overflow-hidden">

            {/* Background Decorative Blob */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

            {verificationState === 'verifying' && (
              <div className="text-center relative z-10 space-y-8">
                <div className="w-24 h-24 mx-auto relative flex items-center justify-center">
                  {/* Animated Progress Ring */}
                  <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="45" fill="none" stroke="#FBBF24" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * timeLeft) / 60}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{timeLeft}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sec</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Verifying Payment...</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    We are confirming your transaction with the bank. This usually takes less than a minute.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Do not close/refresh</p>

                  <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="w-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl h-12 text-xs font-bold"
                  >
                    Skip Waiting & Check Later
                  </Button>
                </div>
              </div>
            )}

            {verificationState === 'success' && (
              <div className="text-center relative z-10 space-y-6">
                <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Payment Verified!</h3>
                  <p className="text-slate-500 text-sm">Your purchase has been activated successfully.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" /> Redirecting to dashboard...
                </div>
              </div>
            )}

            {verificationState === 'timeout' && (
              <div className="text-center relative z-10 space-y-6">
                <div className="w-20 h-20 mx-auto bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4 border border-amber-100">
                  <Clock className="w-10 h-10 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Taking Longer Than Usual</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    We received your request, but verification is still pending. Don't worry, your funds are safe!
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-primary text-black hover:bg-primary/90 font-bold rounded-xl h-12 shadow-lg shadow-primary/20"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-slate-200 dark:border-slate-700 rounded-xl h-11 text-xs font-bold text-emerald-600"
                    onClick={() => window.open(`https://wa.me/${settings?.whatsapp_number || ''}?text=Hi, I made a payment but it's pending. Trans ID: ${transactionId}`, '_blank')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
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
