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
            ai.agent_id,
            SUM(ai.amount) as total_earned
        FROM 
            public.agent_income ai
        WHERE 
            (period_start IS NULL OR ai.created_at >= period_start)
        GROUP BY 
            ai.agent_id
    ),
    UserReferrals AS (
        SELECT
            p.referred_by as agent_id,
            COUNT(*) as ref_count
        FROM
            public.profiles p
        WHERE
            p.referred_by IS NOT NULL
            AND (period_start IS NULL OR p.created_at >= period_start)
        GROUP BY
            p.referred_by
    )
    SELECT 
        ue.agent_id,
        COALESCE(p.full_name, 'Unknown Agent') as full_name,
        ue.total_earned as earnings,
        COALESCE(ur.ref_count, 0) as referrals,
        RANK() OVER (ORDER BY ue.total_earned DESC) as rank
    FROM 
        UserEarnings ue
    JOIN 
        public.profiles p ON ue.agent_id = p.id
    LEFT JOIN
        UserReferrals ur ON ue.agent_id = ur.agent_id
    ORDER BY 
        rank ASC
    LIMIT 20;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_affiliate_leaderboard(TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_affiliate_leaderboard(TIMESTAMPTZ) TO service_role;
