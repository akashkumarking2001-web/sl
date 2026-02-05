import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bell, ShoppingCart, UserPlus, Wallet, CheckSquare } from 'lucide-react';

export interface RealtimeNotification {
    id: string;
    type: 'payment' | 'registration' | 'order' | 'withdrawal' | 'task';
    title: string;
    message: string;
    timestamp: Date;
    data?: any;
}

/**
 * Real-time notification hook for Admin Panel
 * Listens to multiple tables and triggers instant toast notifications
 */
export const useRealtimeNotifications = (enabled: boolean = true) => {
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!enabled) return;

        // Channel for payments (package purchases)
        const paymentsChannel = supabase
            .channel('admin-payments')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'payments',
                },
                (payload) => {
                    const payment = payload.new as any;
                    const notification: RealtimeNotification = {
                        id: payment.id,
                        type: 'payment',
                        title: '💰 New Payment Request',
                        message: `${payment.plan_name} - ₹${payment.amount}`,
                        timestamp: new Date(),
                        data: payment,
                    };

                    setNotifications((prev) => [notification, ...prev]);
                    setUnreadCount((prev) => prev + 1);

                    toast({
                        title: notification.title,
                        description: notification.message,
                        action: {
                            label: 'View',
                            onClick: () => {
                                // Navigate to payments tab
                                window.dispatchEvent(new CustomEvent('navigate-admin-tab', { detail: 'payments' }));
                            },
                        },
                    });
                }
            )
            .subscribe();

        // Channel for new user registrations
        const profilesChannel = supabase
            .channel('admin-profiles')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'profiles',
                },
                (payload) => {
                    const profile = payload.new as any;
                    const notification: RealtimeNotification = {
                        id: profile.id,
                        type: 'registration',
                        title: '👤 New User Registration',
                        message: `${profile.full_name || 'New User'} (${profile.student_id})`,
                        timestamp: new Date(),
                        data: profile,
                    };

                    setNotifications((prev) => [notification, ...prev]);
                    setUnreadCount((prev) => prev + 1);

                    toast({
                        title: notification.title,
                        description: notification.message,
                    });
                }
            )
            .subscribe();

        // Channel for shopping orders
        const ordersChannel = supabase
            .channel('admin-orders')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'shopping_orders',
                },
                (payload) => {
                    const order = payload.new as any;
                    const notification: RealtimeNotification = {
                        id: order.id,
                        type: 'order',
                        title: '🛒 New Shopping Order',
                        message: `Order #${order.id.slice(0, 8)} - ₹${order.total_price}`,
                        timestamp: new Date(),
                        data: order,
                    };

                    setNotifications((prev) => [notification, ...prev]);
                    setUnreadCount((prev) => prev + 1);

                    toast({
                        title: notification.title,
                        description: notification.message,
                        action: {
                            label: 'View',
                            onClick: () => {
                                window.dispatchEvent(new CustomEvent('navigate-admin-tab', { detail: 'shopping-orders' }));
                            },
                        },
                    });
                }
            )
            .subscribe();

        // Channel for withdrawal requests
        const withdrawalsChannel = supabase
            .channel('admin-withdrawals')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'withdrawal_requests',
                },
                (payload) => {
                    const withdrawal = payload.new as any;
                    const notification: RealtimeNotification = {
                        id: withdrawal.id,
                        type: 'withdrawal',
                        title: '💸 New Withdrawal Request',
                        message: `₹${withdrawal.amount} requested`,
                        timestamp: new Date(),
                        data: withdrawal,
                    };

                    setNotifications((prev) => [notification, ...prev]);
                    setUnreadCount((prev) => prev + 1);

                    toast({
                        title: notification.title,
                        description: notification.message,
                        action: {
                            label: 'View',
                            onClick: () => {
                                window.dispatchEvent(new CustomEvent('navigate-admin-tab', { detail: 'withdrawals' }));
                            },
                        },
                    });
                }
            )
            .subscribe();

        // Cleanup on unmount
        return () => {
            supabase.removeChannel(paymentsChannel);
            supabase.removeChannel(profilesChannel);
            supabase.removeChannel(ordersChannel);
            supabase.removeChannel(withdrawalsChannel);
        };
    }, [enabled, toast]);

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const clearAll = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return {
        notifications,
        unreadCount,
        markAsRead,
        clearAll,
    };
};
