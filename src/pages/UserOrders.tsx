import { useState, useEffect } from "react";
import {
    ShoppingBag,
    Truck,
    Calendar,
    ChevronRight,
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    MapPin,
    ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import ShoppingSidebar from "@/components/layout/ShoppingSidebar";

const UserOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("shopping_orders")
                .select(`
                    *,
                    products:product_id (name, image_url, price)
                `)
                .eq("user_id", user?.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved": return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 capitalize font-bold">Approved</Badge>;
            case "rejected": return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 capitalize font-bold">Rejected</Badge>;
            default: return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 capitalize font-bold">Pending Review</Badge>;
        }
    };

    const getDeliveryProgress = (status: string) => {
        const statuses = ["processing", "shipped", "out_for_delivery", "delivered"];
        const currentIndex = statuses.indexOf(status?.toLowerCase());

        if (currentIndex === -1 && status !== "delivered") return "Processing Order";
        if (status === "delivered") return "Delivered Successfully";

        return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    };

    const Content = () => (
        <div className="container mx-auto px-4 pt-8 pb-12 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mb-4 text-muted-foreground hover:text-primary p-0"
                            onClick={() => navigate("/shopping")}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Store
                        </Button>
                        <h1 className="text-3xl font-black tracking-tight">My <span className="text-primary italic">Orders</span></h1>
                        <p className="text-muted-foreground text-sm mt-1">Track your premium product purchases and cashback</p>
                    </div>
                    <div className="hidden sm:block">
                        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center">
                            <Package className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 glass-card rounded-3xl animate-pulse bg-muted/10 border border-border/50" />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 glass-card rounded-[2.5rem] border-dashed border-2 bg-muted/5">
                        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
                        <h2 className="text-xl font-bold mb-2">No orders yet</h2>
                        <p className="text-muted-foreground mb-8">You haven't purchased any premium products yet.</p>
                        <Button
                            onClick={() => navigate("/shopping")}
                            className="rounded-2xl px-8 h-12 font-bold shadow-xl shadow-primary/20"
                        >
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="glass-card rounded-[2rem] overflow-hidden border border-border/50 hover:border-primary/30 transition-all group bg-card/50"
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted shrink-0 border border-border/50">
                                            <img
                                                src={order.products?.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"}
                                                alt={order.products?.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{order.products?.name}</h3>
                                                    <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                                        </span>
                                                        <span className="font-mono">ID: {order.transaction_id.substring(0, 12)}...</span>
                                                    </div>
                                                </div>
                                                <div className="text-lg font-black text-foreground">
                                                    ₹{order.total_price}
                                                </div>
                                            </div>

                                            {/* Tracking Progress */}
                                            <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    {getStatusBadge(order.status)}
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                                        <Truck className="w-3 h-3" />
                                                        {getDeliveryProgress(order.delivery_status)}
                                                    </div>
                                                </div>

                                                {order.cashback_amount > 0 && order.status === "approved" && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald/10 border border-emerald/20 text-emerald text-[10px] font-black rounded-lg uppercase tracking-wider">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        ₹{order.cashback_amount} Cashback Earned
                                                    </div>
                                                )}
                                            </div>

                                            {/* Delivery info */}
                                            {order.admin_notes && (
                                                <div className="p-4 bg-muted/40 rounded-2xl text-sm border border-border/30 flex items-start gap-3">
                                                    <Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-xs uppercase mb-1 tracking-wider opacity-60">Status Update</p>
                                                        <p className="text-muted-foreground italic leading-relaxed">{order.admin_notes}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    if (user) {
        return (
            <ShoppingSidebar>
                <Content />
            </ShoppingSidebar>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Content />
        </div>
    );
};

export default UserOrders;
