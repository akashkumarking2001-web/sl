import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ReferralUser {
    id: string;
    full_name: string | null;
    email: string | null;
    has_purchased: boolean | null;
    purchased_plan: string | null;
    created_at: string;
}

export const useAffiliateData = () => {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [referrals, setReferrals] = useState<ReferralUser[]>([]);
    const [earnings, setEarnings] = useState({
        total: 0,
        monthly: 0,
        balance: 0
    });

    const fetchData = useCallback(async () => {
        if (!profile?.id) return;
        setLoading(true);

        try {
            // 1. Fetch Referrals
            const { data: refData, error: refError } = await supabase
                .from("profiles")
                .select("id, full_name, email, has_purchased, purchased_plan, created_at")
                .eq("referred_by", profile.id)
                .order("created_at", { ascending: false });

            if (refError) throw refError;
            setReferrals((refData as ReferralUser[]) || []);

            // 2. Fetch Earnings (Consolidated Sync)
            // Parallel fetch for income and withdrawals
            const [incomeRes, withdrawRes] = await Promise.all([
                supabase.from('agent_income' as any).select('amount, created_at').eq('agent_id', profile.id),
                supabase.from('withdrawal_requests').select('amount, status').eq('user_id', profile.id)
            ]);

            const income = (incomeRes.data as any[]) || [];
            const totalIncome = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const monthlyIncome = income
                .filter(item => item.created_at >= startOfMonth)
                .reduce((sum, item) => sum + Number(item.amount || 0), 0);

            const withdrawals = (withdrawRes.data as any[]) || [];
            const totalWithdrawn = withdrawals
                .filter(w => w.status !== 'rejected')
                .reduce((sum, w) => sum + Number(w.amount || 0), 0);

            setEarnings({
                total: totalIncome,
                monthly: monthlyIncome,
                balance: totalIncome - totalWithdrawn
            });

        } catch (error) {
            console.error("Affiliate Data Sync Error:", error);
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { loading, referrals, earnings, refresh: fetchData };
};
