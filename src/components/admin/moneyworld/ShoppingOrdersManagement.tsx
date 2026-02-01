import { useState, useEffect } from "react";
import {
    Loader2,
    Search,
    Filter,
    Eye,
    CheckCircle2,
    XCircle,
    Truck,
    Calendar,
    User,
    ShoppingBag,
    CreditCard,
    ExternalLink,
    Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { logAudit } from "@/lib/audit";

const ShoppingOrdersManagement = ({ onRefresh }: { onRefresh?: () => void }) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [adminNotes, setAdminNotes] = useState("");
    const [processingOrder, setProcessingOrder] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("shopping_orders")
                .select(`
                    *,
                    profiles:user_id (full_name, email),
                    products:product_id (name, price),
                    affiliate:affiliate_user_id (full_name, email)
                `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error: any) {
            console.error("Error fetching orders:", error);
            toast({
                title: "Error",
                description: "Failed to load orders.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string, deliveryStatus?: string) => {
        try {
            setProcessingOrder(true);

            // Get current order data to check if cashback was already granted
            const activeOrder = orders.find(o => o.id === orderId);
            const isMarkingAsDelivered = deliveryStatus === 'delivered' && activeOrder?.delivery_status !== 'delivered';

            const updates: any = {
                status: newStatus,
                admin_notes: adminNotes,
                updated_at: new Date().toISOString()
            };

            if (deliveryStatus) {
                updates.delivery_status = deliveryStatus;
            }

            const { error } = await supabase
                .from("shopping_orders")
                .update(updates)
                .eq("id", orderId);

            if (error) throw error;

            await logAudit(
                'status_update',
                'order',
                orderId,
                { status: newStatus, delivery_status: deliveryStatus, admin_notes: adminNotes }
            );

            // Handle Cashback logic if marking as delivered and approved
            if (isMarkingAsDelivered && newStatus === 'approved') {
                // 1. Process Cashback
                if ((activeOrder?.cashback_amount || 0) > 0) {
                    const userId = activeOrder.user_id;
                    const cashback = activeOrder.cashback_amount;

                    const { data: incomeData } = await (supabase as any)
                        .from("agent_income")
                        .select("wallet")
                        .eq("user_id", userId)
                        .maybeSingle();

                    if (incomeData) {
                        await (supabase as any)
                            .from("agent_income")
                            .update({ wallet: Number(incomeData.wallet) + Number(cashback) })
                            .eq("user_id", userId);
                    } else {
                        await (supabase as any)
                            .from("agent_income")
                            .insert({ user_id: userId, wallet: cashback });
                    }

                    await (supabase as any).from("wallet_history").insert({
                        user_id: userId,
                        amount: cashback,
                        status: "credit",
                        description: `Cashback: ${activeOrder.products?.name}`,
                        reference_id: orderId,
                        reference_type: "shopping_cashback"
                    });

                    toast({
                        title: "Cashback Released",
                        description: `₹${cashback} credited to user's wallet.`,
                    });
                }

                // 2. Process Affiliate Commission
                if (activeOrder?.affiliate_user_id) {
                    const { error: affiliateError } = await supabase.rpc(
                        'process_affiliate_commission',
                        { p_order_id: orderId }
                    );

                    if (affiliateError) {
                        console.error("Affiliate commission error:", affiliateError);
                        toast({
                            title: "Commission Error",
                            description: "Failed to credit affiliate commission.",
                            variant: "destructive"
                        });
                    } else {
                        toast({
                            title: "Commission Processed",
                            description: "Affiliate commission credited successfully.",
                        });
                    }
                }
            }

            toast({
                title: "Order Updated",
                description: `Order status changed to ${newStatus}.`,
            });

            fetchOrders();
            if (onRefresh) onRefresh();
            setSelectedOrder(null);
            setAdminNotes("");
        } catch (error: any) {
            console.error("Error updating order:", error);
            toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setProcessingOrder(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "rejected": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
            default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
        }
    };

    const getDeliveryStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "shipped": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "processing": return "bg-primary/10 text-primary border-primary/20";
            default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Transaction ID or User..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Orders</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={fetchOrders}>
                        <Truck className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="text-left p-4 font-bold text-xs uppercase tracking-wider">Order Info</th>
                                <th className="text-left p-4 font-bold text-xs uppercase tracking-wider">Customer</th>
                                <th className="text-left p-4 font-bold text-xs uppercase tracking-wider">Amount</th>
                                <th className="text-left p-4 font-bold text-xs uppercase tracking-wider">Status</th>
                                <th className="text-right p-4 font-bold text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold flex items-center gap-1">
                                                    <ShoppingBag className="w-3 h-3 text-primary" />
                                                    {order.products?.name || "Unknown Product"}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground font-mono mt-1">
                                                    TXN: {order.transaction_id}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Calendar className="w-2.5 h-2.5" />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col text-sm">
                                                <span className="font-medium">{order.profiles?.full_name || "Unknown User"}</span>
                                                <span className="text-xs text-muted-foreground">{order.profiles?.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-black text-foreground">₹{order.total_price}</span>
                                                <div className="flex flex-col gap-0.5 mt-1">
                                                    {order.cashback_amount > 0 && (
                                                        <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-1.5 py-0.5 rounded-full w-fit">
                                                            +₹{order.cashback_amount} Cashback
                                                        </span>
                                                    )}
                                                    {order.affiliate_user_id && (
                                                        <span className="text-[10px] text-blue-500 font-bold bg-blue-500/5 px-1.5 py-0.5 rounded-full w-fit flex items-center gap-1">
                                                            <User className="w-2.5 h-2.5" />
                                                            Ref: {order.affiliate?.full_name?.split(' ')[0] || 'Affiliate'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <Badge className={`${getStatusColor(order.status)} border shadow-none capitalize`}>
                                                    {order.status}
                                                </Badge>
                                                <Badge variant="outline" className={`${getDeliveryStatusColor(order.delivery_status)} border-none text-[9px] h-4 px-1.5 capitalize`}>
                                                    {order.delivery_status || "Pending Processing"}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => {
                                                        setSelectedOrder(order);
                                                        setAdminNotes(order.admin_notes || "");
                                                    }}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            <ShoppingBag className="w-5 h-5 text-primary" />
                                                            Order Details
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Transaction ID: {order.transaction_id}
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                        <div className="space-y-4">
                                                            <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                                                                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Order Information</h4>
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-muted-foreground">Product:</span>
                                                                    <span className="font-bold">{order.products?.name}</span>
                                                                </div>
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-muted-foreground">Quantity:</span>
                                                                    <span className="font-bold">{order.quantity || 1}</span>
                                                                </div>
                                                                <div className="flex justify-between text-sm pt-2 border-t">
                                                                    <span className="font-bold">Total Amount:</span>
                                                                    <span className="font-black text-primary">₹{order.total_price}</span>
                                                                </div>
                                                            </div>

                                                            <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                                                                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Shipping Address</h4>
                                                                <p className="text-sm italic leading-relaxed">
                                                                    {order.shipping_address || "No address provided"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            {/* User & Affiliate Info */}
                                                            <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                                                                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Customer & Affiliate</h4>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                        <User className="w-4 h-4 text-primary" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold">{order.profiles?.full_name}</p>
                                                                        <p className="text-xs text-muted-foreground">{order.profiles?.email}</p>
                                                                    </div>
                                                                </div>
                                                                {order.affiliate_user_id && (
                                                                    <div className="pt-3 border-t flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                                            <Wallet className="w-4 h-4 text-blue-500" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-bold text-blue-600">Referred by: {order.affiliate?.full_name}</p>
                                                                            <p className="text-[10px] text-muted-foreground">Commission: 10%</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                                                                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Payment Proof</h4>
                                                                {order.screenshot_url ? (
                                                                    <div className="aspect-video relative rounded-lg overflow-hidden border border-border shadow-sm group">
                                                                        <img
                                                                            src={order.screenshot_url}
                                                                            alt="Payment Proof"
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                        <a
                                                                            href={order.screenshot_url}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <ExternalLink className="w-6 h-6 text-white" />
                                                                        </a>
                                                                    </div>
                                                                ) : (
                                                                    <div className="aspect-video bg-muted flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground">
                                                                        <XCircle className="w-8 h-8 mb-2" />
                                                                        <span className="text-xs">No screenshot uploaded</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 space-y-4">
                                                        <div>
                                                            <Label className="text-xs font-black uppercase mb-1.5 block">Admin Notes (internal & user visible)</Label>
                                                            <Textarea
                                                                placeholder="Reason for rejection or shipping details..."
                                                                value={adminNotes}
                                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                                rows={3}
                                                                className="rounded-xl border-border/50 focus:border-primary/50"
                                                            />
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                                                            {order.status === "pending" ? (
                                                                <>
                                                                    <Button
                                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                                                        onClick={() => handleUpdateStatus(order.id, "approved", "processing")}
                                                                        disabled={processingOrder}
                                                                    >
                                                                        {processingOrder ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                                                        Approve Order
                                                                    </Button>
                                                                    <Button
                                                                        variant="destructive"
                                                                        className="font-bold"
                                                                        onClick={() => handleUpdateStatus(order.id, "rejected")}
                                                                        disabled={processingOrder}
                                                                    >
                                                                        {processingOrder ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                                                                        Reject Order
                                                                    </Button>
                                                                </>
                                                            ) : order.status === "approved" ? (
                                                                <div className="flex items-center gap-3 w-full">
                                                                    <Select
                                                                        defaultValue={order.delivery_status || "processing"}
                                                                        onValueChange={(val) => handleUpdateStatus(order.id, "approved", val)}
                                                                    >
                                                                        <SelectTrigger className="w-full sm:w-60 h-11 rounded-xl">
                                                                            <Truck className="w-4 h-4 mr-2 text-primary" />
                                                                            <SelectValue placeholder="Update Delivery Status" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="processing">Processing</SelectItem>
                                                                            <SelectItem value="shipped">Shipped</SelectItem>
                                                                            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                                                            <SelectItem value="delivered">Delivered</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <p className="text-xs text-muted-foreground italic">
                                                                        Order is already {order.status}. Update delivery progress above.
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div className="w-full p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-500 font-bold text-sm">
                                                                    <XCircle className="w-4 h-4" />
                                                                    Order was rejected. No further actions possible.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShoppingOrdersManagement;
