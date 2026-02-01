import { useState, useEffect } from "react";
import {
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    Eye,
    Search,
    Filter,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";

interface Order {
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    cashback_amount: number;
    status: string;
    payment_status: string;
    tracking_number: string | null;
    created_at: string;
    products: {
        name: string;
        image_url: string;
    } | null;
}

const MyOrdersPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const { data, error } = await (supabase as any)
                .from("shopping_orders")
                .select(`
                    *,
                    products (
                        name,
                        image_url
                    )
                `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "confirmed":
            case "processing":
                return <Package className="w-4 h-4" />;
            case "shipped":
                return <Truck className="w-4 h-4" />;
            case "delivered":
                return <CheckCircle2 className="w-4 h-4" />;
            case "cancelled":
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "confirmed":
            case "processing":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "shipped":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "delivered":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "cancelled":
                return "bg-destructive/10 text-destructive border-destructive/20";
            default:
                return "bg-muted/10 text-muted-foreground border-muted/20";
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.products?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: orders.length,
        pending: orders.filter(o => o.status === "pending").length,
        processing: orders.filter(o => o.status === "processing" || o.status === "confirmed").length,
        shipped: orders.filter(o => o.status === "shipped").length,
        delivered: orders.filter(o => o.status === "delivered").length,
        cancelled: orders.filter(o => o.status === "cancelled").length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black mb-2">My Orders</h1>
                    <p className="text-muted-foreground">
                        Track and manage your shopping orders
                    </p>
                </div>

                {/* Filters */}
                <div className="glass-card p-6 rounded-2xl mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search by order ID or product name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2 overflow-x-auto">
                            <Button
                                variant={statusFilter === null ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter(null)}
                            >
                                All ({statusCounts.all})
                            </Button>
                            <Button
                                variant={statusFilter === "pending" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter("pending")}
                            >
                                Pending ({statusCounts.pending})
                            </Button>
                            <Button
                                variant={statusFilter === "processing" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter("processing")}
                            >
                                Processing ({statusCounts.processing})
                            </Button>
                            <Button
                                variant={statusFilter === "shipped" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter("shipped")}
                            >
                                Shipped ({statusCounts.shipped})
                            </Button>
                            <Button
                                variant={statusFilter === "delivered" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter("delivered")}
                            >
                                Delivered ({statusCounts.delivered})
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="glass-card p-6 rounded-2xl animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 bg-muted rounded-lg"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-muted rounded w-1/3"></div>
                                        <div className="h-3 bg-muted rounded w-1/4"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold mb-2">No orders found</h3>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery || statusFilter
                                ? "Try adjusting your filters"
                                : "Start shopping to see your orders here"}
                        </p>
                        <Button onClick={() => window.location.href = "/shopping"}>
                            Browse Products
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map(order => (
                            <div
                                key={order.id}
                                className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all cursor-pointer"
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                                        {order.products?.image_url && (
                                            <img
                                                src={order.products.image_url}
                                                alt={order.products.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    {/* Order Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg mb-1">
                                                    {order.products?.name || "Product"}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Order ID: {order.id.slice(0, 8)}...
                                                </p>
                                            </div>
                                            <Badge className={cn("gap-1", getStatusColor(order.status))}>
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Quantity</p>
                                                <p className="font-semibold">{order.quantity}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Total Price</p>
                                                <p className="font-semibold">₹{order.total_price.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Cashback</p>
                                                <p className="font-semibold text-emerald-500">₹{order.cashback_amount}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Order Date</p>
                                                <p className="font-semibold">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {order.tracking_number && (
                                            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                                                <p className="text-xs text-muted-foreground mb-1">Tracking Number</p>
                                                <p className="font-mono font-semibold">{order.tracking_number}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <Button variant="outline" size="sm" className="shrink-0">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Details Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            Order ID: {selectedOrder?.id}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Product Info */}
                            <div className="flex gap-4">
                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                                    {selectedOrder.products?.image_url && (
                                        <img
                                            src={selectedOrder.products.image_url}
                                            alt={selectedOrder.products.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{selectedOrder.products?.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Quantity: {selectedOrder.quantity}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Unit Price: ₹{selectedOrder.unit_price.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <h4 className="font-semibold mb-2">Order Status</h4>
                                <Badge className={cn("gap-1", getStatusColor(selectedOrder.status))}>
                                    {getStatusIcon(selectedOrder.status)}
                                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                </Badge>
                            </div>

                            {/* Pricing */}
                            <div className="glass-card p-4 rounded-xl space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-semibold">₹{selectedOrder.total_price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-emerald-500">
                                    <span>Cashback</span>
                                    <span className="font-semibold">₹{selectedOrder.cashback_amount}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                                    <span>Total Paid</span>
                                    <span>₹{selectedOrder.total_price.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Tracking */}
                            {selectedOrder.tracking_number && (
                                <div>
                                    <h4 className="font-semibold mb-2">Tracking Information</h4>
                                    <div className="glass-card p-4 rounded-xl">
                                        <p className="font-mono">{selectedOrder.tracking_number}</p>
                                    </div>
                                </div>
                            )}

                            {/* Dates */}
                            <div className="text-sm text-muted-foreground">
                                <p>Ordered on: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MyOrdersPage;
