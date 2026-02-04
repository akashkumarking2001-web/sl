import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ShoppingBag,
    ArrowRight,
    Zap,
    X,
    Loader2,
    TicketPercent
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CartSummary = ({
    totalPrice,
    totalCashback,
    onCheckout
}: {
    totalPrice: number;
    totalCashback: number;
    onCheckout: (price: number, coupon: string | null) => void;
}) => {
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', couponCode.toUpperCase())
                .eq('is_active', true)
                .single();

            if (error || !data) throw new Error("Invalid coupon code");

            // Validate requirements
            if (data.min_order_value && totalPrice < data.min_order_value) {
                throw new Error(`Minimum order value of ₹${data.min_order_value} required`);
            }

            if (data.end_date && new Date(data.end_date) < new Date()) {
                throw new Error("Coupon has expired");
            }

            if (data.usage_limit && data.used_count >= data.usage_limit) {
                throw new Error("Coupon usage limit exceeded");
            }

            // Calculate Discount
            let discountAmount = 0;
            if (data.discount_type === 'percentage') {
                discountAmount = (totalPrice * data.discount_value) / 100;
                if (data.max_discount_amount) {
                    discountAmount = Math.min(discountAmount, data.max_discount_amount);
                }
            } else {
                discountAmount = data.discount_value;
            }

            setDiscount(Math.round(discountAmount));
            setAppliedCoupon(data.code);
            toast({ title: "Coupon Applied", description: `You saved ₹${Math.round(discountAmount)}!` });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            setDiscount(0);
            setAppliedCoupon(null);
        } finally {
            setLoading(false);
        }
    };

    const finalPrice = Math.max(0, totalPrice - discount);

    return (
        <div className="space-y-4">
            {/* Coupon Input */}
            <div className="flex gap-2">
                <Input
                    placeholder="Promo Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bg-background/50 h-10 border-border/50 focus-visible:ring-primary/20"
                    disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                    <Button variant="ghost" onClick={() => { setAppliedCoupon(null); setDiscount(0); setCouponCode(""); }} className="h-10 px-3 text-destructive hover:text-destructive">
                        <X className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button onClick={handleApplyCoupon} disabled={loading || !couponCode} className="h-10 w-20">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                    </Button>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-500 font-bold">
                        <span className="flex items-center gap-1"><TicketPercent className="w-3 h-3" /> Coupon ({appliedCoupon})</span>
                        <span>-₹{discount.toLocaleString()}</span>
                    </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                    <span className="font-bold text-lg text-foreground">Total Payable</span>
                    <span className="font-black text-2xl text-primary font-display">₹{finalPrice.toLocaleString()}</span>
                </div>

                {totalCashback > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <Zap className="w-4 h-4 fill-current" />
                        <div className="text-[10px] font-black uppercase tracking-wider">
                            You will earn ₹{totalCashback.toLocaleString()} Cashback
                        </div>
                    </div>
                )}
            </div>

            <Button
                className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 group uppercase tracking-tight"
                onClick={() => onCheckout(finalPrice, appliedCoupon)}
            >
                Checkout Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>
    );
};

export function CartSheet() {
    const { cart, removeFromCart, updateQuantity, totalItems, totalPrice, totalCashback } = useCart();
    const navigate = useNavigate();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl shrink-0 relative group border-primary/20 hover:bg-primary/5">
                    <ShoppingCart className="w-4 h-4 group-hover:text-primary transition-colors" />
                    {totalItems > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-[10px] font-black border-2 border-background animate-in zoom-in">
                            {totalItems}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 glass-card border-l border-border/50">
                <SheetHeader className="p-6 border-b border-border/50 bg-card/50 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-xl font-black flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                            Your <span className="text-primary italic">Cart</span>
                        </SheetTitle>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-1 px-6">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6">
                                <ShoppingCart className="w-10 h-10 text-muted-foreground/30" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Cart is empty</h3>
                            <p className="text-muted-foreground text-sm max-w-[200px]">
                                Add some premium products to start your journey.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6 py-6 font-display">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted border border-border/50 shrink-0">
                                        <img
                                            src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm truncate mb-1">{item.name}</h4>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-black text-primary">₹{item.price.toLocaleString()}</span>
                                            {item.cashback > 0 && (
                                                <Badge variant="outline" className="h-4 text-[8px] bg-emerald/5 border-emerald/20 text-emerald uppercase font-black px-1">
                                                    ₹{item.cashback} Cashback
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border/50">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-md hover:bg-background"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-md hover:bg-background"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {cart.length > 0 && (
                    <div className="p-6 bg-card/50 backdrop-blur-xl border-t border-border/50 font-display">
                        <CartSummary
                            totalPrice={totalPrice}
                            totalCashback={totalCashback}
                            onCheckout={(finalPrice, coupon) => navigate(`/payment?source=cart&amount=${finalPrice}&coupon=${coupon || ''}`)}
                        />
                        <p className="mt-4 text-[10px] text-center text-muted-foreground uppercase font-medium tracking-widest">
                            Secure checkout by Skill Learners
                        </p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
