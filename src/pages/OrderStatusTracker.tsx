import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    RefreshCw,
    Package,
    CreditCard,
    AlertCircle,
    ArrowLeft,
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface PaymentStatus {
    id: string;
    user_id: string;
    amount: number;
    plan_name: string;
    transaction_id: string | null;
    screenshot_url: string | null;
    status: string | null;
    admin_notes: string | null;
    approved_at: string | null;
    created_at: string;
}

interface OrderStatus {
    id: string;
    user_id: string;
    product_id: string | null;
    total_price: number;
    transaction_id: string | null;
    status: string;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
}

type CombinedItem = (PaymentStatus & { type: 'payment' }) | (OrderStatus & { type: 'order' });

const OrderStatusTracker = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [payments, setPayments] = useState<PaymentStatus[]>([]);
    const [orders, setOrders] = useState<OrderStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<CombinedItem | null>(null);

    // Fetch user's payments and orders
    const fetchData = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            // Fetch package payments
            const { data: paymentsData, error: paymentsError } = await supabase
                .from('payments')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (paymentsError) throw paymentsError;

            // Fetch shopping orders
            const { data: ordersData, error: ordersError } = await (supabase
                .from('shopping_orders') as any)
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            setPayments(paymentsData || []);
            setOrders(ordersData || []);
        } catch (error: any) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load order status',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Set up real-time subscription for status updates
        if (!user?.id) return;

        const paymentsChannel = supabase
            .channel(`user-payments-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'payments',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    const updated = payload.new as PaymentStatus;
                    setPayments((prev) =>
                        prev.map((p) => (p.id === updated.id ? updated : p))
                    );

                    // Show toast notification
                    if (updated.status === 'approved') {
                        toast({
                            title: '✅ Payment Approved!',
                            description: `Your ${updated.plan_name} purchase has been activated.`,
                        });
                    } else if (updated.status === 'rejected') {
                        toast({
                            title: '❌ Payment Rejected',
                            description: updated.admin_notes || 'Please contact support for details.',
                            variant: 'destructive',
                        });
                    }
                }
            )
            .subscribe();

        const ordersChannel = supabase
            .channel(`user-orders-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'shopping_orders',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    const updated = payload.new as OrderStatus;
                    setOrders((prev) =>
                        prev.map((o) => (o.id === updated.id ? updated : o))
                    );

                    // Show toast notification
                    if (updated.status === 'approved' || updated.status === 'shipped') {
                        toast({
                            title: '📦 Order Update',
                            description: `Your order status: ${updated.status}`,
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(paymentsChannel);
            supabase.removeChannel(ordersChannel);
        };
    }, [user?.id]);

    // Get status badge
    const getStatusBadge = (status: string | null) => {
        switch (status) {
            case 'approved':
                return (
                    <Badge className="bg-emerald/10 text-emerald border-emerald/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Approved
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-amber/10 text-amber border-amber/20">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Review
                    </Badge>
                );
            case 'shipped':
                return (
                    <Badge className="bg-blue/10 text-blue border-blue/20">
                        <Package className="w-3 h-3 mr-1" />
                        Shipped
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Unknown
                    </Badge>
                );
        }
    };

    // Get status timeline
    const getStatusTimeline = (item: PaymentStatus | OrderStatus) => {
        const steps = [
            {
                label: 'Submitted',
                completed: true,
                timestamp: item.created_at,
            },
            {
                label: 'Under Review',
                completed: item.status !== 'pending',
                timestamp: null,
            },
            {
                label: item.status === 'rejected' ? 'Rejected' : 'Approved',
                completed: item.status === 'approved' || item.status === 'rejected',
                timestamp: 'approved_at' in item ? item.approved_at : null,
            },
        ];

        return steps;
    };

    const allItems: CombinedItem[] = [
        ...payments.map((p) => ({ ...p, type: 'payment' as const })),
        ...orders.map((o) => ({ ...o, type: 'order' as const })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/user-home">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold font-display">Order Status</h1>
                            <p className="text-sm text-muted-foreground">
                                Track your payments and orders in real-time
                            </p>
                        </div>
                    </div>

                    <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl bg-card border border-border/50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {allItems.filter((i) => i.status === 'pending').length}
                                </p>
                                <p className="text-xs text-muted-foreground">Pending</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-card border border-border/50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {allItems.filter((i) => i.status === 'approved').length}
                                </p>
                                <p className="text-xs text-muted-foreground">Approved</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-card border border-border/50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{allItems.length}</p>
                                <p className="text-xs text-muted-foreground">Total Orders</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-muted-foreground" />
                            <p className="text-muted-foreground">Loading your orders...</p>
                        </div>
                    ) : allItems.length === 0 ? (
                        <div className="text-center py-12 rounded-xl bg-card border border-border/50">
                            <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                            <p className="text-muted-foreground">No orders yet</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Your purchases will appear here
                            </p>
                        </div>
                    ) : (
                        allItems.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl bg-card border border-border/50 p-6 hover:border-primary/30 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg">
                                                {item.type === 'payment' && 'plan_name' in item
                                                    ? item.plan_name
                                                    : `Order #${item.id.slice(0, 8)}`}
                                            </h3>
                                            {getStatusBadge(item.status)}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>
                                                Amount: <strong className="text-foreground">₹{item.type === 'payment' ? (item as PaymentStatus & { type: 'payment' }).amount : (item as OrderStatus & { type: 'order' }).total_price}</strong>
                                            </span>
                                            <span>•</span>
                                            <span>{format(new Date(item.created_at), 'MMM dd, yyyy')}</span>
                                            {item.transaction_id && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-mono text-xs">
                                                        TXN: {item.transaction_id.slice(0, 12)}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Details
                                    </Button>
                                </div>

                                {/* Timeline */}
                                <div className="flex items-center gap-2 mt-4">
                                    {getStatusTimeline(item).map((step, index) => (
                                        <div key={index} className="flex items-center flex-1">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed
                                                        ? 'bg-primary text-white'
                                                        : 'bg-muted text-muted-foreground'
                                                        }`}
                                                >
                                                    {step.completed ? (
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    ) : (
                                                        <Clock className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <p className="text-xs mt-1 text-center">{step.label}</p>
                                                {step.timestamp && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(step.timestamp), 'MMM dd')}
                                                    </p>
                                                )}
                                            </div>
                                            {index < getStatusTimeline(item).length - 1 && (
                                                <div
                                                    className={`flex-1 h-0.5 ${step.completed ? 'bg-primary' : 'bg-muted'
                                                        }`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Admin Notes */}
                                {item.admin_notes && (
                                    <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
                                        <p className="text-sm font-medium mb-1">Admin Notes:</p>
                                        <p className="text-sm text-muted-foreground">{item.admin_notes}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Details Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="bg-card rounded-2xl border border-border/50 max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Order Details</h3>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                                ✕
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                                    <p className="font-mono text-sm">{selectedItem.id}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Amount</label>
                                    <p className="text-lg font-bold">
                                        ₹{selectedItem.type === 'payment' ? (selectedItem as PaymentStatus & { type: 'payment' }).amount : (selectedItem as OrderStatus & { type: 'order' }).total_price}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                                    <p className="text-sm">
                                        {format(new Date(selectedItem.created_at), 'PPpp')}
                                    </p>
                                </div>

                                {selectedItem.transaction_id && (
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Transaction ID
                                        </label>
                                        <p className="font-mono text-sm">{selectedItem.transaction_id}</p>
                                    </div>
                                )}

                                {selectedItem.type === 'payment' && 'screenshot_url' in selectedItem && selectedItem.screenshot_url && (
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Payment Proof
                                        </label>
                                        <img
                                            src={selectedItem.screenshot_url}
                                            alt="Payment proof"
                                            className="mt-2 rounded-lg border border-border/50 max-h-60 object-contain"
                                        />
                                    </div>
                                )}

                                {selectedItem.admin_notes && (
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Admin Notes
                                        </label>
                                        <p className="mt-2 p-3 bg-muted rounded-lg text-sm">
                                            {selectedItem.admin_notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderStatusTracker;
