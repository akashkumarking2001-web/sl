-- Function to fetch affiliate leaderboard
-- Drop if exists to ensure clean slate
DROP FUNCTION IF EXISTS public.get_affiliate_leaderboard(TIMESTAMPTZ);

CREATE OR REPLACE FUNCTION public.get_affiliate_leaderboard(
    period_start TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    agent_id UUID,
    full_name TEXT,
    earnings NUMERIC,
    referrals BIGINT,
    rank BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH UserEarnings AS (
        SELECT 
            wh.user_id as agent_id,
            SUM(wh.amount) as total_earned
        FROM 
            public.wallet_history wh
        WHERE 
            wh.status = 'credit'
            AND (period_start IS NULL OR wh.created_at >= period_start)
        GROUP BY 
            wh.user_id
    ),
    UserReferrals AS (
        SELECT
            p.user_id as agent_id,
            0 as ref_count -- Placeholder until we confirm referral tracking (code vs uuid)
        FROM
             public.profiles p
        -- Logic for counting referrals would go here if we knew the schema for 'reffered_by' (UUID vs Code)
    )
    SELECT 
        ue.agent_id,
        COALESCE(p.full_name, 'Unknown Agent') as full_name,
        ue.total_earned as earnings,
        COALESCE(0, 0) as referrals, -- Reset referrals to 0 for now to avoid errors
        RANK() OVER (ORDER BY ue.total_earned DESC) as rank
    FROM 
        UserEarnings ue
    JOIN 
        public.profiles p ON ue.agent_id = p.user_id
    ORDER BY 
        rank ASC
    LIMIT 20;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_affiliate_leaderboard(TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_affiliate_leaderboard(TIMESTAMPTZ) TO service_role;
