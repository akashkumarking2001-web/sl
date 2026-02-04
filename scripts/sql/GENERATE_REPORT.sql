-- ==============================================================================
-- ANALYTICS & REPORTING SCRIPT
-- ==============================================================================
-- Run this script to generate the "Income Distribution Chart" and System Health Check.
-- ==============================================================================

-- 1. SYSTEM HEALTH SUMMARY
SELECT 
    'Total Users' as Metric, 
    COUNT(*)::TEXT as Value 
FROM public.profiles
UNION ALL
SELECT 
    'Active Packages', 
    COUNT(DISTINCT user_id)::TEXT 
FROM public.revenue_share_tree
UNION ALL
SELECT 
    'Total Income Distributed (₹)', 
    COALESCE(SUM(total_income), 0)::TEXT 
FROM public.agent_income
UNION ALL
SELECT 
    'Revenue Share Tree Nodes', 
    COUNT(*)::TEXT 
FROM public.revenue_share_tree;

-- 2. INCOME DISTRIBUTION BY TYPE
SELECT 
    income_type, 
    COUNT(*) as transaction_count, 
    SUM(amount) as total_amount
FROM public.wallet_history
WHERE status = 'credit'
GROUP BY income_type
ORDER BY total_amount DESC;

-- 3. TOP 20 EARNERS (Income Distribution Chart)
SELECT 
    p.full_name, 
    COALESCE(rst.package_type, 'N/A') as package,
    ai.total_income as lifetime_earnings,
    ai.wallet as current_balance,
    (SELECT COUNT(*) FROM public.profiles WHERE sponsor_id = p.id) as direct_referrals
FROM public.agent_income ai
JOIN public.profiles p ON ai.user_id = p.user_id
LEFT JOIN public.revenue_share_tree rst ON p.user_id = rst.user_id
ORDER BY ai.total_income DESC
LIMIT 20;

-- 4. REVENUE SHARE TREE DEPTH CHECK
SELECT 
    package_type, 
    COUNT(*) as total_nodes,
    MAX(downline_count) as max_downline_size,
    AVG(downline_count) as avg_downline_size
FROM public.revenue_share_tree
GROUP BY package_type;
